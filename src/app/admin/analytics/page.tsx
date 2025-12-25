'use client';

/**
 * Admin Analytics Page – CONSISTENT with Dashboard
 * ------------------------------------------------
 * Design aligned with:
 * - Light surface (#F8FAFC)
 * - White cards, slate borders
 * - Subtle accent (#52C4FF)
 * - Clear hierarchy & scannability
 */

import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '@/components/AdminNavbar';
import GlassTooltip from '@/components/GlassTooltip';
import { Skeleton } from '@/components/Skeleton';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
} from 'recharts';

/* ---------------- TYPES ---------------- */

interface StatEntry {
  detail_id: string;
  name: string;
  avg_rating?: number;
  total_views?: number;
}

interface MonthlyStat {
  month: string;
  count: number;
}

interface CategoryStat {
  category: string;
  count: number;
}

interface StatusStat {
  status: string;
  count: number;
}

interface RevenueStat {
  name: string;
  total_revenue: number;
}

const COLORS = ['#52C4FF', '#34D399', '#FBBF24', '#A78BFA', '#F87171', '#2DD4BF'];

/* ---------------- PAGE ---------------- */

export default function AdminAnalyticsPage() {
  const [topRated, setTopRated] = useState<StatEntry[]>([]);
  const [mostViewed, setMostViewed] = useState<StatEntry[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [statusStats, setStatusStats] = useState<StatusStat[]>([]);
  const [topRevenueStats, setTopRevenueStats] = useState<RevenueStat[]>([]);
  const [loading, setLoading] = useState(true);

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
  });

  useEffect(() => {
    Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/services/stats/top-rated`, getAuthConfig()),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/services/stats/most-viewed`, getAuthConfig()),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/services/stats/monthly`, getAuthConfig()),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/services/stats/by-category`, getAuthConfig()),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/services/stats/status-summary`, getAuthConfig()),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/services/stats/top-revenue`, getAuthConfig()),
    ])
      .then(([a, b, c, d, e, f]) => {
        setTopRated(a.data);
        setMostViewed(b.data);
        setMonthlyStats(c.data);
        setCategoryStats(d.data);
        setStatusStats(e.data);
        setTopRevenueStats(f.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <AdminNavbar />
        <div className="max-w-screen-2xl mx-auto p-6 space-y-6">
          <Skeleton className="h-8 w-72" />
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-80 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminNavbar />

      <div className="max-w-screen-2xl mx-auto px-6 py-8 space-y-8">
        <SectionHeader
          title="Analytics"
          subtitle="Service performance & platform insights"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <ChartCard title="Top Rated Services">
            <PieBlock data={topRated} dataKey="avg_rating" nameKey="name" />
          </ChartCard>

          <ChartCard title="Most Viewed Services">
            <BarBlock data={mostViewed} x="name" y="total_views" />
          </ChartCard>

          <ChartCard title="Monthly Growth">
            <LineBlock data={monthlyStats} x="month" y="count" />
          </ChartCard>

          <ChartCard title="Services by Category">
            <PieBlock data={categoryStats} dataKey="count" nameKey="category" />
          </ChartCard>

          <ChartCard title="Status Breakdown">
            <BarBlock data={statusStats} x="status" y="count" />
          </ChartCard>

          <ChartCard title="Top Revenue Services">
            <BarBlock
              data={topRevenueStats}
              x="name"
              y="total_revenue"
              formatter={(v: { toLocaleString: () => any; }) => `₹${v.toLocaleString()}`}
            />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}

/* ---------------- PRIMITIVES ---------------- */

function SectionHeader({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
      <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
    </div>
  );
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6">
      <h3 className="text-sm font-medium text-slate-700 mb-4">{title}</h3>
      {children}
    </div>
  );
}

function PieBlock({ data, dataKey, nameKey }: any) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <PieChart>
        <Pie data={data} dataKey={dataKey} nameKey={nameKey} outerRadius={80}>
          {data.map((_: any, i: number) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<GlassTooltip />} />
      </PieChart>
    </ResponsiveContainer>
  );
}

function BarBlock({ data, x, y, formatter }: any) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data}>
        <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
        <XAxis dataKey={x} stroke="#64748B" />
        <YAxis stroke="#64748B" />
        <Tooltip content={<GlassTooltip />} formatter={formatter} />
        <Bar dataKey={y} fill="#52C4FF" radius={[6, 6, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

function LineBlock({ data, x, y }: any) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <LineChart data={data}>
        <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
        <XAxis dataKey={x} stroke="#64748B" />
        <YAxis stroke="#64748B" />
        <Tooltip content={<GlassTooltip />} />
        <Line type="monotone" dataKey={y} stroke="#52C4FF" strokeWidth={2} dot={{ r: 3 }} />
      </LineChart>
    </ResponsiveContainer>
  );
}
