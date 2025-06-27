'use client';
import React from 'react';

type Props = {
  profile: {
    full_name: string;
    email: string;
    role: string;
  };
};

const ProfileSection = ({ profile }: Props) => (
  <div className="border p-4 rounded shadow">
    <h2 className="text-xl font-semibold mb-2">Profile Info</h2>
    <p><strong>Name:</strong> {profile.full_name}</p>
    <p><strong>Email:</strong> {profile.email}</p>
    <p><strong>Role:</strong> {profile.role}</p>
  </div>
);

export default ProfileSection;
