'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://phpstack-1383739-5654472.cloudwaysapps.com/api/auth/login', form, {
        withCredentials: true,
      });
      if (res.data?.user?.role === 'business') {
        router.push('/business/dashboard');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-10 space-y-4">
      <h2 className="text-2xl font-bold text-center">Business Login</h2>
      <input
        type="email"
        placeholder="Email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
        Login
      </button>
      <button
        type="button"
        onClick={() => router.push('/business/signup')}
        className="w-full border border-green-600 text-green-600 py-2 rounded hover:bg-green-50"
      >
        Don&apos;t have an account? Sign Up
      </button>
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
}
