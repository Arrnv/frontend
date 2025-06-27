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
          axios.get<User[]>('http://localhost:8000/admin/users', { withCredentials: true }),
          axios.get('http://localhost:8000/admin/users/stats/roles', { withCredentials: true }),
          axios.get<SignupStat[]>('http://localhost:8000/admin/users/stats/created', { withCredentials: true }),
          axios.get('http://localhost:8000/admin/analytics', { withCredentials: true }),
        ]);

        const parsedRoleStats: RoleStat[] = Object.entries(roleRes.data).map(([role, count]) => ({
          role,
          count: Number(count),
        }));

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
      await axios.put(`http://localhost:8000/admin/users/${id}/role`, { role: newRole }, { withCredentials: true });
      setUsers(prev => prev.map(user => user.id === id ? { ...user, role: newRole as User['role'] } : user));
    } catch (err) {
      console.error('Failed to update role:', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this user?')) return;
    try {
      await axios.delete(`http://localhost:8000/admin/users/${id}`, { withCredentials: true });
      setUsers(prev => prev.filter(user => user.id !== id));
    } catch (err) {
      console.error('Failed to delete user:', err);
    }
  };

  const exportCSV = () => {
    const header = ['Full Name', 'Email', 'Role', 'Created At'];
    const rows = users.map(user => [
      user.full_name,
      user.email,
      user.role,
      format(new Date(user.created_at), 'yyyy-MM-dd')
    ]);
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
 
  if (loading) return <p className="p-4 text-center">Loading users...</p>;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-10">
      <h1 className="text-2xl font-bold">User Management</h1>

      {/* Export Buttons */}
      <div className="flex gap-4 mb-4">
        <button onClick={exportCSV} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Export CSV
        </button>
        <button onClick={exportExcel} className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
          Export Excel
        </button>
      </div>

      {/* User Table */}
      <table className="w-full table-auto border-collapse shadow">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2 border">Name</th>
            <th className="p-2 border">Email</th>
            <th className="p-2 border">Role</th>
            <th className="p-2 border">Created</th>
            <th className="p-2 border">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="text-center">
              <td className="p-2 border">{user.full_name}</td>
              <td className="p-2 border">{user.email}</td>
              <td className="p-2 border">
                <select
                  value={user.role}
                  onChange={e => handleRoleChange(user.id, e.target.value)}
                  className="border rounded px-2 py-1"
                >
                  <option value="visitor">Visitor</option>
                  <option value="business">Business</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td className="p-2 border">{format(new Date(user.created_at), 'yyyy-MM-dd')}</td>
              <td className="p-2 border">
                <button
                  onClick={() => handleDelete(user.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Charts Section */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Users by Role */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Users by Role</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roleStats} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="role" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Signups Over Time */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">User Signups Over Time</h2>
          <div className="flex gap-4 items-center mb-4">
            <div>
              <label className="text-sm font-medium mr-2">From:</label>
              <DatePicker selected={startDate} onChange={date => setStartDate(date)} />
            </div>
            <div>
              <label className="text-sm font-medium mr-2">To:</label>
              <DatePicker selected={endDate} onChange={date => setEndDate(date)} />
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={filteredSignupStats} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={(tick) => format(new Date(tick), 'MMM d')}
              />
              <YAxis allowDecimals={false} />
              <Tooltip labelFormatter={(value) => `Date: ${format(new Date(value), 'yyyy-MM-dd')}`} />
              <Legend />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#10B981"
                strokeWidth={3}
                dot={{ r: 5 }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Views & Clicks Over Time */}
        <div className="bg-white p-4 rounded shadow col-span-1 md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">User Interaction Analytics</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={analyticsStats} margin={{ top: 20, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="view" stroke="#3B82F6" name="Views" />
              <Line type="monotone" dataKey="click" stroke="#F59E0B" name="Clicks" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Role Distribution Pie Chart */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Role Distribution</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roleStats}
                dataKey="count"
                nameKey="role"
                cx="50%"
                cy="50%"
                outerRadius={90}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {roleStats.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={['#6366F1', '#10B981', '#F59E0B'][index % 3]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>
    </div>
  );
}
