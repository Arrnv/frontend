'use client';
import React from 'react';

const SupportSection = () => {
  return (
    <div className="border p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Support</h2>
      <p>Need help? Reach out to our support team.</p>
      <ul className="list-disc list-inside text-sm text-gray-700 mt-2">
        <li>Email: support@example.com</li>
        <li>FAQs: <a href="/faq" className="text-blue-600 underline">Visit FAQ</a></li>
      </ul>
    </div>
  );
};

export default SupportSection;
