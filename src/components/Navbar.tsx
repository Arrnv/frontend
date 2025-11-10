'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import SearchBarServices from './SearchBarServices';

const TopNav = () => {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="w-screen shadow-sm border-b border-gray-200 bg-white sticky top-0 z-50 p-5">
      <div className="px-4 flex items-center justify-between h-14 md:h-16">
        {/* Logo */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => router.push('/')}
        >
          <img src="/logo_v2.jpeg" alt="Logo" className="h-6" />
          <span className="font-bold text-xl text-[#0E1C2F]">
            Path<span className="text-[#246BFD]">Sure</span>
          </span>
        </div>

        {/* Search bar - hidden on mobile if you want */}
        <div className="hidden sm:block flex-1 max-w-md mx-4">
          <SearchBarServices />
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            href="/business/signup"
            className="bg-gradient-to-r from-[#1F3B79] to-[#2E60C3] text-white font-medium px-4 py-2 rounded-xl hover:opacity-90 transition shadow-sm"
          >
            List Your Business
          </Link>
          <Link
            href="/customer/login"
            className="text-sm font-semibold text-[#0E1C2F] hover:text-[#246BFD]"
          >
            Log In
          </Link>
          <Link
            href="/customer/Signup"
            className="text-sm font-semibold text-[#246BFD] hover:underline"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded hover:bg-gray-100"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-md border-t border-gray-200">
          <div className="p-4 border-b border-gray-100">
            {/* Mobile search bar */}
            <SearchBarServices />
          </div>
          <nav className="flex flex-col p-4 space-y-3">
            <Link
              href="/business/signup"
              className="bg-gradient-to-r from-[#1F3B79] to-[#2E60C3] text-white font-medium px-4 py-2 rounded-xl hover:opacity-90 transition text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              List Your Business
            </Link>
            <Link
              href="/customer/login"
              className="text-sm font-semibold text-[#0E1C2F] hover:text-[#246BFD] text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Log In
            </Link>
            <Link
              href="/customer/Signup"
              className="text-sm font-semibold text-[#246BFD] hover:underline text-center"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Sign Up
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default TopNav;
