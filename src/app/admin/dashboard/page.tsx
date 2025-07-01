'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from 'recharts';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/AdminNavbar';
import GlassTooltip from '@/components/GlassTooltip';

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

export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [summaryRes, analyticsRes] = await Promise.all([
          axios.get('http://localhost:8000/admin/dashboard', { withCredentials: true }),
          axios.get('http://localhost:8000/admin/analytics', { withCredentials: true })
        ]);

        setSummary(summaryRes.data);
        setAnalytics(analyticsRes.data);
      } catch (err) {
        console.error(err);
        router.push('/admin/login');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="text-center p-8 text-white">Loading...</div>;

  return (
    <main className="bg-[#0E1C2F] min-h-screen text-white">
      <AdminNavbar />
      <div className="max-w-7xl mx-auto px-8 py-10 space-y-10">
        <h1 className="text-4xl font-bold text-white">Admin Dashboard</h1>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <DashboardCard title="Total Users" value={summary?.totalUsers ?? 0} />
          <DashboardCard title="Total Businesses" value={summary?.totalBusinesses ?? 0} />
          <DashboardCard title="Total Services" value={summary?.totalServices ?? 0} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <AnalyticsChart
            title="Views Over Time"
            data={analytics}
            dataKey="view"
            stroke="#32E3C6"
          />
          <AnalyticsChart
            title="Clicks Over Time"
            data={analytics}
            dataKey="click"
            stroke="#C44EFF"
          />
        </div>
      </div>
    </main>
  );
}

type DashboardCardProps = {
  title: string;
  value: number;
};

function DashboardCard({ title, value }: DashboardCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#1F3B79] to-[#2E60C3] backdrop-blur-xl rounded-2xl p-6 shadow-inner shadow-[#2E60C3]/40 transition-all duration-300 hover:shadow-blue-500/40 hover:-translate-y-2 hover:shadow-2xl hover:bg-gradient-to-tr hover:from-[#2E60C3] hover:to-[#1F3B79]">
      <h2 className="text-lg font-semibold text-[#8B9AB2]">{title}</h2>
      <p className="text-4xl font-bold text-white mt-2">{value}</p>
    </div>
  );
}

type AnalyticsChartProps = {
  title: string;
  data: AnalyticsData[];
  dataKey: keyof AnalyticsData;
  stroke: string;
};

function AnalyticsChart({ title, data, dataKey, stroke }: AnalyticsChartProps) {
  return (
    <div className="bg-gradient-to-br from-[#1F3B79]/80 to-[#2E60C3]/70 backdrop-blur-xl rounded-2xl p-6 shadow-inner shadow-[#2E60C3]/40 transition-all duration-300 hover:shadow-blue-500/40 hover:-translate-y-2 hover:shadow-2xl hover:bg-gradient-to-tr hover:from-[#2E60C3]/80 hover:to-[#1F3B79]/70">
      <h3 className="text-lg font-semibold text-[#8B9AB2] mb-4">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#2E60C3" />
          <XAxis dataKey="date" stroke="#8B9AB2" />
          <YAxis allowDecimals={false} stroke="#8B9AB2" />
          <Tooltip
            content={<GlassTooltip />}
          />
          <Legend wrapperStyle={{ color: '#FFFFFF' }} />
          <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={3} dot={{ r: 4 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
