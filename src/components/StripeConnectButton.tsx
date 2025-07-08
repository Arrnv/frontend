'use client';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function StripeConnectManual() {
  const [stripeId, setStripeId] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/businesses/me`, {
          withCredentials: true,
        });
        setIsConnected(!!res.data.stripe_account_id);
        setStripeId(res.data.stripe_account_id || '');
      } catch (err) {
        console.error('Failed to fetch business:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStatus();
  }, []);

  const handleSave = async () => {
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/stripe/manual-connect`, {
        stripe_account_id: stripeId,
      }, {
        withCredentials: true,
      });
      alert('Stripe account connected!');
      setIsConnected(true);
    } catch (err) {
      console.error('Stripe connection failed:', err);
      alert('Failed to connect Stripe account.');
    }
  };

  if (loading) return <p className="text-white">Loading...</p>;

  return (
    <div className="bg-white/10 border border-white/20 rounded-xl p-4  space-y-3">
      {isConnected ? (
        <p className="text-green-400 font-semibold">✅ Stripe Connected: {stripeId}</p>
      ) : (
        <>
          <label className="block text-sm text-white mb-1">Enter your Stripe Account ID (e.g. acct_123abc)</label>
          <input
            value={stripeId}
            onChange={(e) => setStripeId(e.target.value)}
            className="w-full p-2 rounded text-black"
            placeholder="acct_123abc"
          />
          <button
            onClick={handleSave}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded"
          >
            Connect Stripe
          </button>
        </>
      )}
    </div>
  );
}
