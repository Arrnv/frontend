'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaShoppingBag, FaChartBar, FaHome, FaBriefcase, FaCog } from 'react-icons/fa';

const navLinks = [
  { label: 'Dashboard', path: '/admin/dashboard', icon:FaHome  },
  { label: 'Analytics', path: '/admin/analytics', icon: FaChartBar },
  { label: 'Users', path: '/admin/users', icon: FaShoppingBag },
  { label: 'Reviews', path: '/admin/reviews', icon: FaBriefcase },
  { label: 'Settings', path: '/settings', icon: FaCog },
];

const AdminNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) return null; // Prevent mismatch during SSR

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex bg-gradient-to-r from-[#1e3a8a]/60 to-[#2563eb]/60 backdrop-blur-xl border border-white/20 shadow-xl rounded-full px-6 py-3 space-x-8">
        {navLinks.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;

          return (
            <Link
              key={item.label}
              href={item.path}
              className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 ${
                isActive ? 'bg-blue-500/70 text-white shadow-md' : 'text-blue-200 hover:text-white'
              }`}
              title={item.label}
            >
              <Icon size={20} />
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default AdminNavbar;
