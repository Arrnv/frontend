'use client';

import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:8000/api/auth/logout', {}, { withCredentials: true });
      router.push('/business/login');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
    >
      Logout
    </button>
  );
}
