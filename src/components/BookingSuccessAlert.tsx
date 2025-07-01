'use client';
import gsap from 'gsap';
import { useEffect, useRef } from 'react';

export default function BookingSuccessAlert({ show }: { show: boolean }) {
  const alertRef = useRef(null);

  useEffect(() => {
    if (show) {
      gsap.fromTo(alertRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7 });
    }
  }, [show]);

  if (!show) return null;

  return (
    <div ref={alertRef} className="fixed top-5 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded shadow-xl z-50">
      Booking Confirmed!
    </div>
  );
}