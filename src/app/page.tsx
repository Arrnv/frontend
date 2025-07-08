'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';


export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/customer/Home');
  }, [router]);

  return null;
}
