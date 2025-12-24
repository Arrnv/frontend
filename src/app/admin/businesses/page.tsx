'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from 'recharts';

import AdminNavbar from '@/components/AdminNavbar';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function AdminServicesPage() {
  const [topRated, setTopRated] = useState<any[]>([]);
  const [mostViewed, setMostViewed] = useState<any[]>([]);
  const [monthly, setMonthly] = useState<any[]>([]);
  const [byCategory, setByCategory] = useState<any[]>([]);
  const [statusSummary, setStatusSummary] = useState<any[]>([]);
  const [topRevenue, setTopRevenue] = useState<any[]>([]);

  const [loading, setLoading] = useState(true);

useEffect(() => {
  const fetchServiceStats = async () => {
    try {
      const token = localStorage.getItem('authToken'); // ✅ FIX

      if (!token) {
        console.error('No auth token found in localStorage');
        setLoading(false);
        return;
      }

      const authConfig = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [
        topRatedRes,
        mostViewedRes,
        monthlyRes,
        byCategoryRes,
        statusSummaryRes,
        topRevenueRes,
      ] = await Promise.all([
        axios.get(`${API}/admin/services/stats/top-rated`, authConfig),
        axios.get(`${API}/admin/services/stats/most-viewed`, authConfig),
        axios.get(`${API}/admin/services/stats/monthly`, authConfig),
        axios.get(`${API}/admin/services/stats/by-category`, authConfig),
        axios.get(`${API}/admin/services/stats/status-summary`, authConfig),
        axios.get(`${API}/admin/services/stats/top-revenue`, authConfig),
      ]);

      setTopRated(topRatedRes.data);
      setMostViewed(mostViewedRes.data);
      setMonthly(monthlyRes.data);
      setByCategory(byCategoryRes.data);
      setStatusSummary(statusSummaryRes.data);
      setTopRevenue(topRevenueRes.data);
    } catch (err) {
      console.error('Error fetching service stats:', err);
    } finally {
      setLoading(false);
    }
  };

  fetchServiceStats();
}, []);



  if (loading) {
    return (
      <div className="p-6">
        <AdminNavbar />
        <p className="mt-6 text-white">Loading service analytics…</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-10">
      <AdminNavbar />

      <h1 className="text-2xl font-bold text-white">Service Analytics</h1>

      {/* MOST VIEWED */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-4">Most Viewed Services</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={mostViewed}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="views" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* TOP RATED */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-4">Top Rated Services</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topRated}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="rating" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* MONTHLY */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-4">Monthly Service Activity</h2>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={monthly}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="count" stroke="#3B82F6" />
          </LineChart>
        </ResponsiveContainer>
      </section>

      {/* BY CATEGORY */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-4">Services by Category</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={byCategory}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#F59E0B" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* STATUS SUMMARY */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-4">Service Status Summary</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={statusSummary}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="status" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="count" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </section>

      {/* TOP REVENUE */}
      <section className="bg-white p-4 rounded shadow">
        <h2 className="font-semibold mb-4">Top Revenue Services</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={topRevenue}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="total_revenue" fill="#22C55E" />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
}
