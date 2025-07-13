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

  // Filter services based on queries
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
    router.push(
      `/customer/Services?type=services&subcategory=${service.id}&location=${encodeURIComponent(service.city ?? '')}`
    );
  };

  const handleSelectCity = (city: string) => {
    setCityQuery(city);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-4 relative">
      {/* Inputs */}
      <div className="flex space-x-2 relative">
        {/* Location input */}
        <div className="flex-1 relative">
          <div className="flex items-center border rounded-lg px-4 py-2 text-white">
            <span className="text-orange-600 text-xl mr-2">📍</span>
            <input
              type="text"
              placeholder="Location"
              className="flex-1 outline-none text-white"
              value={cityQuery}
              onChange={(e) => setCityQuery(e.target.value)}
            />
          </div>

          {/* City Suggestions */}
          {cityQuery && (
            <ul className="absolute bg-blue-600 text-white w-full rounded-lg mt-1 z-50 max-h-48 overflow-auto">
              {citySuggestions
                .filter((city) => city?.toLowerCase().includes(cityQuery.toLowerCase()))
                .map((city) => (
                  <li
                    key={city}
                    className="px-4 py-2 hover:bg-blue-500 cursor-pointer"
                    onClick={() => handleSelectCity(city)}
                  >
                    {city}
                  </li>
                ))}
            </ul>
          )}
        </div>

        {/* Services input */}
        <div className="flex-1 relative">
          <div className="flex items-center border rounded-lg px-4 py-2 text-white">
            <span className="text-orange-600 text-xl mr-2">🧭</span>
            <input
              type="text"
              placeholder="Services & Companies"
              className="flex-1 outline-none text-white"
              value={serviceQuery}
              onChange={(e) => setServiceQuery(e.target.value)}
            />
          </div>

          {/* Services Suggestions */}
          {serviceQuery && filteredServices.length > 0 && (
            <ul className="absolute bg-blue-600 text-white w-full rounded-lg mt-1 z-50 max-h-48 overflow-auto">
              {filteredServices.map((service) => (
                <li
                  key={service.id}
                  className="flex items-center px-4 py-2 cursor-pointer hover:bg-blue-500"
                  onClick={() => handleSelectService(service)}
                >
                  {service.icon_url && (
                    <img src={service.icon_url} alt="icon" className="w-5 h-5 mr-2" />
                  )}
                  <span>{service.label}</span>
                  {service.city && <span className="ml-auto text-sm italic">{service.city}</span>}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Search button */}
        <button className="bg-orange-600 px-5 rounded-lg text-white text-xl">
          🔍
        </button>
      </div>
    </div>
  );
};

export default SearchBarServices;
