'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import PlanSelect from '@/components/PlanSelect';


interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
}

export default function BusinessOnlyOnboarding() {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    location: '',
    plan_id: '',
  });

  const [logoFile, setLogoFile] = useState<File | null>(null);

  /* Safe localStorage */
  useEffect(() => {
    setToken(localStorage.getItem('authToken'));
  }, []);

  /* Fetch plans */
  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_API_URL}/plans`)
      .then((res) => setPlans(res.data))
      .catch(() => setError('Unable to load plans'));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Authentication required.');
      return;
    }

    const selectedPlan = plans.find((p) => p.id === form.plan_id);
    if (!selectedPlan) {
      setError('Please select a subscription plan.');
      return;
    }

    try {
      setLoading(true);

      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('location', form.location);
      payload.append('plan_id', form.plan_id);
      payload.append('owner_email', localStorage.getItem('userEmail') || '');

      if (logoFile) payload.append('logo', logoFile);

      if (selectedPlan.price > 0) {
        const res = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/pay/start-subscription`,
          {
            email: localStorage.getItem('userEmail'),
            plan_id: selectedPlan.id,
          }
        );
        window.location.href = res.data.url;
      } else {
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/businesses/onboard`,
          payload,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        router.push('/business/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Onboarding failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center px-4">
      <div
        className="
          w-full max-w-xl
          bg-white
          rounded-2xl
          shadow-lg
          ring-1 ring-black/5
          p-8
        "
      >
        {/* Header */}
        <h1 className="text-xl font-semibold text-[#202231]">
          Business onboarding
        </h1>
        <p className="text-sm text-slate-500 mt-1 mb-6">
          Add your business details to start receiving customers
        </p>

        {error && (
          <div className="mb-5 rounded-lg bg-red-50 text-red-700 text-sm px-4 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <FloatingInput
            label="Business name"
            value={form.name}
            onChange={(v) => setForm({ ...form, name: v })}
          />

          <FloatingInput
            label="Business location"
            value={form.location}
            onChange={(v) => setForm({ ...form, location: v })}
          />

          {/* Plan selector */}
          <div className="relative">
<PlanSelect
  plans={plans}
  value={form.plan_id}
  onChange={(id) => setForm({ ...form, plan_id: id })}
/>

          </div>

          {/* Logo */}
          <div>
            <label className="block text-sm text-slate-600 mb-1">
              Business logo (optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && setLogoFile(e.target.files[0])
              }
              className="text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full py-3 rounded-xl
              bg-[#0099E8]
              text-white text-sm font-medium
              hover:bg-[#007FCC]
              transition
              disabled:opacity-60
            "
          >
            {loading ? 'Please wait…' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}

/* ---------------- Floating Input ---------------- */

type FloatingInputProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
};

const FloatingInput = ({ label, value, onChange }: FloatingInputProps) => (
  <div className="relative">
    <input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder=" "
      required
      className="
        peer w-full px-4 py-3 rounded-xl
        bg-white
        ring-1 ring-black/10
        focus:ring-2 focus:ring-[#0099E8]
        outline-none
        text-sm
      "
    />
    <label
      className="
        absolute left-4 top-1/2 -translate-y-1/2
        text-slate-400 text-sm
        transition-all
        peer-placeholder-shown:top-1/2
        peer-focus:top-2 peer-focus:text-xs peer-focus:text-[#0099E8]
        peer-not-placeholder-shown:top-2 peer-not-placeholder-shown:text-xs
      "
    >
      {label}
    </label>
  </div>
);
