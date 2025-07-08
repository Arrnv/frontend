'use client';

import { useState } from 'react';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';

export default function FeedbackForm() {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [success, setSuccess] = useState(false);
  const params = useParams();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
            await axios.post(
            `${process.env.NEXT_PUBLIC_API_URL}/customer/booking-feedback`,
            {
                booking_id: params.id,
                rating,
                comment,
            },
            {
                withCredentials: true,
            }
            );


      setSuccess(true);
      setComment('');
      setTimeout(() => router.push('/customer/my-bookings'), 2000);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-2">Leave Feedback</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Rating</label>
          <select
            className="border p-2 rounded"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}>
            {[1, 2, 3, 4, 5].map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Comment</label>
          <textarea
            className="border p-2 w-full rounded"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          ></textarea>
        </div>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Submit</button>
        {success && <p className="text-green-500 mt-2">Thank you for your feedback! Redirecting...</p>}
      </form>
    </div>
  );
}
