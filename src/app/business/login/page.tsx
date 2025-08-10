'use client';

import React, { useState, useEffect } from 'react';
import AuthForm from '@/components/AuthForm';
import { useRouter } from 'next/navigation';
import axios from 'axios';

const BusinessSignup = () => {
  const [user, setUser] = useState<{ email: string; fullName: string } | null>(null);
  const router = useRouter();

useEffect(() => {
  const checkUser = async () => {
    try {
      const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, { withCredentials: true });
      if (res.status === 200) {
        const user = res.data.user;
        setUser(user);

        if (user.role === 'business') {
          router.push('/business/dashboard');
        } else if (user.role === 'visitor') {
          router.push('/'); // redirect visitor to home page
        } else {
          // Optionally handle other roles, e.g. admin
          router.push('/'); // fallback
        }
      }
    } catch {
    }
  };
  checkUser();
}, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6  from-[#0E1C2F] ">
      {!user ? (
        <AuthForm
          mode="login"
          defaultRole="business"
          onSuccess={(user) => {
            setUser(user);
            router.push('/business/onboarding');
          }}
        />
      ) : (
        <div>
          <h1 className="text-xl">Already logged in</h1>
        </div>
      )}
    </div>
  );
};

export default BusinessSignup;
