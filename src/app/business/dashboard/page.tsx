'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';

export default function BusinessDashboard() {
  const [business, setBusiness] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const bizRes = await axios.get('http://localhost:8000/businesses/my', { withCredentials: true });
        const servicesRes = await axios.get(
        `http://localhost:8000/api/business-services?businessId=${bizRes.data.id}`,
        { withCredentials: true });        
        setBusiness(bizRes.data);
        setServices(servicesRes.data);
      } catch (err) {
        console.error('Error loading dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p className="text-center p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Welcome, {business?.name}!</h1>

      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-2">Business Info</h2>
        <p><strong>Location:</strong> {business?.location}</p>
        <p><strong>Contact:</strong> {business?.contact}</p>
        <p><strong>Website:</strong> <a href={business?.website} target="_blank" className="text-blue-600">{business?.website}</a></p>
      </div>

      <div className="bg-white shadow rounded p-4 mb-6">
        <h2 className="text-xl font-semibold mb-4">Your Services</h2>
        {services.length === 0 ? (
          <p>No services listed yet.</p>
        ) : (
          <ul className="space-y-3">
            {services.map((service) => (
              <li key={service.id} className="border p-3 rounded flex justify-between items-center">
                <div>
                  <p className="font-semibold">{service.name}</p>
                  <p className="text-sm text-gray-500">Rating: {service.rating ?? 'N/A'}</p>
                </div>
                <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                  Edit
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-4">Insights (Coming Soon)</h2>
        <p className="text-gray-500">We'll show your views, clicks, and engagement trends here.</p>
      </div>
    </div>
  );
}
