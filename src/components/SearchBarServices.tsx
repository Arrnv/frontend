'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type Service = {
  id: string;
  label: string;
  icon_url: string;
  city: string;
};

const SearchBarServices = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/search/services`);
        setServices(res.data.services);
        setCities(res.data.cities);
      } catch (err) {
        console.error('Failed to fetch data', err);
      }
    };
    fetchData();
  }, []);

  const servicesInCity = services.filter((s) => s.city === selectedCity);

  const handleSelectService = (service: Service) => {
    router.push(`/customer/Services?type=services&subcategory=${service.id}&location=${encodeURIComponent(service.city)}`);
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 space-y-4">
      {/* City Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Select City</label>
        <select
          className="w-full border px-3 py-2 rounded-lg"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">-- Choose a City --</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      {/* Services in City */}
      {selectedCity && (
        <div>
          <h4 className="text-sm font-semibold text-gray-700 mb-2">Services in {selectedCity}</h4>
          <ul className="space-y-2">
            {servicesInCity.map((service) => (
              <li
                key={service.id}
                className="flex items-center justify-between p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSelectService(service)}
              >
                <div className="flex items-center gap-2">
                  {service.icon_url && (
                    <img src={service.icon_url} alt="icon" className="w-5 h-5" />
                  )}
                  <span>{service.label}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBarServices;
