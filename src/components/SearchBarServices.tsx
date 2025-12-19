'use client';

import { useEffect, useState, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { debounce } from '@/lib/debounce';

/* ============================
   TYPES
============================ */
type SearchResult = {
  serviceId: string;
  serviceName: string;
  icon?: string;
  city: string;
  available: boolean;
  nearest: { city: string; distanceKm: number }[];
};

/* ============================
   COMPONENT
============================ */
export default function SearchBarServices() {
  const router = useRouter();

  /* ============================
     STATE
  ============================ */
  const [results, setResults] = useState<SearchResult[]>([]);
  const [serviceQuery, setServiceQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const requestIdRef = useRef(0);

  /* ============================
     HELPERS
  ============================ */
  const goToService = (serviceId: string, city: string) => {
    router.push(
      `/customer/Services?type=services` +
        `&subcategory=${serviceId}` +
        `&location=${encodeURIComponent(city)}`
    );
  };

  const normalizeCityInput = (input: string) =>
    input.split(',')[0].trim().toLowerCase();

  /* ============================
     FETCH SEARCH RESULTS
  ============================ */
  const fetchResultsRef = useRef(
    debounce(async (q: string, city: string) => {
      const currentRequestId = ++requestIdRef.current;

      if (q.length < 2 && city.length < 2) {
        setResults([]);
        return;
      }

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/search/services`,
          { params: { q, city, limit: 15 } }
        );

        if (currentRequestId !== requestIdRef.current) return;
        setResults(res.data.results || []);
      } catch {
        if (currentRequestId !== requestIdRef.current) return;
        setResults([]);
      }
    }, 300)
  );

  const fetchCitiesRef = useRef(
    debounce(async (q: string) => {
      if (q.length < 2) {
        setCitySuggestions([]);
        return;
      }

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/search/cities`,
          { params: { q } }
        );
        setCitySuggestions(res.data.cities || []);
      } catch {
        setCitySuggestions([]);
      }
    }, 300)
  );

  /* ============================
     EFFECTS
  ============================ */
  useEffect(() => {
    fetchResultsRef.current(serviceQuery, cityQuery);
  }, [serviceQuery, cityQuery]);

  useEffect(() => {
    if (showCityDropdown) {
      fetchCitiesRef.current(normalizeCityInput(cityQuery));
    }
  }, [cityQuery, showCityDropdown]);

  /* ============================
     DEDUPE + RANK
  ============================ */
  const visibleServices = useMemo(() => {
    const map = new Map<string, SearchResult>();

    results.forEach((r) => {
      const key = `${r.serviceId}-${r.city.toLowerCase()}`;
      if (!map.has(key)) map.set(key, r);
    });

    return Array.from(map.values()).slice(0, 12);
  }, [results]);

  /* ============================
     RENDER
  ============================ */
  return (
    <div className="relative w-full p-4">
      {/* SEARCH BAR */}
      <div className="flex overflow-hidden rounded-sm border border-gray-200 bg-white w-full">
        {/* LOCATION */}
        <div className="flex items-center px-4 w-1/2 border-r border-gray-200">
          <input
            type="text"
            placeholder="Location"
            className="w-full outline-none text-sm text-gray-700 bg-transparent h-[3rem]"
            value={cityQuery}
            onChange={(e) => {
              setCityQuery(e.target.value);
              setShowCityDropdown(true);
              setResults([]);
            }}
            onBlur={() => setTimeout(() => setShowCityDropdown(false), 150)}
          />
        </div>

        {/* SERVICE */}
        <div className="flex items-center px-4 w-1/2 border-r border-gray-200">
          <input
            type="text"
            placeholder="Services & Companies"
            className="w-full outline-none text-sm text-gray-700 bg-transparent"
            value={serviceQuery}
            onChange={(e) => {
              setServiceQuery(e.target.value);
              setResults([]);
            }}
          />
        </div>

        {/* SEARCH BUTTON */}
        <button
          onClick={() => {
            if (visibleServices.length === 1) {
              const svc = visibleServices[0];
              goToService(svc.serviceId, svc.city);
            }
          }}
          className="flex items-center justify-center w-16 bg-[#0099E8] text-white"
        >
          🔍
        </button>
      </div>

      {/* CITY DROPDOWN */}
      {showCityDropdown && citySuggestions.length > 0 && (
        <ul className="absolute top-full left-0 mt-2 w-full max-h-[220px] overflow-y-auto z-50 bg-white border border-gray-300 shadow-xl rounded-xl text-black text-sm">
          {citySuggestions.map((city) => (
            <li
              key={city}
              className="px-4 py-3 cursor-pointer hover:bg-gray-100"
              onMouseDown={() => {
                setCityQuery(city);
                setCitySuggestions([]);
                setShowCityDropdown(false);
              }}
            >
              {city}
            </li>
          ))}
        </ul>
      )}

      {/* SERVICES DROPDOWN */}
      {serviceQuery && visibleServices.length > 0 && (
        <ul className="absolute top-full left-0 mt-2 w-full max-h-[320px] overflow-y-auto z-40 bg-white border border-gray-300 shadow-xl rounded-xl text-black text-sm">
          {visibleServices.map((svc) => (
            <li
              key={`${svc.serviceId}-${svc.city}`}
              className="px-4 py-3 hover:bg-gray-50"
            >
              {/* MAIN ROW */}
              <div
                className="flex items-center cursor-pointer"
                onClick={() => {
                  if (svc.available) {
                    goToService(svc.serviceId, svc.city);
                  }
                }}
              >
                {svc.icon && (
                  <img
                    src={svc.icon}
                    alt={svc.serviceName}
                    className="w-5 h-5 mr-3"
                  />
                )}

                <span className="font-medium">{svc.serviceName}</span>

                <span className="ml-auto text-xs px-2 py-1 rounded">
                  {svc.available ? (
                    <span className="text-green-700 bg-green-100">
                      Available in {svc.city.split(',')[0]}
                    </span>
                  ) : (
                    <span className="text-red-600 bg-red-50">
                      Not in {cityQuery.split(',')[0]}
                    </span>
                  )}
                </span>
              </div>

              {/* NEAREST CITIES */}
              {!svc.available && svc.nearest?.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2 text-xs">
                  <span className="text-gray-600">Available in:</span>
                  {svc.nearest.map((n, idx) => (
                    <button
                      key={idx}
                      onClick={(e) => {
                        e.stopPropagation();
                        goToService(svc.serviceId, n.city);
                      }}
                      className="px-3 py-1 border rounded text-blue-600 hover:bg-blue-50"
                    >
                      {n.city} ({n.distanceKm.toFixed(1)} km)
                    </button>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
