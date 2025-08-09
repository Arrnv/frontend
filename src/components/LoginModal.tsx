'use client';

import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import AuthForm from '@/components/AuthForm';
import { useRouter } from 'next/navigation';

type User = {
  email: string;
  fullName: string;
};

const AuthModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) {
      fetchUserProfile();
    }
  }, [isOpen]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/google`; // backend handles both login/signup
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
          {loading ? (
            <p className="text-center text-gray-500">Checking login status...</p>
          ) : user ? (
            <div className="text-center">
              <h2 className="text-xl font-semibold mb-2">Already logged in</h2>
              <p className="text-gray-600">Welcome back, {user.fullName}!</p>
              <button
                onClick={onClose}
                className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
              >
                Close
              </button>
            </div>
          ) : (
            <>
              <Dialog.Title className="text-xl text-black font-bold mb-4 text-center">
                Welcome to Trucker Guide!
              </Dialog.Title>

              {/* Tabs */}
              <div className="flex text-black justify-center mb-6 border-b">
                <button
                  className={`px-4 py-2 ${tab === 'login' ? 'border-b-2 border-blue-500' : ''}`}
                  onClick={() => setTab('login')}
                >
                  Log In
                </button>
                <button
                  className={`px-4 py-2 ${tab === 'signup' ? 'border-b-2 border-blue-500' : ''}`}
                  onClick={() => setTab('signup')}
                >
                  Sign Up
                </button>
              </div>

              {/* Auth form */}
              <AuthForm
                mode={tab}
                defaultRole="visitor"
                onSuccess={(user) => {
                  setUser(user);
                  onClose();
                  router.refresh();
                }}
              />

              {/* Or divider */}
              <div className="flex items-center my-4">
                <div className="flex-grow h-px bg-gray-300" />
                <span className="mx-3 text-gray-500">or</span>
                <div className="flex-grow h-px bg-gray-300" />
              </div>

            </>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AuthModal;
