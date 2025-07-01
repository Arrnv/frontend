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
        const res = await axios.get('https://phpstack-1383739-5654472.cloudwaysapps.com/api/auth/profile', { withCredentials: true });
        if (res.status === 200) {
          setUser(res.data.user);
          router.push('/business/dashboard');
        }
      } catch {}
    };
    checkUser();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      {!user ? (
        <AuthForm
          mode="signup"
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
