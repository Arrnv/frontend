'use client';

import { useState, useEffect } from 'react';
import React from 'react';
import ClientLayout from '@/app/ClientLayout';
import { gsap } from 'gsap';
import ServiceNav from '@/components/ServiceNav';
import SearchBarServices from '@/components/SearchBarServices';
import SearchBarPlaces from '@/components/SearchBarPlaces';

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
      <ServiceNav selectedCategory={null} onSelect={function (section: 'services' | 'places', subcategoryId: string): void {
        throw new Error('Function not implemented.');
      } } />
      <div className="min-h-screen  py-12 px-6 text-white">
        <div className="max-w-7xl mx-auto">
          
        <section className="relative bg-gradient-to-br from-[#0E1C2F] via-[#1F3B79] to-[#415CBB] border border-[#2E60C3] backdrop-blur-lg rounded-3xl overflow-hidden mb-16">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-12 py-12 md:py-20 gap-10">
            
            <div className="w-full md:w-1/2 text-center md:text-left">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                <span className="text-[#FF6B00]">FIND</span>{' '}
                <span className="text-white">SERVICES FOR TRUCK DRIVERS & FLEETS</span>
              </h1>
              <p className="text-[#8B9AB2] text-lg md:text-xl max-w-xl mx-auto md:mx-0">
                Become a part of an innovative and feature-rich service with over 450K points of interest for truckers nationwide.
              </p>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="w-full max-w-[600px] aspect-[3/2] md:aspect-auto relative rounded-xl overflow-hidden">
                <img
                  src="/main-img.webp"
                  alt="Truck Services Dashboard"
                  className="w-full h-full object-contain md:object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        <div className="flex flex-row bg-gradient-to-r from-[#1F3B79] to-[#2E60C3] p-[3rem] rounded-3xl justify-center gap-6 m-8">
          <div className='flex flex-col items-center gap-6 '>
              <h1 className="text-2xl font-bold">Search Services</h1>
              <SearchBarServices />
          </div>
          <div className='flex flex-col items-center gap-6 '>
              <h1 className="text-2xl font-bold">Search Places</h1>
              <SearchBarPlaces />
          </div>
        </div>
        
        <section className="relative bg-gradient-to-br from-[#0E1C2F] via-[#1F3B79] to-[#415CBB] border border-[#2E60C3] backdrop-blur-lg rounded-3xl px-6 py-12 md:px-12 md:py-20 mb-20 overflow-hidden">
          <div className="flex flex-col-reverse lg:flex-row items-center justify-between gap-10">

            <div className="w-full lg:w-1/2 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-semibold mb-6">
                IMPROVE <span className="text-[#FF6B00] font-bold">ROUTING</span> . ENSURE <span className="text-[#FF6B00] font-bold">SAFETY</span>
              </h2>

              <div className="w-full max-w-4xl mx-auto text-center mb-8">
                <div className="relative w-full flex justify-center">
                  <img
                    src="/cameras-icons.webp"
                    alt="Icon sprite"
                    className="w-full max-w-lg object-contain"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2 mt-4 text-sm sm:text-base font-medium text-white">
                  <div className="text-center">
                    Low<br />Clearances
                  </div>
                  <div className="text-center">
                    Streaming<br />Cameras
                  </div>
                  <div className="text-center">
                    Live<br />Snapshots
                  </div>
                </div>
              </div>


              <p className="text-[#8B9AB2] text-md max-w-xl mx-auto lg:mx-0">
                Optimize your route planning to avoid unsafe routes, low clearances, and challenging driving conditions.
              </p>
            </div>
            <div className="w-full lg:w-1/2 flex justify-center">
              <img
                src="/cameras-img.webp"
                alt="Live Camera and Route Preview"
                className="w-full max-w-[600px] h-auto object-contain"
              />
            </div>
          </div>
        </section>

        <section className="relative bg-gradient-to-br from-[#0E1C2F] via-[#1F3B79] to-[#415CBB] border border-[#2E60C3] backdrop-blur-lg rounded-3xl overflow-hidden mb-16">
          <div className="flex flex-col-reverse md:flex-row items-center justify-between px-6 md:px-12 py-12 md:py-20 gap-10">
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="w-full max-w-[600px] aspect-[3/2] md:aspect-auto relative rounded-xl overflow-hidden">
                <img
                  src="/landing-img3.webp"
                  alt="Truck Navigation"
                  className="w-full h-full object-contain md:object-cover"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 text-center md:text-left">
              <p className="text-[#F15A24] font-semibold text-sm uppercase tracking-wide mb-2">
                Solutions for Drivers
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6">
                Truck Navigation
              </h2>
              <p className="text-[#8B9AB2] text-lg md:text-xl max-w-xl mx-auto md:mx-0 mb-6">
                Our truck-friendly navigation system offers precise directions, avoiding low bridges, weight limits, and no-truck areas, customized for your truck and trailer dimensions.
              </p>
              <button className="bg-[#F15A24] hover:bg-[#d8491a] text-white font-semibold py-3 px-6 rounded-md transition">
                Learn More
              </button>
            </div>

          </div>
        </section>
        <section className="relative bg-gradient-to-br from-[#0E1C2F] via-[#1F3B79] to-[#415CBB] border border-[#2E60C3] backdrop-blur-lg rounded-3xl overflow-hidden mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-12 md:py-20 gap-10">
            <div className="w-full md:w-1/2 text-center md:text-left">
              <p className="text-[#F15A24] font-semibold text-sm uppercase tracking-wide mb-2">
                Solutions for Vendors
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6">
                Business Listing
              </h2>
              <p className="text-[#8B9AB2] text-lg md:text-xl max-w-xl mx-auto md:mx-0 mb-6">
                Keep truck drivers in the loop with the latest business updates and boost your visibility through eye-catching banners and engaging promotional videos.
              </p>
              <button className="bg-[#F15A24] hover:bg-[#d8491a] text-white font-semibold py-3 px-6 rounded-md transition">
                Learn More
              </button>
            </div>
            <div className="w-full md:w-1/2 flex justify-center">
              <div className="w-full max-w-[600px] aspect-[3/2] md:aspect-auto relative rounded-xl overflow-hidden">
                <img
                  src="/landing-img2.webp" // make sure this is your actual filename
                  alt="Business Listing"
                  className="w-full h-full object-contain md:object-cover"
                />
              </div>
            </div>

          </div>
        </section>
        <section className="relative bg-gradient-to-br from-[#0E1C2F] via-[#1F3B79] to-[#415CBB] border border-[#2E60C3] backdrop-blur-lg rounded-3xl overflow-hidden mb-16">
          <div className="flex flex-col md:flex-row items-center justify-between px-6 md:px-12 py-12 md:py-20 gap-10">
            <div className="w-full md:w-1/2 flex justify-center relative max-w-lg rounded-lg">
              <img
                src="/landing-img1.webp"
                alt="Phone Preview"
                className="w-full z-10 relative rounded-xl"
              />
            </div>
            <div className="w-full md:w-1/2 text-center md:text-left">
              <p className="text-[#F15A24] font-semibold text-sm uppercase tracking-wide mb-2">
                Solutions for Vendors
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-white mb-6">
                Business Listing
              </h2>
              <p className="text-[#8B9AB2] text-lg md:text-xl max-w-xl mx-auto md:mx-0 mb-6">
                Keep truck drivers in the loop with the latest business updates and boost your visibility through eye-catching banners and engaging promotional videos.
              </p>
              <button className="bg-[#F15A24] hover:bg-[#d8491a] text-white font-semibold py-3 px-6 rounded-md transition">
                Learn More
              </button>
            </div>            
          </div>
        </section>
        <section className=" bg-gradient-to-br from-[#0E1C2F] via-[#1F3B79] to-[#415CBB] glass-card rounded-3xl bg-white/5 border border-[#48AFFF] backdrop-blur-lg p-10 mb-16">
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

          <div className="text-center ">
            <button className="bg-gradient-to-r from-[#1F3B79] to-[#2E60C3] text-white px-6 py-3 rounded-lg shadow-md hover:brightness-110 transition-all">
              Explore TruckNav
            </button>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default Page;
