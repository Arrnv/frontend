'use client';

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
        const res = await axios.get('http://localhost:8000/plans');
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

      await axios.post('http://localhost:8000/businesses/onboard', payload, {
        withCredentials: true,
      });
      router.push('/business/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Business onboarding failed');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow space-y-4">
      <h1 className="text-2xl font-bold">Onboard Business</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Business Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="location"
          placeholder="Business Location"
          value={form.location}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="text"
          name="contact"
          placeholder="Contact"
          value={form.contact}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />
        <input
          type="url"
          name="website"
          placeholder="Website (optional)"
          value={form.website}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <select
          name="plan_id"
          value={form.plan_id}
          onChange={handleChange}
          className="w-full border p-2 rounded"
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
          <p className="text-sm font-medium mb-2">📍 Select Business Location on Map</p>
          <MapPicker
            selectedPosition={selectedPosition}
            onSelect={(lat, lng) => setSelectedPosition({ lat, lng })}
          />
          {selectedPosition && (
            <p className="text-xs mt-2 text-gray-600">
              Selected Coordinates: {selectedPosition.lat.toFixed(4)}, {selectedPosition.lng.toFixed(4)}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Continue to Add Service
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
};

export default BusinessOnlyOnboarding;
