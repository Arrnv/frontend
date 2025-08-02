'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import SearchBarServices from './SearchBarServices'; // adjust path as needed

const TopNav = () => {
  const router = useRouter();

  return (
    <header className="w-screen shadow-sm border-b border-gray-200 bg-white sticky top-0 z-50">
      <div className="p-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
          <img src="/logo.svg" alt="Logo" className="h-6" />
          <span className="font-bold text-xl text-[#0E1C2F]">
            DailEn<span className="text-[#246BFD]">Search</span>
          </span>
        </div>
      <div className="">
        <SearchBarServices />
      </div>
        {/* Navigation Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/business/signup"
            className="bg-gradient-to-r from-[#1F3B79] to-[#2E60C3] text-white font-medium px-4 py-2 rounded-xl hover:opacity-90 transition shadow-sm"
          >
            List Your Business
          </Link>
          <Link href="/login" className="text-sm font-semibold text-[#0E1C2F] hover:text-[#246BFD]">
            Log In
          </Link>
          <Link href="/signup" className="text-sm font-semibold text-[#246BFD] hover:underline">
            Sign Up
          </Link>
        </div>
      </div>

      
    </header>
  );
};

export default TopNav;
