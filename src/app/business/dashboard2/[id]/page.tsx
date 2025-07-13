// Updated React Frontend Code (Grid & Layout Refactor with Color Palette)
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
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  };

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const [serviceRes, insightsRes, alertsRes, revenueRes, feedbacksRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/businesses/service/${serviceId}`, { withCredentials: true }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/insights/service?detailId=${serviceId}`, { withCredentials: true }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/businesses/alerts/${serviceId}`, { withCredentials: true }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/revenue/${serviceId}`, { withCredentials: true }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/businesses/feedbacks/${serviceId}`, { withCredentials: true })
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

  if (!mounted || loading) return <p className="text-center p-6">Loading service dashboard...</p>;

  return (
    <div className="p-6 max-w-7xl mx-auto text-white bg-gradient-to-br from-[#0E1C2F] via-[#1F3B79] to-[#415CBB]" style={{ fontFamily: 'var(--font-family)' }}>
      <h1 className="text-4xl font-bold mb-8">Service Dashboard: {service?.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <section className="card col-span-2">
          <h2>Service Info</h2>
          <p><strong>Location:</strong> {service?.location}</p>
          <p><strong>Contact:</strong> {service?.contact}</p>
          <p><strong>Website:</strong> <a href={service?.website} target="_blank" className="text-blue-400">{service?.website}</a></p>
          <p><strong>Status:</strong> {service?.status}</p>
          <p><strong>Timings:</strong> {service?.timings}</p>
          <p><strong>Rating:</strong> {service?.rating}</p>
          <p><strong>Tags:</strong> {Array.isArray(service?.tags) ? service.tags.join(', ') : service?.tags}</p>
          <p><strong>Coordinates:</strong> {service?.latitude}, {service?.longitude}</p>
        </section>

        {Array.isArray(service?.gallery_urls) && service.gallery_urls.length > 0 && (
          <section className="card col-span-1">
            <h2>Gallery</h2>
            <div className="grid grid-cols-2 gap-3">
              {service.gallery_urls.map((url: string, index: number) => (
                <img key={index} src={url} alt={`Gallery ${index + 1}`} className="w-full h-32 object-cover rounded" onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = '/fallback_image.jpg'; }} />
              ))}
            </div>
          </section>
        )}

        <section className="card col-span-1">
          <h2>Today's Booking Stats</h2>
          <p><strong>Completed:</strong> {completedBookings}</p>
          <p><strong>Today:</strong> {todayBookings}</p>
          <p><strong>Revenue:</strong> ₹{revenue}</p>
        </section>

        <section className="card col-span-2 analytics-container">
          <h2>Engagement Insights</h2>
          <h3>Views Over Time</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analytics.views}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip content={GlassTooltip} /><Legend /><Line type="monotone" dataKey="count" stroke="#48AFFF" strokeWidth={2} /></LineChart>
          </ResponsiveContainer>

          <h3 className="mt-4">Clicks on Contact</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={analytics.clicks}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="date" /><YAxis /><Tooltip content={GlassTooltip} /><Legend /><Line type="monotone" dataKey="count" stroke="#32E3C6" strokeWidth={2} /></LineChart>
          </ResponsiveContainer>
        </section>

        <section className="card col-span-1">
          <h2>Recent Booking Alerts</h2>
          {alerts.length === 0 ? <p className="text-gray-400">No alerts</p> : alerts.map((alert) => (
            <div key={alert.id} className="alert-card">
              <p className="font-semibold">{alert.message}</p>
              <p className="text-sm">Status: {alert.service_bookings?.status} | {new Date(alert.created_at).toLocaleString()}</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {['ongoing', 'completed', 'cancelled'].map((status) => (
                  <button key={status} onClick={() => updateBookingStatus(alert.booking_id, status)}>Mark as {status}</button>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section className="card col-span-2">
          <h2>Completed Today</h2>
          {completedToday.length === 0 ? <p className="text-gray-400">No completed bookings today.</p> : (
            completedToday.map((alert) => (
              <div key={alert.id} className="alert-card bg-green-900/20">
                <p className="font-semibold">{alert.message}</p>
                <p className="text-sm">Completed on: {new Date(alert.service_bookings.updated_at).toLocaleString()}</p>
              </div>
            ))
          )}
        </section>

        <section className="card col-span-3">
          <h2>Feedback</h2>
          {feedbacks.length === 0 ? <p className="text-gray-400">No feedback today.</p> : feedbacks.map((fb) => (
            <div key={fb.id} className="feedback-card">
              <p className="font-semibold">"{fb.comment}"</p>
              <p className="text-sm">Rating: {fb.rating} | By: {fb.users?.full_name || 'Anonymous'} | Status: {fb.service_bookings?.status}</p>
              <p className="text-xs text-gray-400">Submitted on: {new Date(fb.created_at).toLocaleString()}</p>
            </div>
          ))}
        </section>
      </div>
    </div>
  );
}