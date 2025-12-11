'use client';

import React, { useEffect, useState } from 'react';
import AuthForm from '@/components/AuthForm';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [user, setUser] = useState<{ email: string; fullName: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      // 1️⃣ Try cookie-based fetch first
      let res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
        credentials: 'include',
      });

      // 2️⃣ If cookie fails (Safari / strict browser), try Bearer token
      if (!res.ok) {
        const token = localStorage.getItem('token');
        if (token) {
          res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        }
      }

      if (!res.ok) return;

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.log('Not logged in', err);
    }
  };

  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl mb-4">Welcome back, {user.fullName}!</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <AuthForm
        mode="login"
        onSuccess={(user, token) => {
          if (token) localStorage.setItem('token', token);
          setUser(user);
          router.push('/'); // redirect to homepage after login
        }}
      />
    </div>
  );
};

export default LoginPage;
