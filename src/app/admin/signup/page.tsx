'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function AdminSignupPage() {
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`,
        { ...form, role: 'admin' },
        { withCredentials: true }
      );

      if (res.status === 200 || res.status === 201) {
        alert('Admin signed up successfully!');
        router.push('/admin/dashboard'); 
      }
    } catch (err: any) {
      console.error('Signup failed:', err);
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">Admin Signup</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
            required
          />
        </div>
        <div>
          <label className="block font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="border px-3 py-2 w-full rounded"
            required
          />
        </div>
        {error && <p className="text-red-500">{error}</p>}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
