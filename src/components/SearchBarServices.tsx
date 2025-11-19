'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type Service = {
  id: string;
  label?: string;
  icon_url?: string;
  city?: string;
};

const SearchBarServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [filteredServices, setFilteredServices] = useState<Service[]>([]);
  const [cityQuery, setCityQuery] = useState('');
  const [serviceQuery, setServiceQuery] = useState('');
  const [citySuggestions, setCitySuggestions] = useState<string[]>([]);
  const [showServiceSuggestions, setShowServiceSuggestions] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/search/services`);
        setServices(res.data.services);
        const uniqueCities = Array.from(
          new Set(res.data.services.map((s: Service) => s.city).filter(Boolean))
        ) as string[];
        setCitySuggestions(uniqueCities);
      } catch (err) {
        console.error('Failed to fetch services', err);
      }
    };
    fetchData();
  }, []);

  // filter services based on inputs
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

const handleSelectService = (service: Service) => {
  setServiceQuery(service.label ?? "");
  setCityQuery(service.city ?? "");

  setFilteredServices([]);
  setShowServiceSuggestions(false);

  router.push(
    `/customer/Services?type=services&subcategory=${service.id}&location=${encodeURIComponent(
      service.city ?? ""
    )}`
  );
};



const handleSelectCity = (city: string) => {
  setCityQuery(city);

  // Hide city suggestions
  setCitySuggestions([]);
};

const handleSearch = () => {
  if (filteredServices.length > 0) {
    // Select first matched result
    handleSelectService(filteredServices[0]);
  } else {
    router.push(
      `/customer/Services?type=services&subcategory=${encodeURIComponent(
        serviceQuery
      )}&location=${encodeURIComponent(cityQuery)}`
    );
  }

  // Clear dropdowns after search
  setFilteredServices([]);
};


  return (
    <div className="relative w-full p-4">
      <div className="flex overflow-hidden rounded-sm border border-gray-200 bg-white h-15 w-full">
        {/* Location input */}
        <div className="flex items-center px-4 w-1/2 border-r border-gray-200">
          <svg className="w-5 h-5 text-[#0099E8] mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 20s6-5.686 6-10a6 6 0 10-12 0c0 4.314 6 10 6 10zM10 11a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
          <input
            type="text"
            placeholder="Location"
            className="w-full outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400"
            value={cityQuery}
            onChange={(e) => setCityQuery(e.target.value)}
          />
        </div>

        {/* Services input */}
        <div className="flex items-center px-4 w-1/2 border-r border-gray-200">
          <svg className="w-5 h-5 text-[#0099E8] mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10.894 2.553a.5.5 0 00-.788.168L8.136 7H5a.5.5 0 000 1h3.136l1.97 4.279a.5.5 0 00.788.168l7-6.5a.5.5 0 000-.894l-7-6.5z" />
          </svg>
          <input
            type="text"
            placeholder="Services & Companies"
            className="w-full outline-none text-sm text-gray-700 bg-transparent placeholder-gray-400"
            value={serviceQuery}
          onChange={(e) => {
            setServiceQuery(e.target.value);
            setShowServiceSuggestions(true);
          }}          />
        </div>

        {/* Search button */}
        <button
          onClick={handleSearch}
          className="flex items-center justify-center w-16 bg-[#0099E8] hover:bg-[#007cc5] transition text-white"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1010.5 3a7.5 7.5 0 006.15 13.65z"
            />
          </svg>
        </button>
      </div>

      {/* City dropdown */}
      {cityQuery && (
        <ul className="absolute top-full left-0 mt-1 bg-white max-h-[200px] overflow-y-auto rounded shadow z-50 w-full text-black text-sm border">
          {citySuggestions
            .filter((city) => city.toLowerCase().includes(cityQuery.toLowerCase()))
            .map((city) => (
              <li
                key={city}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectCity(city)}
              >
                {city}
              </li>
            ))}
        </ul>
      )}

      {/* Service suggestions */}
      {serviceQuery && filteredServices.length > 0 && (
        <ul className="absolute top-full left-0 mt-1 bg-white max-h-[200px] overflow-y-auto rounded shadow z-50 w-full text-black text-sm border">
          {filteredServices.map((service) => (
            <li
              key={service.id}
              className="flex items-center px-4 py-2 hover:bg-gray-100 cursor-pointer"
              onClick={() => handleSelectService(service)}
            >
              {service.icon_url && <img src={service.icon_url} className="w-4 h-4 mr-2" />}
              <span>{service.label}</span>
              {service.city && <span className="ml-auto text-xs italic text-gray-500">{service.city}</span>}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBarServices;
