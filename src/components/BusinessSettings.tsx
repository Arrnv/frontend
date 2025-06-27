'use client';
import React from 'react';

type Props = {
  userId: string;
};

const BusinessSettings = ({ userId }: Props) => {
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Business Settings</h2>
      <p>
        Manage your business listings, see approval status, and track analytics.
      </p>
      <p className="text-sm text-gray-600">Your User ID: {userId}</p>
      {/* You can later add buttons or links to business dashboards */}
    </div>
  );
};

export default BusinessSettings;
