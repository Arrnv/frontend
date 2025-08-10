'use client';
import React from 'react';

const SecuritySection = () => {
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Security Settings</h2>
      <p>Change your password or update security options.</p>
      {/* In future: Add password reset, 2FA toggles, etc. */}
      <button className="mt-3 bg-red-600 text-white px-4 py-2 rounded">
        Change Password
      </button>
    </div>
  );
};

export default SecuritySection;
