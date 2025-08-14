'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from 'recharts';
import LogoutButton from '@/components/LogoutButton';
import GlassTooltip from '@/components/GlassTooltip';
import StripeConnectButton from '@/components/StripeConnectButton';

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

  if (loading) return <p className="text-center p-6 text-[#52C4FF] font-semibold">Loading...</p>;

  return (
    <div className="p-6 max-w-screen-2xl mx-auto bg-white text-black font-semibold shadow-sm">
      <h1 className="text-3xl font-bold mb-6 drop-shadow-sm">👋 Welcome, {business?.name}!</h1>

      <div className="grid grid-cols-2 gap-6 h-auto">
        {/* Stripe Connect */}
        <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-md">
          <h2 className="text-xl mb-4 font-semibold">💳 Payments Setup</h2>
          <p className="text-sm mb-3 text-gray-700 font-normal">
            Connect your Stripe account to accept bookings and get paid. A platform commission will be deducted automatically.
          </p>
          <StripeConnectButton />
        </div>

        {/* Business Info */}
        <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-md">
          <h2 className="text-xl mb-4 font-semibold">🏢 Business Info</h2>
          <div className="space-y-2 text-sm text-gray-800 font-normal">
            <p><span className="font-semibold text-gray-900">Location:</span> {business?.location}</p>
            <p><span className="font-semibold text-gray-900">Contact:</span> {business?.contact}</p>
            <p>
              <span className="font-semibold text-gray-900">Website:</span>{' '}
              <a href={business?.website} target="_blank" className="underline text-[#52C4FF]">
                {business?.website}
              </a>
            </p>
          </div>
        </div>

        {/* Revenue Summary Per Service */}
        <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-md overflow-auto col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">🛠️ Your Services</h2>
            <button
              onClick={() => router.push('/business/onboard-new-service')}
              className="bg-[#52C4FF] text-white px-4 py-2 rounded-lg shadow hover:bg-blue-400 transition"
            >
              + Add New
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-800 font-normal">
            {services.length === 0 ? (
              <p>No services listed yet.</p>
            ) : (
              services.map((service) => (
                <div key={service.id} className="border border-gray-300 rounded-lg p-3 bg-white shadow-md">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-semibold text-black">{service.name}</p>
                      <p className="text-xs text-gray-900">⭐ Rating: {service.rating ?? 'N/A'}</p>
                      <p className="text-xs text-[#52C4FF]">💰 ₹{revenueStats[service.id]?.revenue ?? 0}</p>
                      <p className="text-xs text-gray-900">✅ {revenueStats[service.id]?.total_completed ?? 0}</p>
                      <p className="text-xs text-gray-900">📆 {revenueStats[service.id]?.today_bookings ?? 0}</p>
                    </div>
                    <div className="space-x-1">
                      <button
                        onClick={() => router.push(`/business/dashboard2/${service.id}`)}
                        className="bg-[#52C4FF] text-white px-2 py-1 rounded text-xs shadow hover:bg-blue-400 transition"
                      >
                        View
                      </button>
                      <button
                        onClick={() => router.push(`/business/edit-service/${service.id}`)}
                        className="bg-[#52C4FF] text-white px-2 py-1 rounded text-xs shadow hover:bg-blue-400 transition"
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
        <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-md">
          <h3 className="text-lg mb-2 font-semibold">📈 Views Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics.views}>
              <CartesianGrid strokeDasharray="3 3" stroke="#52C4FF" />
              <XAxis dataKey="date" stroke="#52C4FF" />
              <YAxis allowDecimals={false} stroke="#52C4FF" />
              <Tooltip content={<GlassTooltip />} />
              <Legend wrapperStyle={{ color: '#52C4FF' }} />
              <Line type="monotone" dataKey="count" stroke="#52C4FF" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Clicks on Contact */}
        <div className="bg-white rounded-xl p-6 border border-gray-300 shadow-md">
          <h3 className="text-lg mb-2 font-semibold">📞 Clicks on Contact</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={analytics.clicks}>
              <CartesianGrid strokeDasharray="3 3" stroke="#52C4FF" />
              <XAxis dataKey="date" stroke="#52C4FF" />
              <YAxis allowDecimals={false} stroke="#52C4FF" />
              <Tooltip content={<GlassTooltip />} />
              <Legend wrapperStyle={{ color: '#52C4FF' }} />
              <Line type="monotone" dataKey="count" stroke="#52C4FF" strokeWidth={2} />
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
