'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const BusinessOnlyOnboarding = () => {
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    location: '',
    contact: '',
    website: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:8000/businesses/onboard', form, {
        withCredentials: true,
      });
      router.push('/services/add');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Business onboarding failed');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Onboard Business</h1>
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

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Continue to Add Service
        </button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </form>
    </div>
  );
};

export default BusinessOnlyOnboarding;
