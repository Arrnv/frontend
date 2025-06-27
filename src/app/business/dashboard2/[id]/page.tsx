'use client';
import { use, useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from 'recharts';
import React from 'react';

export default function ServiceDashboardPage({ params }: { params: { id: string } }) {
  const [service, setService] = useState<any>(null);
  const [analytics, setAnalytics] = useState<{ views: any[]; clicks: any[] }>({ views: [], clicks: [] });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const serviceId = params.id; // ✅ For future compatibility with React's use()

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const [serviceRes, insightsRes] = await Promise.all([
          axios.get(`http://localhost:8000/businesses/service/${serviceId}`, {
            withCredentials: true,
          }),
          axios.get(`http://localhost:8000/api/analytics/insights/service?detailId=${serviceId}`, {
            withCredentials: true,
          }),
        ]);

        setService(serviceRes.data);
        setAnalytics(insightsRes.data);
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
      <h1 className="text-3xl font-bold">Service Dashboard: {service?.name}</h1>

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

      {/* ✅ Gallery Section */}
      {Array.isArray(service?.gallery_urls) && service.gallery_urls.length > 0 && (
        <div className="bg-white shadow rounded p-4 space-y-2">
          <h2 className="text-xl font-semibold mb-2">Gallery</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {service.gallery_urls.map((url: string, index: number) => (
              <img
                key={index}
                src={url}
                alt={`Gallery ${index + 1}`}
                className="w-full h-40 object-cover rounded shadow"
                onError={(e) => {
                  e.currentTarget.onerror = null; // prevent infinite loop
                  e.currentTarget.src = "/fallback_image.jpg";
                }}
              />
            ))}
          </div>
        </div>
      )}

      {/* ✅ Insights */}
      <div className="bg-white shadow rounded p-4 space-y-6">
        <h2 className="text-xl font-semibold mb-2">Engagement Insights</h2>

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
    </div>
  );
}
