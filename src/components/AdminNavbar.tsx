'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const navLinks = [
  { label: 'Dashboard', path: '/admin/dashboard' },
  { label: 'Analytics', path: '/admin/analytics' },
  { label: 'Users', path: '/admin/users' },
  { label: 'Reviews', path: '/admin/reviews' },
  { label: 'Settings', path: '/settings' },
];

const AdminNavbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [active, setActive] = useState(pathname);

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      router.push('/admin/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="bg-white shadow p-4 border-b flex justify-between items-center sticky top-0 z-50">
      <div className="flex items-center gap-6">
        <h1 className="font-bold text-lg">Admin Panel</h1>
        {navLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            className={`text-sm ${
              active === link.path
                ? 'text-blue-600 font-semibold'
                : 'text-gray-700 hover:text-blue-500'
            }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
      <button
        onClick={handleLogout}
        className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </nav>
  );
};

export default AdminNavbar;
