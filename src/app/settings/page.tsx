'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProfileSection from '@/components/ProfileSection';
import BusinessSettings from '@/components/BusinessSettings';
import AdminAnalyticsSettings from '@/components/AdminAnalyticsSettings';
import SecuritySection from '@/components/SecuritySection';
import SupportSection from '@/components/SupportSection';

type Role = 'visitor' | 'business_owner' | 'admin';

type UserProfile = {
  id: string;
  full_name: string;
  email: string;
  role: Role;
};

const SettingsPage = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('https://phpstack-1383739-5654472.cloudwaysapps.com/api/auth/profile', {
          withCredentials: true,
        });
        setProfile(res.data.user);
      } catch (err) {
        console.error('Failed to fetch profile', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <p className="p-6">Loading...</p>;
  if (!profile) return <p className="p-6">You must be logged in to view settings.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <h1 className="text-2xl font-bold">Settings</h1>

      <ProfileSection profile={profile} />

      {profile.role === 'business_owner' && <BusinessSettings userId={profile.id} />}
      {profile.role === 'admin' && <AdminAnalyticsSettings />}

      <SecuritySection />
      <SupportSection />
    </div>
  );
};

export default SettingsPage;
