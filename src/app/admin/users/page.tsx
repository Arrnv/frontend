'use client';

/**
 * Admin Users Page – CONSISTENT SYSTEM REDESIGN
 * --------------------------------------------
 * Aligned with:
 * - Admin Dashboard
 * - Admin Analytics
 *
 * Principles:
 * - Light background (#F8FAFC)
 * - White cards, slate borders
 * - Clear hierarchy, no glassmorphism
 * - Predictable table-based management UI
 */

import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '@/components/AdminNavbar';
import { Skeleton } from '@/components/Skeleton';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { subDays, format } from 'date-fns';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';

/* ---------------- TYPES ---------------- */

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

/* ---------------- PAGE ---------------- */

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [roleStats, setRoleStats] = useState<RoleStat[]>([]);
  const [signupStats, setSignupStats] = useState<SignupStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem('authToken')}`,
    },
  });

  useEffect(() => {
    setStartDate(subDays(new Date(), 30));
    setEndDate(new Date());

    Promise.all([
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/users`, getAuthConfig()),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/stats/roles`, getAuthConfig()),
      axios.get(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/stats/created`, getAuthConfig()),
    ])
      .then(([usersRes, rolesRes, createdRes]) => {
        setUsers(usersRes.data);
        setSignupStats(createdRes.data);
        setRoleStats(
          Object.entries(rolesRes.data).map(([role, count]) => ({
            role,
            count: Number(count),
          }))
        );
      })
      .finally(() => setLoading(false));
  }, []);

  const filteredSignupStats = signupStats.filter(stat => {
    const d = new Date(stat.date);
    return (!startDate || d >= startDate) && (!endDate || d <= endDate);
  });

  const handleRoleChange = async (id: string, role: string) => {
    await axios.put(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}/role`,
      { role },
      getAuthConfig()
    );
    setUsers(u => u.map(x => (x.id === id ? { ...x, role: role as any } : x)));
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    await axios.delete(`${process.env.NEXT_PUBLIC_API_URL}/admin/users/${id}`, getAuthConfig());
    setUsers(u => u.filter(x => x.id !== id));
  };

  const exportCSV = () => {
    const rows = users.map(u => [u.full_name, u.email, u.role, format(new Date(u.created_at), 'yyyy-MM-dd')]);
    const csv = [['Name', 'Email', 'Role', 'Created'], ...rows].map(r => r.join(',')).join('\n');
    saveAs(new Blob([csv], { type: 'text/csv' }), 'users.csv');
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(users);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Users');
    saveAs(new Blob([XLSX.write(wb, { bookType: 'xlsx', type: 'array' })]), 'users.xlsx');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC]">
        <AdminNavbar />
        <div className="max-w-screen-2xl mx-auto p-6 space-y-6">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-80 rounded-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <AdminNavbar />

      <div className="max-w-screen-2xl mx-auto px-6 py-8 space-y-8">
        <SectionHeader title="Users" subtitle="Manage users, roles & growth" />

        {/* ANALYTICS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ChartCard title="Users by Role">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={roleStats}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
                <XAxis dataKey="role" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Bar dataKey="count" fill="#52C4FF" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Signups Over Time" className="lg:col-span-2">
            <div className="flex gap-4 mb-4">
              <DatePicker selected={startDate} onChange={setStartDate} className="input" />
              <DatePicker selected={endDate} onChange={setEndDate} className="input" />
            </div>
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={filteredSignupStats}>
                <CartesianGrid stroke="#E2E8F0" strokeDasharray="3 3" />
                <XAxis dataKey="date" stroke="#64748B" />
                <YAxis stroke="#64748B" />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#52C4FF" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* TABLE */}
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b border-slate-200">
            <h3 className="font-medium text-slate-900">User Management</h3>
            <div className="flex gap-2">
              <Button onClick={exportCSV}>Export CSV</Button>
              <Button onClick={exportExcel} variant="secondary">Export Excel</Button>
            </div>
          </div>

          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-3 text-left">Name</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-t">
                  <td className="px-6 py-4 font-medium text-slate-900">{u.full_name}</td>
                  <td className="px-6 py-4 text-slate-600">{u.email}</td>
                  <td className="px-6 py-4 text-center">
                    <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)} className="select">
                      <option value="visitor">Visitor</option>
                      <option value="business">Business</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-center text-slate-500">{format(new Date(u.created_at), 'yyyy-MM-dd')}</td>
                  <td className="px-6 py-4 text-right">
                    <button onClick={() => handleDelete(u.id)} className="text-red-600 hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

function ChartCard({ title, children, className = '' }: any) {
  return (
    <div className={`bg-white border border-slate-200 rounded-xl p-6 ${className}`}>
      <h3 className="text-sm font-medium text-slate-700 mb-4">{title}</h3>
      {children}
    </div>
  );
}

type ButtonVariant = 'primary' | 'secondary';

function Button({
  children,
  onClick,
  variant = 'primary',
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: ButtonVariant;
}) {
  const styles: Record<ButtonVariant, string> = {
    primary: 'bg-[#52C4FF] text-white',
    secondary: 'bg-slate-100 text-slate-700',
  };

  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-md text-sm ${styles[variant]}`}
    >
      {children}
    </button>
  );
}

