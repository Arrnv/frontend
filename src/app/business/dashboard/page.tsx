'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from 'recharts';
import LogoutButton from '@/components/LogoutButton'

export default function BusinessDashboard() {
  const [business, setBusiness] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<{ views: any[]; clicks: any[] }>({ views: [], clicks: [] });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const bizRes = await axios.get('http://localhost:8000/businesses/my', { withCredentials: true });
        const businessId = bizRes.data.id;

        const servicesRes = await axios.get(
          `http://localhost:8000/api/business-services?businessId=${businessId}`,
          { withCredentials: true }
        );

        const insightsRes = await axios.get(
          `http://localhost:8000/api/analytics/insights?businessId=${businessId}`,
          { withCredentials: true }
        );

        setBusiness(bizRes.data);
        setServices(servicesRes.data);
        setAnalytics(insightsRes.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          router.push('/business/login');
        } else {
          console.error('Error loading dashboard:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <p className="text-center p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Welcome, {business?.name}!</h1>

      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-2">Business Info</h2>
        <p><strong>Location:</strong> {business?.location}</p>
        <p><strong>Contact:</strong> {business?.contact}</p>
        <p><strong>Website:</strong> <a href={business?.website} target="_blank" className="text-blue-600">{business?.website}</a></p>
      </div>

      <div className="bg-white shadow rounded p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your Services</h2>
          <button
            onClick={() => router.push('/business/onboard-new-service')}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            + Add New Service
          </button>
        </div>
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
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2"
                  onClick={() => router.push(`/business/dashboard2/${service.id}`)}
                >
                  View Dashboard
                </button>
                <button
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  onClick={() => router.push(`/business/edit-service/${service.id}`)}
                >
                  Edit
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white shadow rounded p-4">
        <h2 className="text-xl font-semibold mb-4">Engagement Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="font-semibold mb-2">Views Over Time</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analytics.views}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#4F46E5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Clicks on Contact</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={analytics.clicks}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#059669" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    <LogoutButton></LogoutButton>
    </div>
  );
}
