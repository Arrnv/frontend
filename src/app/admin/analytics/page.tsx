'use client';

import { useEffect, useState } from 'react';
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA77FF'];

export default function AdminAnalyticsPage() {
  const [topRated, setTopRated] = useState<StatEntry[]>([]);
  const [mostViewed, setMostViewed] = useState<StatEntry[]>([]);
  const [monthlyStats, setMonthlyStats] = useState<MonthlyStat[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [statusStats, setStatusStats] = useState<StatusStat[]>([]);

  useEffect(() => {
    fetchTopRated();
    fetchMostViewed();
    fetchMonthlyStats();
    fetchCategoryStats();
    fetchStatusStats();
  }, []);

  const fetchTopRated = async () => {
    try {
      const res = await axios.get('http://localhost:8000/admin/services/stats/top-rated', {
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
      const res = await axios.get('http://localhost:8000/admin/services/stats/most-viewed', {
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
      const res = await axios.get('http://localhost:8000/admin/services/stats/monthly', {
        withCredentials: true,
      });
      setMonthlyStats(res.data);
    } catch (err) {
      console.error('Error fetching monthly stats:', err);
    }
  };

  const fetchCategoryStats = async () => {
    try {
      const res = await axios.get('http://localhost:8000/admin/services/stats/by-category', {
        withCredentials: true,
      });
      setCategoryStats(res.data);
    } catch (err) {
      console.error('Error fetching category stats:', err);
    }
  };

  const fetchStatusStats = async () => {
    try {
      const res = await axios.get('http://localhost:8000/admin/services/stats/status-summary', {
        withCredentials: true,
      });
      setStatusStats(res.data);
    } catch (err) {
      console.error('Error fetching status stats:', err);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-12">
      <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

      {/* Top Rated & Most Viewed */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Top Rated Services Pie */}
        <div className="bg-white shadow p-4 rounded border">
          <h2 className="text-lg font-semibold mb-4">Top Rated Services</h2>
          {topRated.length === 0 ? (
            <p>No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={topRated}
                  dataKey="avg_rating"
                  nameKey="name"
                  outerRadius={100}
                  label
                >
                  {topRated.map((entry, index) => (
                    <Cell key={`cell-top-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Most Viewed Bar */}
        <div className="bg-white shadow p-4 rounded border">
          <h2 className="text-lg font-semibold mb-4">Most Viewed Services</h2>
          {mostViewed.length === 0 ? (
            <p>No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mostViewed}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_views" fill="#00C49F" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="grid md:grid-cols-2 gap-10">
        {/* Monthly Growth Line */}
        <div className="bg-white shadow p-4 rounded border">
          <h2 className="text-lg font-semibold mb-4">Monthly Service Growth</h2>
          {monthlyStats.length === 0 ? (
            <p>No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyStats}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Category Distribution Pie */}
        <div className="bg-white shadow p-4 rounded border">
          <h2 className="text-lg font-semibold mb-4">Service Distribution by Category</h2>
          {categoryStats.length === 0 ? (
            <p>No data</p>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryStats}
                  dataKey="count"
                  nameKey="category"
                  outerRadius={100}
                  label
                >
                  {categoryStats.map((entry, index) => (
                    <Cell key={`cat-cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Status Bar Chart */}
      <div className="bg-white shadow p-4 rounded border">
        <h2 className="text-lg font-semibold mb-4">Status Breakdown</h2>
        {statusStats.length === 0 ? (
          <p>No data</p>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={statusStats}>
              <XAxis dataKey="status" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#FF8042" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
