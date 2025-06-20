'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';

export default function EditServicePage() {
  const { id } = useParams();
  const router = useRouter();
  const [form, setForm] = useState({
    name: '',
    location: '',
    contact: '',
    website: '',
    timings: '',
    status: '',
    tags: '',
    rating: ''
  });

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8000/businesses/service/${id}`, { withCredentials: true });
        setForm({
          name: data.name || '',
          location: data.location || '',
          contact: data.contact || '',
          website: data.website || '',
          timings: data.timings || '',
          status: data.status || '',
          tags: (data.tags || []).join(', '),
          rating: data.rating || ''
        });
      } catch (err) {
        console.error('Failed to fetch service:', err);
      }
    };

    if (id) fetchService();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.put(
        `http://localhost:8000/businesses/service/${id}`,
        {
          ...form,
          rating: parseFloat(form.rating),
          tags: form.tags.split(',').map(t => t.trim())
        },
        { withCredentials: true }
      );
      alert('Service updated!');
      router.push('/business/dashboard');
    } catch (err) {
      console.error('Update failed:', err);
      alert('Update failed.');
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-6">
      <h1 className="text-2xl font-bold mb-4">Edit Service</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {['name', 'location', 'contact', 'website', 'timings', 'status', 'tags', 'rating'].map((field) => (
          <div key={field}>
            <label className="block font-semibold capitalize">{field}</label>
            <input
              type="text"
              name={field}
              value={(form as any)[field]}
              onChange={handleChange}
              className="border px-3 py-2 w-full rounded"
              required={field !== 'tags'}
            />
          </div>
        ))}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Save Changes
        </button>
      </form>
    </div>
  );
}
