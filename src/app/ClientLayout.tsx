'use client';

import React from 'react';
import { useRevealer } from '@/components/PageWrapper';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  useRevealer();

  return (
    <>
      <div className="fixed inset-0 z-100 bg-blue-700 origin-top scale-y-100 revealer w-screen" />
      {children}
    </>
  );
}
