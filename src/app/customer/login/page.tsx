'use client';

import React, { useEffect, useState } from 'react';
import AuthForm from '@/components/AuthForm';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  // -------------------------
  // FETCH USER PROFILE
  // -------------------------
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

      // Backend returns: full_name → convert to fullName
      setUser({
        ...data.user,
        fullName: data.user.full_name,
      });

    } catch (err) {
      console.log("Not logged in", err);
      setUser(null);
    }
  };

  // -------------------------
  // RUN ON PAGE LOAD
  // -------------------------
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // -------------------------
  // IF ALREADY LOGGED IN
  // -------------------------
  if (user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <h1 className="text-2xl mb-4">Welcome back, {user.fullName}!</h1>
      </div>
    );
  }

  // -------------------------
  // SHOW LOGIN FORM
  // -------------------------
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <AuthForm
        mode="login"
        onSuccess={(user, token) => {
          if (token) localStorage.setItem("authToken", token);

          // normalize naming
          setUser({
            ...user,
            fullName: user.fullName ?? user.fullName,
          });

          router.push('/');
        }}
      />
    </div>
  );
};

export default LoginPage;
