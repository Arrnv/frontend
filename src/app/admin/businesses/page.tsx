'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
  LineChart, Line
} from 'recharts';
import AdminNavbar from '@/components/AdminNavbar';

import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { subDays } from 'date-fns';

interface Business {
  id: string;
  name: string;
  location: string;
  contact: string;
  website: string;
  owner_email: string;
  created_at: string;
  status: 'pending' | 'approved';
}

interface Stat {
  date: string;
  count: number;
}

interface CategoryStat {
  category: string;
  count: number;
}

export default function AdminBusinessPage() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [signupStats, setSignupStats] = useState<Stat[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [startDate, setStartDate] = useState<Date | null>(subDays(new Date(), 30));
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');

  useEffect(() => {
    const fetchData = async () => {
      const [bizRes, createdRes, catRes] = await Promise.all([
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/businesses`, { withCredentials: true }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/businesses/stats/created`, { withCredentials: true }),
        axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/businesses/stats/categories`, { withCredentials: true }),
      ]);
      setBusinesses(bizRes.data);
      setSignupStats(createdRes.data);
      setCategoryStats(catRes.data);
    };
    fetchData();
  }, []);

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    if (status === 'rejected' && !confirm('Are you sure to reject and delete this business?')) return;

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/businesses/${id}/status`, { status }, { withCredentials: true });

      setBusinesses(prev =>
        status === 'approved'
          ? prev.map(b => b.id === id ? { ...b, status: 'approved' } : b)
          : prev.filter(b => b.id !== id)
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    }
  };

  const filteredStats = signupStats.filter(s => {
    const d = new Date(s.date);
    return (!startDate || d >= startDate) && (!endDate || d <= endDate);
  });

  const filteredBusinesses = businesses.filter(b => {
    const statusMatch = statusFilter === 'all' || b.status === statusFilter;
    const searchMatch =
      b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.owner_email.toLowerCase().includes(searchTerm.toLowerCase());
    return statusMatch && searchMatch;
  });

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      <AdminNavbar />
      <h1 className="text-2xl font-bold">Business Management</h1>

      {/* Filter Section */}
      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold">Filter by Status:</label>
          <select
            className="border rounded px-2 py-1"
            onChange={e => setStatusFilter(e.target.value as 'approved' | 'pending' | 'all')}
            value={statusFilter}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm font-semibold">Search:</label>
          <input
            type="text"
            placeholder="Business name or email"
            className="border rounded px-2 py-1"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <table className="w-full table-auto border-collapse shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Website</th>
            <th className="p-2 border">Status</th>
            <th className="p-2 border">Created</th>
            <th className="p-2 border">Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredBusinesses.map(b => (
            <tr key={b.id} className="text-center">
              <td className="p-2 border">{b.name}</td>
              <td className="p-2 border">{b.owner_email}</td>
              <td className="p-2 border">
                <a href={b.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">
                  Visit
                </a>
              </td>
              <td className="p-2 border">{b.status}</td>
              <td className="p-2 border">{new Date(b.created_at).toLocaleDateString()}</td>
              <td className="p-2 border space-x-2">
                {b.status === 'pending' && (
                  <>
                    <button
                      onClick={() => updateStatus(b.id, 'approved')}
                      className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => updateStatus(b.id, 'rejected')}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Charts Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Business Signups Over Time</h2>
          <div className="flex gap-4 items-center mb-4">
            <div>
              <label className="text-sm font-medium mr-2">From:</label>
              <DatePicker selected={startDate} onChange={setStartDate} />
            </div>
            <div>
              <label className="text-sm font-medium mr-2">To:</label>
              <DatePicker selected={endDate} onChange={setEndDate} />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="count" stroke="#10B981" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Top Service Categories</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#6366F1" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
