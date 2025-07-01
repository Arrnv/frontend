'use client';

import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { FaMagic } from 'react-icons/fa';

interface GlassCardProps {
  title: string;
  description: string;
}

export default function GlassCard({ title, description }: GlassCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const card = cardRef.current;
    if (!wrapper || !card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = wrapper.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = -(y - centerY) / 15;
      const rotateY = (x - centerX) / 15;

      gsap.to(card, {
        rotateX,
        rotateY,
        scale: 1.05,
        transformPerspective: 1000,
        ease: 'power2.out',
        duration: 0.3,
      });
    };

    const resetTilt = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        ease: 'power2.inOut',
        duration: 0.4,
      });
    };

    wrapper.addEventListener('mousemove', handleMouseMove);
    wrapper.addEventListener('mouseleave', resetTilt);

    return () => {
      wrapper.removeEventListener('mousemove', handleMouseMove);
      wrapper.removeEventListener('mouseleave', resetTilt);
    };
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative group p-[2px] rounded-2xl bg-gradient-to-br from-[#1F3B79] to-[#2E60C3] hover:shadow-xl"
      style={{ perspective: 1000 }}
    >
      <div
        ref={cardRef}
        className="rounded-2xl bg-white/10 backdrop-blur-lg border border-[#2E60C3]/40 p-6 text-white transition-all duration-300 transform-style-preserve-3d"
        style={{ transformStyle: 'preserve-3d' }}
      >
        <div className="mb-3 text-3xl text-[#C44EFF]">
          <FaMagic />
        </div>
        <h1 className="text-2xl font-bold mb-2 group-hover:translate-y-[-2px] group-hover:scale-105 transition-transform duration-300">
          {title}
        </h1>
        <p className="text-sm text-[#8B9AB2]">{description}</p>
      </div>
    </div>
  );
}
