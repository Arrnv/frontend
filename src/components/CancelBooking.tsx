'use client';

import { useState } from 'react';
import axios from 'axios';

export default function CancelBooking({ bookingId }: { bookingId: string }) {
  const [reason, setReason] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleCancel = async () => {
    if (!reason.trim()) return alert('Please provide a reason');

    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/bookings/status/${bookingId}`, {
        status: 'cancelled',
        reason, // We'll add this on backend as a log or alert
      }, { withCredentials: true });

      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('Cancellation failed');
    }
  };

  return submitted ? (
    <p className="text-red-500">Booking cancelled</p>
  ) : (
    <div className="mt-2 space-y-2">
      <textarea
        placeholder="Reason for cancellation"
        className="w-full border rounded p-2"
        rows={2}
        value={reason}
        onChange={(e) => setReason(e.target.value)}
      />
      <button
        onClick={handleCancel}
        className="bg-red-500 text-white px-3 py-1 rounded"
      >
        Cancel Booking
      </button>
    </div>
  );
}
