'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  email: string;
  fullName: string;
  role: string;
};

type Props = {
  mode: 'login' | 'signup';
  defaultRole?: 'visitor' | 'business';
  onSuccess: (user: User, token?: string) => void; // ✅ add optional token
};


const AuthForm: React.FC<Props> = ({ mode, onSuccess, defaultRole }) => {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const role = defaultRole || 'visitor';

  // Pass 'intent' param to Google OAuth: signup or login
  const googleAuthUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google?role=${role}&intent=${mode}`;

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
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`;

      const payload =
        mode === 'signup'
          ? { email, password, fullName, role: defaultRole } 
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

      // Pass full user data including role to onSuccess
// Pass user + token to parent
    onSuccess(data.user, data.token);

    // Save Bearer fallback for Safari
    if (data.token) {
      localStorage.setItem("token", data.token);
    }

      // Redirect based on role and mode here (optional if not handled elsewhere)
      if (data.user.role === 'business') {
        if (mode === 'signup') {
          router.push('/business/onboarding');
        } else {
          router.push('/business/dashboard');
        }
      } else if (data.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }

    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md w-full rounded shadow p-6 text-black">
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

        <div className="my-4 flex items-center justify-center">
          <span className="text-gray-500">or</span>
        </div>

        <button
          type="button"
          onClick={() => {
            window.location.href = googleAuthUrl;
          }}
          className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600 transition flex items-center justify-center gap-2"
        >
          {/* Google logo SVG */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.63 1.22 9.11 3.6l6.79-6.79C35.6 2.42 30.2 0 24 0 14.62 0 6.51 5.3 2.47 13l7.89 6.13C12.27 13.25 17.73 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.1 24.5c0-1.63-.15-3.2-.43-4.71H24v9.05h12.45c-.54 2.9-2.17 5.37-4.63 7.05l7.14 5.54C43.82 37.05 46.1 31.18 46.1 24.5z"/>
            <path fill="#FBBC05" d="M10.36 28.12a14.48 14.48 0 0 1-.76-4.62c0-1.6.28-3.14.76-4.62l-7.89-6.13A23.97 23.97 0 0 0 0 24c0 3.84.92 7.46 2.47 10.75l7.89-6.13z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.9-2.13 15.87-5.79l-7.14-5.54c-2 1.35-4.58 2.16-8.73 2.16-6.27 0-11.73-3.75-14.64-9.12l-7.89 6.13C6.51 42.7 14.62 48 24 48z"/>
          </svg>
          Continue with Google
        </button>
      </form>
    </div>
  );
};

export default AuthForm;
