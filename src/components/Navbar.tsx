'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ShoppingBag,
  Camera,
  Home,
  Briefcase,
  Settings,
} from 'lucide-react';



const Navbar = () => {
  const pathname = usePathname();
  const navItems = [
    {
      name: 'Services',
      href: '/customer/Services',
      icon: ShoppingBag,
    },
    {
      name: 'Traffic Cameras',
      href: '/customer/traffic-cameras',
      icon: Camera,
    },
    {
      name: 'Home',
      href: '/customer/Home',
      icon: Home,
    },
    {
      name: 'List Business',
      href: '/business/login',
      icon: Briefcase,
    },
    {
      name: 'Settings',
      href: '/customer/login',
      icon: Settings,
    },
  ];
  
  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex bg-gradient-to-r from-[#1e3a8a]/60 to-[#2563eb]/60 backdrop-blur-xl border border-white/20 shadow-xl rounded-full px-6 py-3 space-x-8">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                isActive ? 'bg-blue-500/70 text-white shadow-md' : 'text-blue-200 hover:text-white'
              }`}
            >
              <Icon size={20} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Navbar;