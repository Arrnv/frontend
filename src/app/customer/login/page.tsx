'use client';

import React, { useEffect, useState } from 'react';
import AuthForm from '@/components/AuthForm';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [user, setUser] = useState<{ email: string; fullName: string } | null>(null);
  const router = useRouter();

  // ✅ MOVE THE FUNCTION ABOVE useEffect
  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setUser(null);
        return;
      }

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!res.ok) {
        setUser(null);
        return;
      }

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      setUser(null);
    }
  };

  // ✅ NOW useEffect calls it safely
  useEffect(() => {
    fetchUserProfile();
  }, []);

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
          if (token) localStorage.setItem("authToken", token);
          setUser(user);
          router.push('/');
        }}
      />
    </div>
  );
};

export default LoginPage;
