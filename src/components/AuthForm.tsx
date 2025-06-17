// components/AuthForm.tsx
'use client';

import React, { useState } from 'react';

type Props = {
  mode: 'login' | 'signup';
  defaultRole?: 'visitor' | 'business'; // Add this
  onSuccess: (user: { email: string; fullName: string }) => void;
};

const AuthForm: React.FC<Props> = ({ mode, onSuccess, defaultRole = 'visitor' }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password || (mode === 'signup' && !fullName)) {
        throw new Error('All fields are required.');
      }

      const endpoint =
        mode === 'login'
          ? 'http://localhost:8000/api/auth/login'
          : 'http://localhost:8000/api/auth/signup';

      const payload =
        mode === 'signup'
          ? { email, password, fullName, role: defaultRole } // <- Role passed from prop
          : { email, password };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Authentication failed');
      }

      onSuccess(data.user);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full bg-white rounded shadow p-6">
      <h2 className="text-2xl font-semibold mb-4 text-center">
        {mode === 'login' ? 'Login' : 'Sign Up'}
      </h2>

      {error && <p className="text-red-600 mb-3 text-center">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {mode === 'signup' && (
          <input
            type="text"
            placeholder="Full Name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            className="w-full border p-2 rounded"
          />
        )}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {loading ? 'Please wait...' : mode === 'login' ? 'Login' : 'Sign Up'}
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
