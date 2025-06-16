'use client';

import React, { useEffect, useState } from 'react';
import AuthForm from '@/components/AuthForm';
import { useRouter } from 'next/navigation';

const SignupPage = () => {
  const [user, setUser] = useState<{ email: string; fullName: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchUserProfile(token);
  }, []);

  const fetchUserProfile = async (token: string) => {
    try {
      const res = await fetch('http://localhost:8000/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) return;
      const data = await res.json();
      setUser(data.user);
    } catch {}
  };

  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl mb-4">Welcome, {user.fullName}!</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <AuthForm
        mode="signup"
        onSuccess={(user) => {
          setUser(user);
          router.push('/'); 
        }}
      />
    </div>
  );
};

export default SignupPage;
