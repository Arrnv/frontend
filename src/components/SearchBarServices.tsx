'use client';

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { debounce } from "@/lib/debounce";

type Service = {
  id: string;
  label?: string;
  icon_url?: string;
  city?: string;
};

const SearchBarServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [cityQuery, setCityQuery] = useState("");
  const [serviceQuery, setServiceQuery] = useState("");

  const [cityDBList, setCityDBList] = useState<string[]>([]);
  const [googleCities, setGoogleCities] = useState<string[]>([]);

  const router = useRouter();

  // Fetch services + DB cities
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/search/services`);
        setServices(res.data.services);

        const dbCities = Array.from(
          new Set(res.data.services.map((s: Service) => s.city).filter(Boolean))
        ) as string[];

        setCityDBList(dbCities);
      } catch (err) {
        console.error("Failed to fetch services", err);
      }
    };
    fetchData();
  }, []);

  // Filter services from DB
  useEffect(() => {
    const lowerService = serviceQuery.toLowerCase();
    const lowerCity = cityQuery.toLowerCase();

    const matched = services.filter((s) => {
      const matchesService = s.label?.toLowerCase().includes(lowerService) ?? false;
      const matchesCity = lowerCity ? s.city?.toLowerCase().includes(lowerCity) : true;
      return matchesService && matchesCity;
    });

    setFilteredServices(matched);
  }, [serviceQuery, cityQuery, services]);

  // Debounced Google API call
  const fetchGoogleCities = useCallback(
    debounce(async (query: string) => {
      if (!query || query.length < 2) return;

      try {
        const res = await axios.get(`/api/google/cities?input=${query}`);
        setGoogleCities(res.data.predictions || []);
      } catch {
        setGoogleCities([]);
      }
    }, 400),
    []
  );

  useEffect(() => {
    if (!cityQuery) {
      setGoogleCities([]);
      return;
    }
    fetchGoogleCities(cityQuery);
  }, [cityQuery]);

  // Handle selection
  const handleSelectCity = (city: string) => {
    setCityQuery(city);
    setGoogleCities([]);
  };

  const handleSelectService = (service: Service) => {
    setServiceQuery(service.label ?? "");
    setCityQuery(service.city ?? "");
    setFilteredServices([]);

    router.push(
      `/customer/Services?type=services&subcategory=${service.id}&location=${encodeURIComponent(
        service.city ?? ""
      )}`
    );
  };

  const handleSearch = () => {
    if (filteredServices.length > 0) {
      handleSelectService(filteredServices[0]);
      return;
    }

    router.push(
      `/customer/Services?type=services&subcategory=${encodeURIComponent(
        serviceQuery
      )}&location=${encodeURIComponent(cityQuery)}`
    );
  };

  // Combined dropdown cities
  const mergedCities = [
    ...cityDBList.filter((c) =>
      c.toLowerCase().includes(cityQuery.toLowerCase())
    ),
    ...googleCities.filter((g) => !cityDBList.includes(g)),
  ];

  const noServicesInArea = cityQuery && mergedCities.length === 0;

  return (
    <div className="relative w-full p-4">
      {/* Inputs */}
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

        {/* Services */}
        <div className="flex items-center px-4 w-1/2 border-r border-gray-200">
          <input
            type="text"
            placeholder="Services & Companies"
            className="w-full outline-none text-sm text-gray-700 bg-transparent"
            value={serviceQuery}
            onChange={(e) => setServiceQuery(e.target.value)}
          />
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="flex items-center justify-center w-16 bg-[#0099E8] text-white"
        >
          🔍
        </button>
      </div>

      {/* City dropdown (Merged) */}
{cityQuery && (mergedCities.length > 0 || noServicesInArea) && (
  <ul className="
    absolute top-full left-0 mt-2 w-full max-h-[240px] overflow-y-auto z-50
    backdrop-blur-xl bg-white/30 border border-white/40 shadow-2xl rounded-xl
    text-black text-sm
  ">
    {mergedCities.map((city) => (
      <li
        key={city}
        className="
          px-4 py-3 cursor-pointer select-none
          hover:bg-white/40 hover:backdrop-blur-2xl transition-all
          flex justify-between items-center
        "
        onClick={() => handleSelectCity(city)}
      >
        <span>{city}</span>
        {googleCities.includes(city) && (
          <span className="text-xs text-blue-600 italic">(Google)</span>
        )}
      </li>
    ))}

    {noServicesInArea && (
      <li className="px-4 py-3 text-red-600 italic text-center">
        No services yet in this area
      </li>
    )}
  </ul>
)}


      {/* Service suggestions */}
{serviceQuery && filteredServices.length > 0 && (
  <ul className="
    absolute top-full left-0 mt-2 w-full max-h-[240px] overflow-y-auto z-50
    backdrop-blur-xl bg-white/30 border border-white/40 shadow-2xl rounded-xl
    text-black text-sm
  ">
    {filteredServices.map((service) => (
      <li
        key={service.id}
        className="
          flex items-center gap-3 px-4 py-3 cursor-pointer
          hover:bg-white/40 hover:backdrop-blur-2xl transition-all
        "
        onClick={() => handleSelectService(service)}
      >
        {service.icon_url && (
          <img src={service.icon_url} className="w-5 h-5 rounded-sm" />
        )}

        <span className="font-medium">{service.label}</span>

        {service.city && (
          <span className="ml-auto text-xs text-gray-700 italic">
            {service.city}
          </span>
        )}
      </li>
    ))}
  </ul>
)}

    </div>
  );
};

export default SearchBarServices;
