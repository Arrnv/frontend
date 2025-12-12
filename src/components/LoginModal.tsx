'use client';

import React, { useEffect, useState } from 'react';
import { Dialog } from '@headlessui/react';
import AuthForm from '@/components/AuthForm';
import { useRouter } from 'next/navigation';

type User = {
  email: string;
  fullName: string;
};
type Props = {
  isOpen: boolean;
  onClose: () => void;
  setUser: (user: User | null) => void;
};


const AuthModal: React.FC<Props> = ({ isOpen, onClose, setUser }) => {
  const [tab, setTab] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (isOpen) fetchUserProfile();
  }, [isOpen]);

  const fetchUserProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user); // update parent state
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/40" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-lg rounded-lg bg-white p-6 shadow-lg">
          {loading ? (
            <p className="text-center text-gray-500">Checking login status...</p>
          ) : (
            <>
              <Dialog.Title className="text-xl text-black font-bold mb-4 text-center">
                Welcome to PathSure!
              </Dialog.Title>

              <div className="flex justify-center mb-6 border-b">
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

              <AuthForm
                mode={tab}
                defaultRole="visitor"
                onSuccess={(user) => {
                  setUser(user);  // correctly updates ServiceNav's currentUser
                  onClose();
                  router.refresh();
                }}

              />
            </>
          )}
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default AuthModal;
