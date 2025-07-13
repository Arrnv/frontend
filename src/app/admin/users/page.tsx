// File: AdminUsersPage.tsx

'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid,
  ResponsiveContainer, Legend, PieChart, Pie, Cell
} from 'recharts';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { subDays, format } from 'date-fns';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import AdminNavbar from '@/components/AdminNavbar';

// --- Types ---
type User = {
  id: string;
  full_name: string;
  email: string;
  role: 'admin' | 'business' | 'visitor';
  created_at: string;
};

type RoleStat = {
  role: string;
  count: number;
};

type SignupStat = {
  date: string;
  count: number;
};

// --- Component ---
export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roleStats, setRoleStats] = useState<RoleStat[]>([]);
  const [signupStats, setSignupStats] = useState<SignupStat[]>([]);
  const [analyticsStats, setAnalyticsStats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  useEffect(() => {
    setStartDate(subDays(new Date(), 30));
    setEndDate(new Date());

    const fetchUsers = async () => {
      try {
        const [userRes, roleRes, createdRes, analyticsRes] = await Promise.all([
          axios.get<User[]>(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, { withCredentials: true }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/stats/roles`, { withCredentials: true }),
          axios.get<SignupStat[]>(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/stats/created`, { withCredentials: true }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/analytics`, { withCredentials: true }),
        ]);

        const parsedRoleStats: RoleStat[] = Object.entries(roleRes.data).map(([role, count]) => ({ role, count: Number(count) }));

        setUsers(userRes.data);
        setRoleStats(parsedRoleStats);
        setSignupStats(createdRes.data);
        setAnalyticsStats(analyticsRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredSignupStats = signupStats.filter(stat => {
    const date = new Date(stat.date);
    return (!startDate || date >= startDate) && (!endDate || date <= endDate);
  });

  const handleRoleChange = async (id: string, newRole: string) => {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}/role`, { role: newRole }, { withCredentials: true });
      setUsers(prev => prev.map(user => user.id === id ? { ...user, role: newRole as User['role'] } : user));
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    try {
      await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`, { withCredentials: true });
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const exportCSV = () => {
    const header = ['Full Name', 'Email', 'Role', 'Created At'];
    const rows = users.map(user => [user.full_name, user.email, user.role, format(new Date(user.created_at), 'yyyy-MM-dd')]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'users.csv');
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(
      users.map(user => ({
        Name: user.full_name,
        Email: user.email,
        Role: user.role,
        Created: format(new Date(user.created_at), 'yyyy-MM-dd'),
      }))
    );
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'users.xlsx');
  };

  if (loading) return <p className="text-center text-white mt-10">Loading users...</p>;

  return (
    <div className="bg-[#0E1C2F] min-h-screen text-white pt-[10rem] bg-gradient-to-br from-[#0E1C2F] via-[#1F3B79] to-[#415CBB]">
      <AdminNavbar />
      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 flex flex-col gap-8">
            <div className="bg-white/5 border border-[#2E60C3]/30 backdrop-blur-md rounded-2xl p-6 hover:shadow-[0_0_12px_#2E60C3] transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-4">Users by Role</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={roleStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="role" stroke="#8B9AB2" />
                  <YAxis stroke="#8B9AB2" />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="count" fill="#48AFFF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="bg-white/5 border border-[#2E60C3]/30 backdrop-blur-md rounded-2xl p-6 hover:shadow-[0_0_12px_#32E3C6] transition-shadow duration-300">
              <h2 className="text-xl font-semibold mb-4">Signups Over Time</h2>
              <div className="flex gap-4 mb-4">
                <DatePicker selected={startDate} onChange={date => setStartDate(date)} className="text-black px-2 py-1 rounded" />
                <DatePicker selected={endDate} onChange={date => setEndDate(date)} className="text-black px-2 py-1 rounded" />
              </div>
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={filteredSignupStats}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" stroke="#8B9AB2" tickFormatter={tick => format(new Date(tick), 'MMM d')} />
                  <YAxis stroke="#8B9AB2" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="count" stroke="#32E3C6" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="lg:col-span-2">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">User Management</h1>
              <div className="flex gap-3">
                <button onClick={exportCSV} className="bg-[#246BFD] px-4 py-2 rounded text-white hover:brightness-110">Export CSV</button>
                <button onClick={exportExcel} className="bg-[#32E3C6] px-4 py-2 rounded text-white hover:brightness-110">Export Excel</button>
              </div>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {users.map(user => (
                <div
                  key={user.id}
                  className="bg-white/5 border border-[#2E60C3]/30 backdrop-blur-lg rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between shadow-md hover:shadow-[0_0_12px_#415CBB] transition duration-300"
                >
                  <div className="flex-1">
                    <p className="text-lg font-semibold text-white">{user.full_name}</p>
                    <p className="text-sm text-[#8B9AB2] mt-1">{user.email}</p>
                    <p className="text-sm text-[#8B9AB2] mt-1">
                      Created on <span className="text-white font-medium">{format(new Date(user.created_at), 'yyyy-MM-dd')}</span>
                    </p>
                  </div>

                  <div className="mt-4 md:mt-0 flex items-center gap-4">
                    <select
                      value={user.role}
                      onChange={e => handleRoleChange(user.id, e.target.value)}
                      className="bg-[#415CBB]/60 text-white border border-[#2E60C3]/50 rounded-md px-3 py-2 text-sm focus:outline-none hover:shadow-md transition"
                    >
                      <option value="visitor">Visitor</option>
                      <option value="business">Business</option>
                      <option value="admin">Admin</option>
                    </select>

                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-[#FF5E8A] hover:bg-[#e54a74] text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7L5 21M5 7l14 14" />
                      </svg>
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}