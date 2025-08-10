'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from 'recharts';
import LogoutButton from '@/components/LogoutButton';
import GlassTooltip from '@/components/GlassTooltip';
import StripeConnectButton from '@/components/StripeConnectButton'; // 🔥 Import added

export default function BusinessDashboard() {
  const [business, setBusiness] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<{ views: any[]; clicks: any[] }>({ views: [], clicks: [] });
  const [revenueStats, setRevenueStats] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const bizRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/businesses/my`, { withCredentials: true });
        const businessId = bizRes.data.id;

        const servicesRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/business-services?businessId=${businessId}`,
          { withCredentials: true }
        );

        const insightsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/insights?businessId=${businessId}`,
          { withCredentials: true }
        );

        const revStats: Record<string, any> = {};
        for (const service of servicesRes.data) {
          const revenueRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/revenue/${service.id}`);
          revStats[service.id] = revenueRes.data;
        }

        setBusiness(bizRes.data);
        setServices(servicesRes.data);
        setAnalytics(insightsRes.data);
        setRevenueStats(revStats);
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
    <div className="p-6 max-w-screen-2xl mx-auto text-black bg-white">
      <h1 className="text-3xl font-bold mb-6">👋 Welcome, {business?.name}!</h1>

      <div className="grid grid-cols-2 gap-6 h-auto">
        {/* 🧾 Stripe Connect */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-md">
          <h2 className="text-xl font-semibold text-[#48AFFF] mb-4">💳 Payments Setup</h2>
          <p className="text-sm text-gray-300 mb-3">
            Connect your Stripe account to accept bookings and get paid. A platform commission will be deducted automatically.
          </p>
          <StripeConnectButton />
        </div>

        {/* Business Info */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-md">
          <h2 className="text-xl font-semibold text-[#48AFFF] mb-4">🏢 Business Info</h2>
          <div className="space-y-2 text-sm text-[#E2E8F0]">
            <p><span className="text-gray-400">Location:</span> {business?.location}</p>
            <p><span className="text-gray-400">Contact:</span> {business?.contact}</p>
            <p><span className="text-gray-400">Website:</span>{' '}
              <a href={business?.website} target="_blank" className="text-[#48AFFF] underline">{business?.website}</a>
            </p>
          </div>
        </div>

        {/* Revenue Summary Per Service */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-md overflow-auto col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-[#C44EFF]">🛠️ Your Services</h2>
            <button
              onClick={() => router.push('/business/onboard-new-service')}
              className="bg-[#246BFD] hover:bg-[#1F3B79] text-white px-4 py-2 rounded-lg shadow transition"
            >
              + Add New
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-[#E2E8F0]">
            {services.length === 0 ? (
              <p>No services listed yet.</p>
            ) : (
              services.map((service) => (
                <div key={service.id} className="border border-white/20 rounded-lg p-3 bg-white/5">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-white">{service.name}</p>
                      <p className="text-xs text-gray-400">⭐ Rating: {service.rating ?? 'N/A'}</p>
                      <p className="text-xs text-[#48AFFF]">💰 ₹{revenueStats[service.id]?.revenue ?? 0}</p>
                      <p className="text-xs text-[#32E3C6]">✅ {revenueStats[service.id]?.total_completed ?? 0}</p>
                      <p className="text-xs text-[#FF5E8A]">📆 {revenueStats[service.id]?.today_bookings ?? 0}</p>
                    </div>
                    <div className="space-x-1">
                      <button
                        onClick={() => router.push(`/business/dashboard2/${service.id}`)}
                        className="bg-[#415CBB] text-white px-2 py-1 rounded text-xs"
                      >
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/business/edit-service/${service.id}`)}
                        className="bg-[#246BFD] text-white px-2 py-1 rounded text-xs"
                      >
                        Edit
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Views Over Time */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-md">
          <h3 className="text-lg font-semibold text-[#C44EFF] mb-2">📈 Views Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics.views}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2E60C3" />
              <XAxis dataKey="date" stroke="#8B9AB2" />
              <YAxis allowDecimals={false} stroke="#8B9AB2" />
              <Tooltip content={<GlassTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#48AFFF" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Clicks on Contact */}
        <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 shadow-md">
          <h3 className="text-lg font-semibold text-[#32E3C6] mb-2">📞 Clicks on Contact</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics.clicks}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F3B79" />
              <XAxis dataKey="date" stroke="#8B9AB2" />
              <YAxis allowDecimals={false} stroke="#8B9AB2" />
              <Tooltip content={<GlassTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#32E3C6" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="mt-4 text-right">
        <LogoutButton />
      </div>
    </div>
  );
}
