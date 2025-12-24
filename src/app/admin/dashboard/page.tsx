'use client';

import { useEffect, useState } from 'react';
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
import { useRouter } from 'next/navigation';

import AdminNavbar from '@/components/AdminNavbar';
import GlassTooltip from '@/components/GlassTooltip';
import { Skeleton } from '@/components/Skeleton';

/* ---------------- TYPES ---------------- */

type DashboardSummary = {
  totalUsers: number;
  totalBusinesses: number;
  totalServices: number;
};

type AnalyticsData = {
  date: string;
  view: number;
  click: number;
};

/* ---------------- PAGE ---------------- */

export default function AdminDashboardPage() {
  const router = useRouter();

  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          router.push('/admin/login');
          return;
        }

        const config = {
          headers: { Authorization: `Bearer ${token}` },
        };

        const [summaryRes, analyticsRes] = await Promise.all([
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/dashboard`,
            config
          ),
          axios.get(
            `${process.env.NEXT_PUBLIC_API_URL}/admin/analytics`,
            config
          ),
        ]);

        setSummary(summaryRes.data);
        setAnalytics(analyticsRes.data);
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem('authToken');
          router.push('/admin/login');
        } else {
          console.error('Admin dashboard error:', err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  /* ---------------- LOADING ---------------- */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <AdminNavbar />
        <div className="max-w-screen-2xl mx-auto p-6 space-y-8">
          <Skeleton className="h-8 w-64" />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
            <Skeleton className="h-28 rounded-xl" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Skeleton className="h-80 rounded-xl" />
            <Skeleton className="h-80 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  /* ---------------- UI ---------------- */

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminNavbar />

      <div className="max-w-screen-2xl mx-auto px-6 py-8 space-y-10">
        {/* HEADER */}
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">
            Admin Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Platform overview & activity insights
          </p>
        </div>

        {/* KPI CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <AdminStatCard
            label="Total Users"
            value={summary?.totalUsers ?? 0}
          />
          <AdminStatCard
            label="Total Businesses"
            value={summary?.totalBusinesses ?? 0}
          />
          <AdminStatCard
            label="Total Services"
            value={summary?.totalServices ?? 0}
          />
        </div>

        {/* ANALYTICS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnalyticsCard
            title="Views Over Time"
            data={analytics}
            dataKey="view"
          />
          <AnalyticsCard
            title="Clicks Over Time"
            data={analytics}
            dataKey="click"
          />
        </div>
      </div>
    </div>
  );
}

/* ---------------- COMPONENTS ---------------- */

function AdminStatCard({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div className="
      bg-white
      border border-slate-200
      rounded-xl
      p-6
      transition
      hover:border-[#52C4FF]/40
    ">
      <p className="text-sm text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-semibold text-slate-900">
        {value}
      </p>
    </div>
  );
}

function AnalyticsCard({
  title,
  data,
  dataKey,
}: {
  title: string;
  data: AnalyticsData[];
  dataKey: 'view' | 'click';
}) {
  return (
    <div className="
      bg-white
      border border-slate-200
      rounded-xl
      p-6
    ">
      <h3 className="text-sm font-medium text-slate-700 mb-4">
        {title}
      </h3>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
          <XAxis dataKey="date" stroke="#64748B" />
          <YAxis allowDecimals={false} stroke="#64748B" />
          <Tooltip content={<GlassTooltip />} />
          <Line
            type="monotone"
            dataKey={dataKey}
            stroke="#52C4FF"
            strokeWidth={2}
            dot={{ r: 3 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
