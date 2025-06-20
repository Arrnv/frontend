'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="text-xl font-bold text-gray-800">MyApp</div>

          {/* Desktop links */}
          <div className="hidden md:flex space-x-6 items-center">
            <Link href="/customer/Services" className="text-gray-700 hover:text-blue-600">Services</Link>
            <Link href="/customer/traffic-cameras" className="text-gray-700 hover:text-blue-600">Traffic Cameras</Link>
            <Link href="/business/login" className="block text-gray-700 hover:text-blue-600">List Your Business</Link>
            <Link href="/customer/login" className="text-gray-700 hover:text-blue-600">Login</Link>
            <Link href="/customer/Signup" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Sign Up</Link>
          </div>

          {/* Mobile menu toggle */}
          <div className="md:hidden">
            <button onClick={() => setIsOpen(!isOpen)} className="text-gray-700">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-md px-4 pt-4 pb-6 space-y-3">
          <Link href="/customer/Services" className="block text-gray-700 hover:text-blue-600">Services</Link>
          <Link href="/customer/traffic-cameras" className="block text-gray-700 hover:text-blue-600">Traffic Cameras</Link>
          <Link href="/business/login" className="block text-gray-700 hover:text-blue-600">List Your Business</Link>
          <Link href="/customer/login" className="block text-gray-700 hover:text-blue-600">Login</Link>
          <Link href="/customer/Signup" className="block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-center">Sign Up</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
