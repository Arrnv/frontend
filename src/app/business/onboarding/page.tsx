'use client';
import React from 'react';


import { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';

// Dynamic import for Leaflet (client-side only)
const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false });

const BusinessOnlyOnboarding = () => {
  const router = useRouter();
  const [plans, setPlans] = useState([]);
  const [form, setForm] = useState({
    name: '',
    location: '',
    contact: '',
    website: '',
    plan_id: '',
    latitude: '',
    longitude: '',
  });

  const [error, setError] = useState('');
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get('https://phpstack-1383739-5654472.cloudwaysapps.com/plans');
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
    if (!selectedPosition) {
      setError('Please select a location on the map.');
      return;
    }

    try {
      const payload = {
        ...form,
        latitude: selectedPosition.lat,
        longitude: selectedPosition.lng,
      };

      await axios.post('https://phpstack-1383739-5654472.cloudwaysapps.com/businesses/onboard', payload, {
        withCredentials: true,
      });
      router.push('/business/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Business onboarding failed');
    }
  };

  return (
      <div className="flex items-center justify-center min-h-screen px-4">
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
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none border border-white/30 focus:ring-2 focus:ring-white/50"
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Business Location"
              value={form.location}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none border border-white/30"
              required
            />
            <input
              type="text"
              name="contact"
              placeholder="Contact"
              value={form.contact}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none border border-white/30"
              required
            />
            <input
              type="url"
              name="website"
              placeholder="Website (optional)"
              value={form.website}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none border border-white/30"
            />

            <select
              name="plan_id"
              value={form.plan_id}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-gray-300 outline-none border border-white/30"
              required
            >
              <option value="">Select a Subscription Plan</option>
              {plans.map((plan: any) => (
                <option key={plan.id} value={plan.id}>
                  {plan.name} - ₹{plan.price} ({plan.duration})
                </option>
              ))}
            </select>

            <div>
              <p className="text-sm text-white font-medium mb-2">📍 Select Business Location on Map</p>
              <MapPicker
                selectedPosition={selectedPosition}
                onSelect={(lat, lng) => setSelectedPosition({ lat, lng })}
              />
              {selectedPosition && (
                <p className="text-xs mt-2 text-gray-200">
                  Selected Coordinates: {selectedPosition.lat.toFixed(4)}, {selectedPosition.lng.toFixed(4)}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 rounded-lg hover:opacity-90 transition-all"
            >
              🚀 Continue to Add Service
            </button>

            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          </form>
        </div>
      </div>
    );

};

export default BusinessOnlyOnboarding;
