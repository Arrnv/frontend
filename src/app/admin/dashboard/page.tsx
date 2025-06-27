'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
} from 'recharts';
import { useRouter } from 'next/navigation';
import AdminNavbar from '@/components/AdminNavbar';


export default function AdminDashboardPage() {
  const [summary, setSummary] = useState<{
  totalUsers: number;
  totalBusinesses: number;
  totalServices: number;
} | null>(null);
  const [analytics, setAnalytics] = useState<any[]>([]);
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

  if (loading) return <div className="text-center p-8">Loading...</div>;

  return (
    <main>
        <AdminNavbar />
        <div className="max-w-6xl mx-auto p-6 space-y-8">
        
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>

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
            stroke="#4F46E5"
            />
            <AnalyticsChart
            title="Clicks Over Time"
            data={analytics}
            dataKey="click"
            stroke="#059669"
            />
        </div>
        </div>
    </main>
  );
}

function DashboardCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="bg-white rounded shadow p-4">
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="text-2xl mt-2">{value}</p>
    </div>
  );
}

function AnalyticsChart({ title, data, dataKey, stroke }: any) {
  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      <ResponsiveContainer width="100%" height={250}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
