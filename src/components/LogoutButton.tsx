'use client';

import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      // 1️⃣ Remove JWT-based auth (THIS IS THE REAL LOGOUT)
      localStorage.removeItem('authToken');
      localStorage.removeItem('userEmail');

      // 2️⃣ Optional: clear cookie-based auth (Chrome support)
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );

    } catch (err) {
      console.warn('Backend logout failed (safe to ignore)', err);
    } finally {
      // 3️⃣ Redirect
      router.replace('/business/login');
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
    >
      Logout
    </button>
  );
}
