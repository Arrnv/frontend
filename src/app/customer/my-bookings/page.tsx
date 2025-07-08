'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import gsap from 'gsap';

type Booking = {
  id: string;
  option_title: string;
  price: number;
  status: string;
  created_at: string;
  details?: {
    name: string;
  };
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${process.env.NEXT_PUBLIC_API_URL}/customer/my-bookings`, { withCredentials: true })
      .then(res => setBookings(res.data))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-center p-4">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((b) => (
            <li key={b.id} className="border rounded p-4">
                <p className="font-semibold">Service: {b.details?.name}</p>
                <p>Status: <span className="capitalize">{b.status}</span></p>
                <p>Date: {new Date(b.created_at).toLocaleString()}</p>
                <p>Price: ₹{b.price}</p>

                {(b.status === 'completed' || b.status === 'cancelled') && (
                <div className="mt-2">
                    <a
                    href={`/customer/Service/${b.id}`}
                    className="text-blue-600 underline hover:text-blue-800"
                    >
                    Leave Feedback
                    </a>
                </div>
                )}
            </li>
            ))}
        </ul>
      )}
    </div>
  );
}
