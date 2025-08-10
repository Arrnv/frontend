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
        const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/businesses/service/${id}`, { withCredentials: true });
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
        `${process.env.NEXT_PUBLIC_API_URL}/businesses/service/${id}`,
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
        } else if (user.role === 'visitor') {
          router.push('/'); // redirect visitor to home page
        } else {
          // Optionally handle other roles, e.g. admin
          router.push('/'); // fallback
        }
      }
    } catch {
      // On error you might want to do nothing or redirect to login
    }
  };
  checkUser();
}, [router]);

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded mt-6 bg-gradient-to-br from-[#0E1C2F] via-[#1F3B79] to-[#415CBB]">
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
