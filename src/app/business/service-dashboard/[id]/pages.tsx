'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from 'recharts';

export default function ServiceDashboardPage({ params }: { params: { id: string } }) {
  const [service, setService] = useState<any>(null);
  const [analytics, setAnalytics] = useState<{ views: any[]; clicks: any[] }>({ views: [], clicks: [] });
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const serviceId = params.id;

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const [serviceRes, analyticsRes] = await Promise.all([
          axios.get(`http://localhost:8000/businesses/service/${serviceId}`, { withCredentials: true }),
          axios.get(`http://localhost:8000/api/analytics/insights/service?detailId=${serviceId}`, {
            withCredentials: true,
          }),
        ]);

        setService(serviceRes.data);
        setAnalytics(analyticsRes.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          router.push('/business/login');
        } else {
          console.error('Failed to load service dashboard:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchServiceData();
  }, [serviceId]);

  if (loading) return <p className="text-center p-6">Loading service dashboard...</p>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Service: {service?.name}</h1>

      <div className="bg-white shadow rounded p-4 space-y-2">
        <h2 className="text-xl font-semibold mb-2">Service Info</h2>
        <p><strong>Location:</strong> {service?.location}</p>
        <p><strong>Contact:</strong> {service?.contact}</p>
        <p><strong>Website:</strong> <a href={service?.website} target="_blank" className="text-blue-600">{service?.website}</a></p>
        <p><strong>Status:</strong> {service?.status}</p>
        <p><strong>Timings:</strong> {service?.timings}</p>
        <p><strong>Rating:</strong> {service?.rating}</p>
        <p><strong>Tags:</strong> {Array.isArray(service?.tags) ? service.tags.join(', ') : service?.tags}</p>
        <p><strong>Coordinates:</strong> {service?.latitude}, {service?.longitude}</p>
      </div>

      <div className="bg-white shadow rounded p-4 space-y-4">
        <h2 className="text-xl font-semibold">Engagement Insights</h2>

        <div>
          <h3 className="font-semibold mb-2">Views Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics.views}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#3B82F6" strokeWidth={2} />
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
              <Line type="monotone" dataKey="count" stroke="#10B981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={() => router.push(`/business/edit-service/${serviceId}`)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Edit Service
        </button>
      </div>
    </div>
  );
}
