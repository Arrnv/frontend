'use client';

import { useEffect, useState, useMemo, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { debounce } from "@/lib/debounce";

type Service = {
  id: string;
  label?: string;
  icon_url?: string;
  city?: string;
  latitude?: number | null;
  longitude?: number | null;
};

const EARTH_RADIUS_KM = 6371;

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_KM * c;
}

function extractCityFromAddress(address: string) {
  if (!address) return "";
  const parts = address.split(",").map((p) => p.trim());
  if (parts.length >= 3) {
    const city = parts[1];
    const stateZip = parts[2];
    return `${city}, ${stateZip}`;
  }
  return parts.length > 0 ? parts[parts.length - 1] : address;
}

export default function SearchBarServices() {
  const router = useRouter();

  const [services, setServices] = useState<Service[]>([]);
  const [serviceQuery, setServiceQuery] = useState("");
  const [cityQuery, setCityQuery] = useState("");

  const [cityDBList, setCityDBList] = useState<string[]>([]);
  const [googleCities, setGoogleCities] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/search/services`);
        if (cancelled) return;

        const normalized: Service[] = (res.data.services || []).map((s: any) => {
          const city = s.city || (s.location ? extractCityFromAddress(s.location) : "") || "";
          return {
            id: s.id,
            label: s.label || s.name || "",
            icon_url: s.icon_url,
            city,
            latitude: s.latitude ?? s.lat ?? null,
            longitude: s.longitude ?? s.lng ?? s.lon ?? null,
          } as Service;
        });

        setServices(normalized);

        const dbCities = Array.from(
          new Set(normalized.map((s) => s.city).filter(Boolean))
        ) as string[];

        setCityDBList(dbCities);
      } catch (err) {
        console.error("Failed to fetch services", err);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, []);

const debouncedFetcher = useMemo(
  () =>
    debounce(async (query: string) => {
      if (!query || query.length < 2) return;
      try {
        const res = await axios.get(
          `/api/google/cities?input=${encodeURIComponent(query)}`
        );
        setGoogleCities(res.data.predictions || []);
      } catch {
        setGoogleCities([]);
      }
    }, 350),
  []
);

const fetchGoogleCities = useCallback(
  (q: string) => debouncedFetcher(q),
  [debouncedFetcher]
);


  useEffect(() => {
    if (!cityQuery) {
      setGoogleCities([]);
      return;
    }
    fetchGoogleCities(cityQuery);
  }, [cityQuery, fetchGoogleCities]);

  const mergedCities = [
    ...cityDBList.filter((c) => c.toLowerCase().includes(cityQuery.toLowerCase())),
    ...googleCities.filter((g) => !cityDBList.includes(g)),
  ];

  const cityCoords = useMemo(() => {
    const map = new Map<string, { lat: number; lon: number }>();
    services.forEach((s) => {
      if (!s.city) return;
      if (!map.has(s.city) && s.latitude != null && s.longitude != null) {
        map.set(s.city, { lat: s.latitude as number, lon: s.longitude as number });
      }
    });
    return map;
  }, [services]);

  function findNearestCitiesForService(serviceId: string, maxResults = 5) {
    const cities = Array.from(
      new Set(services.filter((s) => s.id === serviceId && s.city).map((s) => s.city as string))
    );

    if (cities.length === 0) return [];

    const userCityKey = (() => {
      if (!cityQuery) return null;
      const short = cityQuery.split(",")[0].trim().toLowerCase();
      const exact = cities.find((c) => c.toLowerCase() === cityQuery.toLowerCase());
      if (exact) return exact;
      return cities.find((c) => c.toLowerCase().startsWith(short)) || null;
    })();

    const userCoords = userCityKey ? cityCoords.get(userCityKey) ?? null : null;

    if (userCoords) {
      return cities
        .map((c) => {
          const coords = cityCoords.get(c);
          if (!coords) return { city: c, distance: Infinity };
          const d = haversineKm(userCoords.lat, userCoords.lon, coords.lat, coords.lon);
          return { city: c, distance: isFinite(d) ? d : Infinity };
        })
        .filter((x) => x.distance !== Infinity)
        .sort((a, b) => a.distance - b.distance)
        .slice(0, maxResults);
    }

    // fallback string similarity
    const userShort = cityQuery.split(",")[0].trim().toLowerCase();
    const scoreOf = (a: string) => {
      const b = a.toLowerCase();
      if (b.startsWith(userShort)) return 1.0;
      const len = Math.min(userShort.length, b.length);
      let match = 0;
      for (let i = 0; i < len; i++) if (userShort[i] === b[i]) match++;
      return match / Math.max(1, Math.max(userShort.length, b.length));
    };

    return cities
      .map((c) => ({ city: c, distance: 1 - scoreOf(c) }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, maxResults);
  }

  const goToCityForService = (serviceId: string, targetCity: string) => {
    router.push(
      `/customer/Services?type=services&subcategory=${serviceId}&location=${encodeURIComponent(targetCity)}`
    );
  };

  const isServiceAvailableInCity = (serviceId: string, selectedCity: string) => {
    if (!selectedCity) return false;
    const lower = selectedCity.toLowerCase().split(",")[0].trim();
    return services.some(
      (s) => s.id === serviceId && s.city?.toLowerCase().startsWith(lower)
    );
  };

  // 🔥 FIX: REMOVE DUPLICATE SERVICES
  const visibleServices = useMemo(() => {
    const q = serviceQuery.trim().toLowerCase();
    const filtered = !q
      ? services
      : services.filter((s) => (s.label || "").toLowerCase().includes(q));

    const uniqueMap = new Map<string, Service>();
    filtered.forEach((s) => {
      if (!uniqueMap.has(s.id)) uniqueMap.set(s.id, s);
    });

    return Array.from(uniqueMap.values());
  }, [serviceQuery, services]);

  return (
    <div className="relative w-full p-4">
      {/* Search bar */}
      <div className="flex overflow-hidden rounded-sm border border-gray-200 bg-white h-15 w-full">
        {/* Location */}
        <div className="flex items-center px-4 w-1/2 border-r border-gray-200">
          <input
            type="text"
            placeholder="Location"
            className="w-full outline-none text-sm text-gray-700 bg-transparent"
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
          />
        </div>

        {/* Service */}
        <div className="flex items-center px-4 w-1/2 border-r border-gray-200">
          <input
            type="text"
            placeholder="Services & Companies"
            className="w-full outline-none text-sm text-gray-700 bg-transparent"
            value={serviceQuery}
            onChange={(e) => setServiceQuery(e.target.value)}
          />
        </div>

        <button
          onClick={() => {
            router.push(
              `/customer/Services?type=services&subcategory=${encodeURIComponent(serviceQuery)}&location=${encodeURIComponent(cityQuery)}`
            );
          }}
          className="flex items-center justify-center w-16 bg-[#0099E8] text-white"
        >
          🔍
        </button>
      </div>

      {/* City dropdown */}
      {cityQuery && (mergedCities.length > 0 || cityQuery) && (
        <ul className="absolute top-full left-0 mt-2 w-full max-h-[240px] overflow-y-auto z-50 bg-white border border-gray-300 shadow-xl rounded-xl text-black text-sm">
          {mergedCities.map((city) => (
            <li
              key={city}
              className="px-4 py-3 cursor-pointer hover:bg-gray-100 transition-all"
              onClick={() => {
                setCityQuery(city);
                setGoogleCities([]);
              }}
            >
              {city}
            </li>
          ))}
        </ul>
      )}

      {/* Services dropdown */}
      {serviceQuery && (
        <ul className="absolute top-full left-0 mt-2 w-full max-h-[320px] overflow-y-auto z-50 bg-white border border-gray-300 shadow-xl rounded-xl text-black text-sm">
          {visibleServices.map((svc) => {
            const available = isServiceAvailableInCity(svc.id, cityQuery);
            const nearest = !available ? findNearestCitiesForService(svc.id, 3) : [];

            return (
<li
  key={svc.id}
  className="flex flex-col px-4 py-3 hover:bg-gray-100 transition-all cursor-pointer"
  onClick={() =>
    goToCityForService(
      svc.id,
      available ? cityQuery : nearest[0]?.city || cityQuery
    )
  }
>
  <div className="flex items-center gap-3">
{svc.icon_url && <img src={svc.icon_url} alt={svc.label || ""} className="w-5 h-5 rounded-sm" />}
    <span className="font-medium">{svc.label}</span>

    {/* RIGHT SIDE INDICATOR */}
    <div className="ml-auto flex items-center gap-2">
      {available ? (
        <span className="text-xs text-green-700 bg-green-100 px-2 py-1 rounded">
          Available in {cityQuery.split(",")[0].trim()}
        </span>
      ) : (
        <span className="text-xs text-red-600 bg-red-50 px-2 py-1 rounded">
          Not in {cityQuery.split(",")[0].trim()}
        </span>
      )}

      {/* Navigation hint */}
      <span className="text-gray-400 text-sm">→</span>
    </div>
  </div>

  {/* Unavailable → nearest list */}
  {!available && nearest.length > 0 && (
    <div className="mt-1 text-xs text-gray-700 italic flex flex-wrap gap-2">
      <span>Available in:</span>
      {nearest.map((n, idx) => (
        <button
          key={idx}
          onClick={(e) => {
            e.stopPropagation();
            goToCityForService(svc.id, n.city);
          }}
          className="text-blue-600 underline"
        >
          {n.city} ({n.distance.toFixed(1)} km)
        </button>
      ))}
    </div>
  )}
</li>

            );
          })}
        </ul>
      )}
    </div>
  );
}