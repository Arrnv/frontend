'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false });

const BusinessOnlyOnboarding = () => {
  const router = useRouter();

  interface Plan {
    id: string;
    name: string;
    price: number;
    duration: string;
  }

  const [plans, setPlans] = useState<Plan[]>([]);
  const [form, setForm] = useState({
    name: '',
    location: '',
    plan_id: '',
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [error, setError] = useState('');

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
        const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/pay/start-subscription`, {
          email: localStorage.getItem('userEmail'),
          plan_id: selectedPlan.id,
        });

        window.location.href = res.data.url;
      } else {
        await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/businesses/onboard`, payload, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });

        router.push('/business/dashboard');
      }
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Business onboarding failed');
    }
  };
  const [user, setUser] = useState<{ email: string; fullName: string ,role?: string; } | null>(null);

useEffect(() => {
  const checkUser = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, { withCredentials: true });
      if (res.status === 200) {
        const user = res.data.user;
        setUser(user);

        if (user.role === 'business') {
          router.push('/business/dashboard');
        }
      }
    } catch {
    }
  };
  checkUser();
}, [router]);
  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gradient-to-br from-[#0E1C2F] via-[#1F3B79] to-[#415CBB]">
      <div className="w-full max-w-2xl p-8 rounded-2xl bg-white/10 backdrop-blur-md shadow-xl border border-white/20">
        <h1 className="text-3xl font-semibold text-white mb-6 text-center">✨ Onboard Your Business</h1>

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

          <div>
            <label className="text-white text-sm block mb-1">📤 Upload Logo</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) setLogoFile(e.target.files[0]);
              }}
              className="w-full text-white"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg"
          >
            {(() => {
              const selected = plans.find((p) => p.id === form.plan_id);
              if (!selected) return '🚀 Continue (Free Plan)';
              return selected.price > 0 ? '💳 Pay & Continue' : '🚀 Continue (Free Plan)';
            })()}
          </button>

          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default BusinessOnlyOnboarding;
