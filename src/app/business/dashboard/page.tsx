'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import LogoutButton from '@/components/LogoutButton';
import GlassTooltip from '@/components/GlassTooltip';
import { Skeleton } from '@/components/Skeleton';

export default function BusinessDashboard() {
  const router = useRouter();

  const [business, setBusiness] = useState<any>(null);
  const [services, setServices] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState({ views: [], clicks: [] });
  const [revenueStats, setRevenueStats] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH DATA ---------------- */
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/business/login');
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const bizRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/businesses/my`,
          config
        );

        const servicesRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/business-services?businessId=${bizRes.data.id}`,
          config
        );

        const insightsRes = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/insights?businessId=${bizRes.data.id}`,
          config
        );

        const revenueMap: Record<string, any> = {};
        for (const s of servicesRes.data) {
          const rev = await axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/revenue/${s.id}`,
            config
          );
          revenueMap[s.id] = rev.data;
        }

        setBusiness(bizRes.data);
        setServices(servicesRes.data);
        setAnalytics(insightsRes.data);
        setRevenueStats(revenueMap);
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem('authToken');
          router.push('/business/login');
        }
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

 if (loading) {
    return (
      <div className="max-w-screen-2xl mx-auto p-6 bg-[#F8FAFC]">
        <Skeleton className="h-7 w-64 mb-6" />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-56 rounded-xl" />
          <Skeleton className="h-72 col-span-2 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-64 col-span-3 rounded-xl" />
        </div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */
  return (
<div className="max-w-screen-2xl mx-auto px-6 py-8 bg-slate-50 min-h-screen">
      {/* HEADER */}
<header className="mb-10 space-y-1">
  <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
    Welcome back, {business?.name}
  </h1>
  <p className="text-sm text-slate-500">
    Overview of your business performance
  </p>
</header>


      {/* KPI SUMMARY */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <KpiCard label="Total Views" value={analytics.views.length} />
        <KpiCard label="Contact Clicks" value={analytics.clicks.length} />
        <KpiCard label="Active Services" value={services.length} />
        <KpiCard
          label="Total Revenue"
          value={`₹${Object.values(revenueStats).reduce(
            (s: number, r: any) => s + (r?.revenue ?? 0),
            0
          )}`}
        />
      </section>

      {/* SERVICES */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Your Services
          </h2>
          <button
            onClick={() => router.push('/business/onboard-new-service')}
            className="px-4 py-2 rounded-md bg-[#52C4FF] text-white text-sm hover:opacity-90"
          >
            Add Service
          </button>
        </div>

        {services.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                revenue={revenueStats[service.id]}
                onView={() =>
                  router.push(`/business/dashboard2/${service.id}`)
                }
                onEdit={() =>
                  router.push(`/business/edit-service/${service.id}`)
                }
              />
            ))}
          </div>
        )}
      </section>

      {/* ANALYTICS */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <ChartCard title="Views Over Time" data={analytics.views} />
        <ChartCard title="Contact Clicks" data={analytics.clicks} />
      </section>

      {/* FOOTER */}
      <div className="flex justify-end">
        <LogoutButton />
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function KpiCard({ label, value }: { label: string; value: any }) {
  return (
    <div className="
      bg-white
      border border-slate-200
      rounded-xl
      px-4 py-3
      transition
      hover:border-[#52C4FF]/40
    ">
      <p className="text-xs font-medium text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-xl font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}


function ServiceCard({ service, revenue, onView, onEdit }: any) {
  return (
    <div className="
      bg-white
      border border-slate-200
      rounded-xl
      p-4
      flex justify-between
      items-start
      transition
      hover:border-[#52C4FF]/40
    ">
      <div className="space-y-1">
        <p className="font-medium text-slate-900">
          {service.name}
        </p>
        <p className="text-xs text-slate-500">
          Revenue: ₹{revenue?.revenue ?? 0}
        </p>
        <p className="text-xs text-slate-500">
          Rating: {service.rating ?? 'N/A'}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onView}
          className="
            px-3 py-1
            text-xs
            rounded-md
            border border-slate-200
            text-slate-700
            hover:bg-slate-100
          "
        >
          View
        </button>
        <button
          onClick={onEdit}
          className="
            px-3 py-1
            text-xs
            rounded-md
            bg-[#52C4FF]
            text-white
            hover:opacity-90
          "
        >
          Edit
        </button>
      </div>
    </div>
  );
}


function ChartCard({ title, data }: any) {
  return (
<div className="bg-white border border-slate-200 rounded-xl p-5">
      <h3 className="text-sm font-medium text-slate-900 mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#64748B" />
          <YAxis stroke="#64748B" />
          <Tooltip content={<GlassTooltip />} />
          <Line
            type="monotone"
            dataKey="count"
            stroke="#52C4FF"
            strokeWidth={2}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function EmptyState() {
  return (
<div className="
  bg-white
  border border-dashed border-slate-300
  rounded-xl
  p-10
  text-center
">
  <p className="text-sm text-slate-500">
    No services yet. Add your first service to start receiving traffic.
  </p>
</div>

  );
}
