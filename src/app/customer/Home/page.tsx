'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import Navbar from '@/components/Navbar';
import GlassCard from '@/components/GlassCard';
import ClientLayout from '@/app/ClientLayout';
import { gsap } from 'gsap';

const faqs = [
  {
    question: "What services does TruckNav offer?",
    answer: "TruckNav provides truck drivers and fleet managers access to over 450,000 verified service points across the USA.",
  },
  {
    question: "Is TruckNav free to use?",
    answer: "Yes, TruckNav offers free access to basic features, with optional premium plans for advanced functionality.",
  },
  {
    question: "Can I access TruckNav on mobile?",
    answer: "Absolutely! TruckNav is mobile-friendly and optimized for all devices.",
  },
];

const Page = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    gsap.from(".glass-card", {
      opacity: 0,
      y: 50,
      stagger: 0.2,
      duration: 1.2,
      ease: "power3.out",
    });
  }, []);

  return (
    <ClientLayout>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-[#0E1C2F] via-[#1F3B79] to-[#415CBB] py-12 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          {/* Hero Section */}
          <section className="glass-card rounded-3xl bg-white/5 border border-[#2E60C3] backdrop-blur-lg p-10 mb-16 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover Services That <span className="text-[#48AFFF]">Drive</span> You
            </h1>
            <p className="text-[#8B9AB2] text-lg max-w-3xl mx-auto">
              Over 450,000 verified truck service points to enhance routing and safety for truckers nationwide.
            </p>
          </section>

          {/* Feature Glass Cards Section */}
          <section className="glass-card grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <GlassCard
              title="Truck-Friendly Routing"
              description="Avoid low bridges and tight roads with navigation tailored to truck dimensions."
            />
            <GlassCard
              title="Live Camera Feeds"
              description="Stay informed with live road conditions through real-time camera snapshots."
            />
            <GlassCard
              title="Service Point Finder"
              description="Discover rest stops, mechanics, and services optimized for truck fleets."
            />
          </section>

          {/* FAQ Section */}
          <section className="glass-card rounded-3xl bg-white/5 border border-[#48AFFF] backdrop-blur-lg p-10 mb-16">
            <h2 className="text-3xl font-bold mb-6">
              Got Questions? <span className="text-[#e95800]">We Got Answers</span>
            </h2>
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-gray-600 py-4">
                <button
                  onClick={() => toggleFAQ(index)}
                  className="w-full text-left flex justify-between items-center"
                >
                  <span>{faq.question}</span>
                  <svg
                    className={`w-5 h-5 transition-transform duration-200 ${
                      openIndex === index ? 'rotate-180' : 'rotate-0'
                    }`}
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {openIndex === index && (
                  <p className="mt-2 text-sm text-gray-400">{faq.answer}</p>
                )}
              </div>
            ))}
          </section>

          {/* CTA Button */}
          <div className="text-center">
            <button className="bg-[#e95800] text-white px-6 py-3 rounded-lg shadow-md hover:brightness-110 transition-all">
              Explore TruckNav
            </button>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default Page;
