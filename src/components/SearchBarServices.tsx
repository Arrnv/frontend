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
   ICONS (INLINE SVG – PRO)
============================ */
const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 21L16.65 16.65M18 11C18 14.866 14.866 18 11 18C7.134 18 4 14.866 4 11C4 7.134 7.134 4 11 4C14.866 4 18 7.134 18 11Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

/* ============================
   COMPONENT
============================ */
export default function SearchBarServices() {
  const router = useRouter();

  const [results, setResults] = useState<SearchResult[]>([]);
  const [serviceQuery, setServiceQuery] = useState('');
  const [cityQuery, setCityQuery] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showCityDropdown, setShowCityDropdown] = useState(false);
  const requestIdRef = useRef(0);

  const goToService = (serviceId: string, city: string) => {
    router.push(
      `/customer/Services?type=services&subcategory=${serviceId}&location=${encodeURIComponent(city)}`
    );
  };

  /* ============================
     FETCH LOGIC
  ============================ */
  const fetchResultsRef = useRef(
    debounce(async (q: string, city: string) => {
      const id = ++requestIdRef.current;
      if (q.length < 2 && city.length < 2) return setResults([]);

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/search/services`,
          { params: { q, city, limit: 12 } }
        );
        if (id === requestIdRef.current) {
          setResults(res.data.results || []);
        }
      } catch {
        if (id === requestIdRef.current) setResults([]);
      }
    }, 300)
  );

  const fetchCitiesRef = useRef(
    debounce(async (q: string) => {
      if (q.length < 2) return setCitySuggestions([]);
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

  useEffect(() => {
    fetchResultsRef.current(serviceQuery, cityQuery);
  }, [serviceQuery, cityQuery]);

  useEffect(() => {
    if (showCityDropdown) fetchCitiesRef.current(cityQuery);
  }, [cityQuery, showCityDropdown]);

  const visibleServices = useMemo(() => {
    const map = new Map<string, SearchResult>();
    results.forEach(r => {
      const key = `${r.serviceId}-${r.city.toLowerCase()}`;
      if (!map.has(key)) map.set(key, r);
    });
    return Array.from(map.values());
  }, [results]);

  /* ============================
     RENDER
  ============================ */
return (
  <div className="relative w-full max-w-3xl mx-auto px-4 sm:px-0">
    {/* SEARCH BAR */}
    <div
      className="
        flex flex-col sm:flex-row
        bg-white
        rounded-2xl
        shadow-lg
        ring-1 ring-black/5
        overflow-hidden
        transition
        focus-within:ring-2
        focus-within:ring-blue-600
      "
    >
      {/* LOCATION */}
      <div className="flex-1 px-4 py-3">
        <input
          placeholder="City"
          value={cityQuery}
          onChange={(e) => {
            setCityQuery(e.target.value);
            setShowCityDropdown(true);
          }}
          onBlur={() => setTimeout(() => setShowCityDropdown(false), 150)}
          className="
            w-full
            bg-transparent
            outline-none
            text-sm sm:text-base
            font-medium
            text-slate-800
            placeholder:text-slate-400
          "
        />
      </div>

      {/* DIVIDER (DESKTOP ONLY) */}
      <div className="hidden sm:block h-6 w-px bg-slate-200 self-center" />

      {/* SERVICE */}
      <div className="flex-1 px-4 py-3 border-t sm:border-t-0 border-slate-100">
        <input
          placeholder="What are you looking for?"
          value={serviceQuery}
          onChange={(e) => setServiceQuery(e.target.value)}
          className="
            w-full
            bg-transparent
            outline-none
            text-sm sm:text-base
            font-medium
            text-slate-800
            placeholder:text-slate-400
          "
        />
      </div>

      {/* SEARCH BUTTON */}
      <button
        className="
          flex items-center justify-center
          px-6 py-4 sm:py-0
          sm:self-stretch
          bg-blue-600
          text-white
          hover:bg-blue-700
          transition
        "
        onClick={() => {
          if (visibleServices.length === 1) {
            const s = visibleServices[0];
            goToService(s.serviceId, s.city);
          }
        }}
      >
        <SearchIcon />
      </button>
    </div>

    {/* CITY DROPDOWN */}
    {showCityDropdown && citySuggestions.length > 0 && (
      <ul className="
        absolute z-50 mt-3 w-full
        bg-white
        rounded-xl
        shadow-2xl
        ring-1 ring-black/10
        overflow-hidden
      ">
        {citySuggestions.map(city => (
          <li
            key={city}
            onMouseDown={() => {
              setCityQuery(city);
              setShowCityDropdown(false);
            }}
            className="
              px-5 py-4
              text-sm sm:text-base
              cursor-pointer
              text-slate-700
              hover:bg-blue-50
              hover:text-blue-700
              transition
            "
          >
            {city}
          </li>
        ))}
      </ul>
    )}

    {/* SERVICES DROPDOWN */}
    {serviceQuery && visibleServices.length > 0 && (
      <ul className="
        absolute z-40 mt-3 w-full
        bg-white
        rounded-xl
        shadow-2xl
        ring-1 ring-black/10
        overflow-hidden
      ">
        {visibleServices.map(svc => (
          <li
            key={`${svc.serviceId}-${svc.city}`}
            onClick={() => svc.available && goToService(svc.serviceId, svc.city)}
            className="
              px-5 py-4
              hover:bg-slate-50
              transition
              cursor-pointer
            "
          >
            <div className="flex items-center gap-4">
              {svc.icon && (
                <img
                  src={svc.icon}
                  className="w-8 h-8 rounded-md shrink-0"
                />
              )}

              <div className="flex-1 min-w-0">
                <div className="font-medium text-slate-800 truncate">
                  {svc.serviceName}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 truncate">
                  {svc.city}
                </div>
              </div>

              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  svc.available
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {svc.available ? 'Available' : 'Nearby'}
              </span>
            </div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

}
