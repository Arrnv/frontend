'use client';

import React, { useState, useEffect } from 'react';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ email: string; fullName: string } | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserProfile(token);
    }
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const res = await fetch('http://localhost:8000/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        localStorage.removeItem('token');
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!email || !password || (!isLogin && !fullName)) {
        throw new Error('All fields are required.');
      }

      const endpoint = isLogin ? 'http://localhost:8000/api/auth/login' : 'http://localhost:8000/api/auth/signup';

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, ...(isLogin ? {} : { fullName }) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to authenticate');
      }

      localStorage.setItem('token', data.token);
      setUser(data.user);

      setEmail('');
      setPassword('');
      setFullName('');
      setError('');

    } catch (err: any) {
      setError(err.message || 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  if (user) {
    // Logged-in view
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl mb-4">Welcome, {user.fullName}!</h1>
        <button
          onClick={handleLogout}
          className="bg-red-600 text-white py-2 px-6 rounded hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>
    );
  }

  // Login/Signup form view
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded shadow p-6">
        <h2 className="text-2xl font-semibold mb-4 text-center">
          {isLogin ? 'Login' : 'Sign Up'}
        </h2>

        {error && <p className="text-red-600 mb-3 text-center">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
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
            {loading ? 'Please wait...' : isLogin ? 'Login' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-4 text-center">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
            }}
            className="text-blue-600 hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;
