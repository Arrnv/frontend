'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import {
  FaHome,
  FaChartBar,
  FaUsers,
  FaStar,
  FaCog,
} from 'react-icons/fa';

const navLinks = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: FaHome },
  { label: 'Analytics', path: '/admin/analytics', icon: FaChartBar },
  { label: 'Users', path: '/admin/users', icon: FaUsers },
  { label: 'Reviews', path: '/admin/reviews', icon: FaStar },
  { label: 'Settings', path: '/admin/settings', icon: FaCog },
];

export default function AdminNavbar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50">
      <nav
        className="
          flex items-center gap-1
          bg-white
          border border-slate-200
          shadow-sm
          rounded-full
          px-2 py-2
        "
      >
        {navLinks.map(({ label, path, icon: Icon }) => {
          const active = pathname === path;

          return (
            <Link
              key={path}
              href={path}
              aria-label={label}
              className={`
                group
                flex items-center gap-2
                px-4 py-2
                rounded-full
                text-sm font-medium
                transition-all
                ${
                  active
                    ? 'bg-[#52C4FF]/10 text-[#52C4FF]'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }
              `}
            >
              <Icon
                size={14}
                className={`
                  transition
                  ${
                    active
                      ? 'text-[#52C4FF]'
                      : 'text-slate-400 group-hover:text-slate-600'
                  }
                `}
              />
              <span className="hidden sm:inline">
                {label}
              </span>
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
