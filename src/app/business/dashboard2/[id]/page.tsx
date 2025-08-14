'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from 'recharts';
import React from 'react';
import { use } from 'react';
import GlassTooltip from '@/components/GlassTooltip';

export default function ServiceDashboardPage({ params }: { params: Promise<{ id: string }> }) {
  const [service, setService] = useState<any>(null);
  const [analytics, setAnalytics] = useState<{ views: any[]; clicks: any[] }>({ views: [], clicks: [] });
  const [alerts, setAlerts] = useState<any[]>([]);
  const [completedToday, setCompletedToday] = useState<any[]>([]);
  const [revenue, setRevenue] = useState<number>(0);
  const [completedBookings, setCompletedBookings] = useState<number>(0);
  const [todayBookings, setTodayBookings] = useState<number>(0);
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  const { id: serviceId } = use(params);

  useEffect(() => setMounted(true), []);

  const isToday = (timestamp: string | number | Date) => {
    const date = new Date(timestamp);
    const today = new Date();
    return date.getDate() === today.getDate() &&
           date.getMonth() === today.getMonth() &&
           date.getFullYear() === today.getFullYear();
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [serviceRes, insightsRes, alertsRes, revenueRes, feedbacksRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/businesses/service/${serviceId}`, { withCredentials: true }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/insights/service?detailId=${serviceId}`, { withCredentials: true }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/businesses/alerts/${serviceId}`, { withCredentials: true }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/revenue/${serviceId}`, { withCredentials: true }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/businesses/feedbacks/${serviceId}`, { withCredentials: true }),
        ]);

        setService(serviceRes.data);
        setAnalytics(insightsRes.data);
        setRevenue(revenueRes.data.revenue);
        setCompletedBookings(revenueRes.data.total_completed);
        setTodayBookings(revenueRes.data.today_bookings);
        setFeedbacks(feedbacksRes.data);

        const allAlerts = alertsRes.data;
        setCompletedToday(allAlerts.filter((a: any) => a.service_bookings?.status === 'completed' && isToday(a.service_bookings.updated_at)));
        setAlerts(allAlerts.filter((a: any) => a.service_bookings?.status !== 'completed'));
      } catch (err: any) {
        if (err.response?.status === 401) router.push('/business/login');
        else console.error('Failed to load service dashboard:', err);
      } finally {
        setLoading(false);
      }
    };

    if (mounted) fetchAllData();
  }, [serviceId, mounted]);

  const updateBookingStatus = async (bookingId: string, status: string) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/status/${bookingId}`, { status }, { withCredentials: true });
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/businesses/alerts/${serviceId}`, { withCredentials: true });

      const updatedAlerts = res.data;
      setCompletedToday(updatedAlerts.filter((a: any) => a.service_bookings?.status === 'completed' && isToday(a.service_bookings.updated_at)));
      setAlerts(updatedAlerts.filter((a: any) => a.service_bookings?.status !== 'completed'));
    } catch (err) {
      console.error('Failed to update booking status:', err);
    }
  };

  if (!mounted || loading) return <p className="text-center p-6 text-[#52C4FF] font-semibold">Loading service dashboard...</p>;

  return (
    <div className="p-6 w-screen max-w-screen-2xl mx-auto bg-white text-[#52C4FF] font-semibold" style={{ fontFamily: 'var(--font-family)' }}>
      <h1 className="text-4xl font-bold mb-8 drop-shadow-md">Service Dashboard: {service?.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <section className="bg-white border border-gray-400 rounded-xl p-6 shadow-lg col-span-2">
          <h2 className="text-2xl mb-4 drop-shadow-md text-[#52C4FF]">Service Info</h2>
          <p><strong className="text-gray-800 font-semibold">Location:</strong> <span className="text-gray-700 font-normal">{service?.location}</span></p>
          <p><strong className="text-gray-800 font-semibold">Contact:</strong> <span className="text-gray-700 font-normal">{service?.contact}</span></p>
          <p><strong className="text-gray-800 font-semibold">Website:</strong> <a href={service?.website} target="_blank" className="underline text-[#52C4FF] font-normal">{service?.website}</a></p>
          <p><strong className="text-gray-800 font-semibold">Status:</strong> <span className="text-gray-700 font-normal">{service?.status}</span></p>
          <p><strong className="text-gray-800 font-semibold">Timings:</strong> <span className="text-gray-700 font-normal">{service?.timings}</span></p>
          <p><strong className="text-gray-800 font-semibold">Rating:</strong> <span className="text-gray-700 font-normal">{service?.rating}</span></p>
          <p><strong className="text-gray-800 font-semibold">Tags:</strong> <span className="text-gray-700 font-normal">{Array.isArray(service?.tags) ? service.tags.join(', ') : service?.tags}</span></p>
          <p><strong className="text-gray-800 font-semibold">Coordinates:</strong> <span className="text-gray-700 font-normal">{service?.latitude}, {service?.longitude}</span></p>
        </section>

        {Array.isArray(service?.gallery_urls) && service.gallery_urls.length > 0 && (
          <section className="bg-white border border-gray-400 rounded-xl p-6 shadow-lg col-span-1">
            <h2 className="text-2xl mb-4 drop-shadow-md text-[#52C4FF]">Gallery</h2>
            <div className="grid grid-cols-2 gap-3">
              {service.gallery_urls.map((url: string, index: number) => (
                <img
                  key={index}
                  src={url}
                  alt={`Gallery ${index + 1}`}
                  className="w-full h-32 object-cover rounded shadow"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback_image.jpg'; }}
                />
              ))}
            </div>
          </section>
        )}

        <section className="bg-white border border-gray-400 rounded-xl p-6 shadow-lg col-span-1">
          <h2 className="text-2xl mb-4 drop-shadow-md text-[#52C4FF]">Today's Booking Stats</h2>
          <p><strong className="text-gray-800 font-semibold">Completed:</strong> <span className="text-gray-700 font-normal">{completedBookings}</span></p>
          <p><strong className="text-gray-800 font-semibold">Today:</strong> <span className="text-gray-700 font-normal">{todayBookings}</span></p>
          <p><strong className="text-gray-800 font-semibold">Revenue:</strong> <span className="text-gray-700 font-normal">₹{revenue}</span></p>
        </section>

        <section className="bg-white border border-gray-400 rounded-xl p-6 shadow-lg col-span-2">
          <h2 className="text-2xl mb-4 drop-shadow-md text-[#52C4FF]">Engagement Insights</h2>

          <h3 className="text-xl mb-2 text-black">Views Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analytics.views}>
              <CartesianGrid strokeDasharray="3 3" stroke="#000000" />
              <XAxis dataKey="date" stroke="#000000" />
              <YAxis stroke="#000000" />
              <Tooltip content={<GlassTooltip />} />
              <Legend wrapperStyle={{ color: '#000000' }} />
              <Line type="monotone" dataKey="count" stroke="#000000" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>

          <h3 className="text-xl mt-6 mb-2 text-[#000000]">Clicks on Contact</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analytics.clicks}>
              <CartesianGrid strokeDasharray="3 3" stroke="000000" />
              <XAxis dataKey="date" stroke="#000000" />
              <YAxis stroke="#000000" />
              <Tooltip content={<GlassTooltip />} />
              <Legend wrapperStyle={{ color: '#000000' }} />
              <Line type="monotone" dataKey="count" stroke="#000000" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </section>

        <section className="bg-white border border-gray-400 rounded-xl p-6 shadow-lg col-span-1">
          <h2 className="text-2xl mb-4 drop-shadow-md text-[#52C4FF]">Recent Booking Alerts</h2>
          {alerts.length === 0 ? (
            <p className="text-gray-500 font-normal">No alerts</p>
          ) : (
            alerts.map((alert) => (
              <div key={alert.id} className="bg-white border border-gray-300 rounded p-4 shadow mb-4">
                <p className="font-semibold text-[#52C4FF]">{alert.message}</p>
                <p className="text-sm text-gray-600">Status: {alert.service_bookings?.status} | {new Date(alert.created_at).toLocaleString()}</p>
                <div className="flex flex-wrap gap-2 mt-3">
                  {['ongoing', 'completed', 'cancelled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => updateBookingStatus(alert.booking_id, status)}
                      className="bg-[#52C4FF] text-black px-3 py-1 rounded shadow hover:bg-blue-400 transition"
                    >
                      Mark as {status}
                    </button>
                  ))}
                </div>
              </div>
            ))
          )}
        </section>

        <section className="bg-white border border-gray-400 rounded-xl p-6 shadow-lg col-span-2">
          <h2 className="text-2xl mb-4 drop-shadow-md text-[#52C4FF]">Completed Today</h2>
          {completedToday.length === 0 ? (
            <p className="text-gray-500 font-normal">No completed bookings today.</p>
          ) : (
            completedToday.map((alert) => (
              <div key={alert.id} className="bg-green-900/20 border border-green-700 rounded p-4 shadow mb-4">
                <p className="font-semibold text-[#52C4FF]">{alert.message}</p>
                <p className="text-sm text-gray-700">Completed on: {new Date(alert.service_bookings.updated_at).toLocaleString()}</p>
              </div>
            ))
          )}
        </section>

        <section className="bg-white border border-gray-400 rounded-xl p-6 shadow-lg col-span-3">
          <h2 className="text-2xl mb-4 drop-shadow-md text-[#52C4FF]">Feedback</h2>
          {feedbacks.length === 0 ? (
            <p className="text-gray-500 font-normal">No feedback today.</p>
          ) : (
            feedbacks.map((fb) => (
              <div key={fb.id} className="bg-white border border-gray-300 rounded p-4 shadow mb-4">
                <p className="font-semibold text-[#52C4FF]">"{fb.comment}"</p>
                <p className="text-sm text-gray-700">
                  Rating: {fb.rating} | By: {fb.users?.full_name || 'Anonymous'} | Status: {fb.service_bookings?.status}
                </p>
                <p className="text-xs text-gray-400">Submitted on: {new Date(fb.created_at).toLocaleString()}</p>
              </div>
            ))
          )}
        </section>
      </div>
    </div>
  );
}
