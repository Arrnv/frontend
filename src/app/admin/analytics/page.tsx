'use client';

import { useEffect, useState } from 'react';
import AdminNavbar from '@/components/AdminNavbar';
import GlassTooltip from '@/components/GlassTooltip';
import axios from 'axios';
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
  Legend,
  LineChart,
  Line,
} from 'recharts';

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

const COLORS = ['#246BFD', '#00C49F', '#FFBB28', '#C44EFF', '#FF5E8A', '#32E3C6'];

export default function AdminAnalyticsPage() {
  const [topRated, setTopRated] = useState<StatEntry[]>([]);
  const [mostViewed, setMostViewed] = useState<StatEntry[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [statusStats, setStatusStats] = useState<StatusStat[]>([]);
  const [topRevenueStats, setTopRevenueStats] = useState<RevenueStat[]>([]);

  useEffect(() => {
    fetchTopRated();
    fetchMostViewed();
    fetchMonthlyStats();
    fetchCategoryStats();
    fetchStatusStats();
    fetchTopRevenueStats();
  }, []);

  const fetchTopRated = async () => {
    try {
      const res = await axios.get('https://phpstack-1383739-5654472.cloudwaysapps.com/admin/services/stats/top-rated', {
        withCredentials: true,
      });
      const formatted = res.data.map((d: any) => ({
        detail_id: d.detail_id,
        name: d.name || d.details?.name || 'Unnamed',
        avg_rating: d.avg_rating,
      }));
      setTopRated(formatted);
    } catch (err) {
      console.error('Error fetching top-rated services:', err);
    }
  };

  const fetchMostViewed = async () => {
    try {
      const res = await axios.get('https://phpstack-1383739-5654472.cloudwaysapps.com/admin/services/stats/most-viewed', {
        withCredentials: true,
      });
      const formatted = res.data.map((d: any) => ({
        detail_id: d.detail_id,
        name: d.name || d.details?.name || 'Unnamed',
        total_views: d.total_views,
      }));
      setMostViewed(formatted);
    } catch (err) {
      console.error('Error fetching most viewed services:', err);
    }
  };

  const fetchMonthlyStats = async () => {
    try {
      const res = await axios.get('https://phpstack-1383739-5654472.cloudwaysapps.com/admin/services/stats/monthly', {
        withCredentials: true,
      });
      setMonthlyStats(res.data);
    } catch (err) {
      console.error('Error fetching monthly stats:', err);
    }
  };

  const fetchCategoryStats = async () => {
    try {
      const res = await axios.get('https://phpstack-1383739-5654472.cloudwaysapps.com/admin/services/stats/by-category', {
        withCredentials: true,
      });
      setCategoryStats(res.data);
    } catch (err) {
      console.error('Error fetching category stats:', err);
    }
  };

  const fetchStatusStats = async () => {
    try {
      const res = await axios.get('https://phpstack-1383739-5654472.cloudwaysapps.com/admin/services/stats/status-summary', {
        withCredentials: true,
      });
      setStatusStats(res.data);
    } catch (err) {
      console.error('Error fetching status stats:', err);
    }
  };

  const fetchTopRevenueStats = async () => {
    try {
      const res = await axios.get('https://phpstack-1383739-5654472.cloudwaysapps.com/admin/services/stats/top-revenue', {
        withCredentials: true,
      });
      setTopRevenueStats(res.data);
    } catch (err) {
      console.error('Error fetching top revenue stats:', err);
    }
  };

  return (
    <div className="bg-[#0E1C2F] min-h-screen text-white">
      <AdminNavbar />
      <div className="px-6 py-10 max-w-7xl mx-auto space-y-12">
        <h1 className="text-4xl font-bold">Analytics Dashboard</h1>

        <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          <StatCard title="Top Rated Services">
            <ResponsiveContainer width="100%" height={250} className="rounded-2xl overflow-hidden">
              <PieChart>
                <Pie data={topRated} dataKey="avg_rating" nameKey="name" outerRadius={80} label>
                  {topRated.map((_, i) => (
                    <Cell key={`top-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<GlassTooltip />} isAnimationActive={false} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </StatCard>

          <StatCard title="Most Viewed Services">
            <ResponsiveContainer width="100%" height={250} className="rounded-2xl overflow-hidden">
              <BarChart data={mostViewed} className="rounded-2xl">
                <XAxis dataKey="name" stroke="#8B9AB2" />
                <YAxis stroke="#8B9AB2" />
                <Tooltip content={<GlassTooltip />} isAnimationActive={false} />
                <Legend />
                <Bar dataKey="total_views" fill="#32E3C6" radius={[8, 8, 0, 0]} activeBar={{ fill: '#32E3C6' }} />
              </BarChart>
            </ResponsiveContainer>
          </StatCard>

          <StatCard title="Monthly Growth">
            <ResponsiveContainer width="100%" height={250} className="rounded-2xl overflow-hidden">
              <LineChart data={monthlyStats} className="rounded-2xl">
                <XAxis dataKey="month" stroke="#8B9AB2" />
                <YAxis stroke="#8B9AB2" />
                <Tooltip content={<GlassTooltip />} isAnimationActive={false} />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#C44EFF" strokeWidth={3} dot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </StatCard>

          <StatCard title="Service by Category">
            <ResponsiveContainer width="100%" height={250} className="rounded-2xl overflow-hidden">
              <PieChart>
                <Pie data={categoryStats} dataKey="count" nameKey="category" outerRadius={80} label>
                  {categoryStats.map((_, i) => (
                    <Cell key={`cat-${i}`} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<GlassTooltip />} isAnimationActive={false} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </StatCard>

          <StatCard title="Status Breakdown">
            <ResponsiveContainer width="100%" height={250} className="rounded-2xl overflow-hidden">
              <BarChart data={statusStats} className="rounded-2xl">
                <XAxis dataKey="status" stroke="#8B9AB2" />
                <YAxis stroke="#8B9AB2" />
                <Tooltip content={<GlassTooltip />} isAnimationActive={false} />
                <Legend />
                <Bar dataKey="count" fill="#FF5E8A" radius={[8, 8, 0, 0]} activeBar={{ fill: '#FF5E8A' }} />
              </BarChart>
            </ResponsiveContainer>
          </StatCard>

          <StatCard title="Top Revenue Services">
            <ResponsiveContainer width="100%" height={250} className="rounded-2xl overflow-hidden">
              <BarChart data={topRevenueStats} className="rounded-2xl">
                <XAxis dataKey="name" stroke="#8B9AB2" />
                <YAxis stroke="#8B9AB2" />
                <Tooltip content={<GlassTooltip />} isAnimationActive={false} formatter={(v: number) => `₹${v.toLocaleString()}`} />
                <Legend />
                <Bar dataKey="total_revenue" fill="#AA77FF" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </StatCard>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-gradient-to-br from-[#1F3B79]/70 to-[#2E60C3]/70 backdrop-blur-xl border border-[#2E60C3]/30 hover:shadow-2xl hover:shadow-blue-500/50 hover:-translate-y-2 transition-all duration-500 ease-in-out rounded-[2rem] p-6">
      <h2 className="text-xl font-semibold text-white mb-4">{title}</h2>
      {children}
    </div>
  );
}