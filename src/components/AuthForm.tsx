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
  onSuccess: (user: User, token?: string) => void;
};

const AuthForm: React.FC<Props> = ({ mode, onSuccess, defaultRole }) => {
  const router = useRouter();
  const role = defaultRole || 'visitor';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const googleAuthUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google?role=${role}&intent=${mode}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password || (mode === 'signup' && !fullName)) {
        throw new Error('Please fill all required fields.');
      }

      const endpoint =
        mode === 'login'
          ? `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`
          : `${process.env.NEXT_PUBLIC_API_URL}/api/auth/signup`;

      const payload =
        mode === 'signup'
          ? { email, password, fullName, role }
          : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Authentication failed');

      onSuccess(data.user, data.token);

      if (data.token) {
        localStorage.setItem('authToken', data.token);
      }

      if (data.user.role === 'business') {
        router.push(mode === 'signup' ? '/business/onboarding' : '/business/dashboard');
      } else if (data.user.role === 'admin') {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md rounded-2xl bg-white ring-1 ring-black/5 shadow-sm p-8">
      {/* Header */}
      <h2 className="text-2xl font-semibold text-slate-900 text-center">
        {mode === 'login' ? 'Welcome back' : 'Create your account'}
      </h2>
      <p className="text-sm text-slate-500 text-center mt-1 mb-6">
        {mode === 'login'
          ? 'Sign in to continue'
          : 'Get started in just a few steps'}
      </p>

      {error && (
        <div className="mb-4 rounded-lg bg-red-50 text-red-700 text-sm px-4 py-2 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Full Name */}
        {mode === 'signup' && (
          <FloatingInput
            label="Full name"
            value={fullName}
            onChange={setFullName}
            type="text"
          />
        )}

        {/* Email */}
        <FloatingInput
          label="Email address"
          value={email}
          onChange={setEmail}
          type="email"
        />

        {/* Password */}
        <FloatingInput
          label="Password"
          value={password}
          onChange={setPassword}
          type="password"
        />

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="
            w-full py-3 rounded-xl
            bg-[#0099E8] text-white font-medium
            hover:bg-[#007FCC]
            transition
            disabled:opacity-60
          "
        >
          {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-slate-200" />
          <span className="text-xs text-slate-400 uppercase tracking-wide">
            or continue with
          </span>
          <div className="flex-1 h-px bg-slate-200" />
        </div>

        {/* Google */}
        <button
          type="button"
          onClick={() => (window.location.href = googleAuthUrl)}
          className="
            w-full py-3 rounded-xl
            bg-white
            ring-1 ring-black/10
            hover:ring-[#0099E8]/40
            transition
            flex items-center justify-center gap-3
            text-slate-700 font-medium
          "
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            className="w-5 h-5"
            alt="Google"
          />
          Continue with Google
        </button>
      </form>
    </div>
  );
};

export default AuthForm;



type FloatingInputProps = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
};

const FloatingInput = ({
  label,
  value,
  onChange,
  type = 'text',
}: FloatingInputProps) => {
  return (
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder=" "
        required
        className="
          peer
          w-full px-4 py-3
          rounded-xl
          bg-slate-50
          ring-1 ring-black/5
          focus:ring-2 focus:ring-[#0099E8]
          focus:outline-none
          text-slate-900
        "
      />
      <label
        className="
          absolute left-4 top-1/2 -translate-y-1/2
          text-slate-400 text-sm
          pointer-events-none
          transition-all
          peer-placeholder-shown:top-1/2
          peer-placeholder-shown:text-sm
          peer-focus:top-2
          peer-focus:text-xs
          peer-focus:text-[#0099E8]
          peer-not-placeholder-shown:top-2
          peer-not-placeholder-shown:text-xs
        "
      >
        {label}
      </label>
    </div>
  );
};
