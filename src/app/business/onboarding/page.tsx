'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false });

interface Plan {
  id: string;
  name: string;
  price: number;
  duration: string;
}

const BusinessOnlyOnboarding = () => {
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [form, setForm] = useState({
    name: '',
    location: '',
    plan_id: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState('');

  /** ✅ SAFE localStorage access */
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    setToken(storedToken);
  }, []);

  /** Fetch plans */
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/plans`);
        setPlans(res.data);
      } catch (err) {
        console.error('Failed to fetch plans:', err);
      }
    };
    fetchPlans();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!token) {
      setError('Authentication required.');
      return;
    }

    const selectedPlan = plans.find((p) => p.id === form.plan_id);
    if (!selectedPlan) {
      setError('Invalid plan selected.');
      return;
    }

    try {
      const payload = new FormData();
      payload.append('name', form.name);
      payload.append('plan_id', form.plan_id);
      payload.append('owner_email', localStorage.getItem('userEmail') || '');

      if (logoFile) {
        payload.append('logo', logoFile);
      }

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
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        router.push('/business/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Business onboarding failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-[#0E1C2F] via-[#1F3B79] to-[#415CBB]">
      <div className="w-full max-w-2xl p-8 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl border border-white/20">
        <h1 className="text-3xl font-semibold text-white mb-6 text-center">
          ✨ Onboard Your Business
        </h1>

        <form className="space-y-4" onSubmit={handleSubmit}>
          <input
            type="text"
            name="name"
            placeholder="Business Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/20 text-white"
          />

          <input
            type="text"
            name="location"
            placeholder="Business Location"
            value={form.location}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/20 text-white"
          />

          <select
            name="plan_id"
            value={form.plan_id}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-lg bg-white/20 text-white"
          >
            <option value="">Select a Subscription Plan</option>
            {plans.map((plan) => (
              <option key={plan.id} value={plan.id}>
                {plan.name} - ₹{plan.price} ({plan.duration})
              </option>
            ))}
          </select>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => e.target.files && setLogoFile(e.target.files[0])}
            className="w-full text-white"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg"
          >
            🚀 Continue
          </button>

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default BusinessOnlyOnboarding;
