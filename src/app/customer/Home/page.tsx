'use client';

import { useState } from 'react';
import React from 'react';
import Navbar from '@/components/Navbar';
import Image from 'next/image';


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


const page = () => {

  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const handleSelect = (section: string, itemId: string) => {
    console.log('Selected:', section, itemId);
  };
  
  

  return (
    <>
      <Navbar />
      <section className='flex flex-row h-[30rem] ml-[6rem] mr-[1rem] gap-[1rem]'>
        <div className='flex flex-col gap-[3.5rem] w-2/5 justify-center px-[1rem] '>
          <h1 className='font-["Helvetica"] text-[3rem]/[3rem]'>
            <span className='text-[#e95800]'>FIND </span>SERVICES <br /> FOR TRUCK <br />DRIVERS & FLEETS
          </h1>
          <p className='text-sm text-gray-400'>
            Become a part of an innovative and feature-rich service with over 450K points of interest for truckers nationwide
          </p>
        </div>
        <div className="h-full w-3/5 relative">
          <Image
            src="/main-img.webp"
            alt="Map and icons showing over 450,000 service points for truck drivers across the USA"
            fill
            className="object-contain object-center"
            priority
          />
        </div>
      </section>
      <section className='flex flex-row h-[30rem] m-[6rem]'>
        <div className='flex flex-col gap-[2rem] w-2/5 justify-center px-[1rem] '>
          <h1 className='font-["Helvetica"] text-[1.5rem]/[1.5rem] text-center mb-[1rem]'> IMPROVE <span className='text-[#e95800]'>ROUTING</span>. ENSURE <span className='text-[#e95800]'>SAFETY</span></h1>
          <div className="h-[7rem] w-full relative">
            <Image
              src="/cameras-icons.webp"
              alt="Map and icons showing over 450,000 service points for truck drivers across the USA"
              fill
              className="object-contain object-center"
              priority
            />
         </div>
          <div className='flex flex-row gap-[2rem] justify-center'>
            <h1 className='text-[1.125rem] w-[7rem] text-center'>Low Clearances</h1>
            <h1 className='text-[1.125rem] w-[7rem] text-center'>Streaming Cameras</h1>
            <h1 className='text-[1.125rem] w-[7rem] text-center'>Live Snapshots</h1>
          </div>
          <h3 className='text-center mt-[1rem] text-sm text-gray-400'>Optimize your route planning to avoid unsafe routes, low clearances, and challenging driving conditions.</h3>
        </div>
        <div className="h-full w-3/5 relative">
         <Image
            src="/cameras-img.webp"
            alt="Map and icons showing over 450,000 service points for truck drivers across the USA"
            fill
            className="object-contain object-center"
            priority
          />
        </div>
      </section>
      <section className='mx-[10rem] flex flex-row h-screen gap-[5rem]'>
          <div className='w-1/2 h-full relative'>
              <Image
              src="/landing-img3.webp"
              alt="Map and icons showing over 450,000 service points for truck drivers across the USA"
              fill
              className="object-contain "
              priority
            />
          </div>
          <div className='w-1/2 h-full flex gap-[1rem] flex-col font-["Helvetica"] justify-center'>
            <p className='text-[#e95800]'>SOLUTIONS FOR DRIVERS</p>
            <h1 className='text-3xl mb-[2rem]'>Truck Navigation</h1>
            <p className='text-m text-gray-700 mb-[2rem]'>Our truck-friendly navigation system offers precise directions, avoiding low bridges, weight limits, and no-truck areas, customized for your truck and trailer dimensions.</p>
            <button className='w-[10rem] p-[1rem] bg-[#e95800] text-white rounded-sm'>Learn more</button>
          </div>
      </section>
      <section className='mx-[10rem] flex flex-row h-screen gap-[5rem]'>
          
          <div className='w-1/2 h-full flex gap-[1rem] flex-col font-["Helvetica"] justify-center'>
            <p className='text-[#e95800]'>SOLUTIONS FOR DRIVERS</p>
            <h1 className='text-3xl mb-[2rem]'>Truck Navigation</h1>
            <p className='text-m text-gray-700 mb-[2rem]'>Our truck-friendly navigation system offers precise directions, avoiding low bridges, weight limits, and no-truck areas, customized for your truck and trailer dimensions.</p>
            <button className='w-[10rem] p-[1rem] bg-[#e95800] text-white rounded-sm'>Learn more</button>
          </div>
          <div className='w-1/2 h-full relative'>
              <Image
              src="/landing-img2.webp"
              alt="Map and icons showing over 450,000 service points for truck drivers across the USA"
              fill
              className="object-contain object-center"
              priority
            />
          </div>
      </section>
      <section className='flex h-screen mx-[6rem] gap-[2rem] '>
          <div className='w-1/2 relative '>
              <Image
              src="/landing-img1.webp"
              alt="Map and icons showing over 450,000 service points for truck drivers across the USA"
              fill
              className="object-contain object-center"
              priority
            />
          </div>
          <div className='w-1/2 h-full flex gap-[1rem] flex-col font-["Helvetica"] justify-center pr-[3rem]'>
            <p className='text-[#e95800]'>SOLUTIONS FOR DRIVERS</p>
            <h1 className='text-3xl mb-[2rem]'>Truck Navigation</h1>
            <p className='text-m text-gray-700 mb-[2rem]'>Our truck-friendly navigation system offers precise directions, avoiding low bridges, weight limits, and no-truck areas, customized for your truck and trailer dimensions.</p>
            <button className='w-[10rem] p-[1rem] bg-[#e95800] text-white rounded-sm'>Learn more</button>
          </div>
      </section>
      <section className="max-w-5xl mx-auto py-8 ">
        <h2 className="text-5xl text-[#e95800] font-semibold mb-6">Got Questions? Find Answers Here</h2>
        <h3 className='text-xl mb-10'>Frequently Asked Questions About Trucker Guide</h3>
        <div className="space-y-4 px-2">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b p-4">
              <button
                onClick={() => toggleFAQ(index)}
                className="flex justify-between items-center w-full text-left"
              >
                <span>{faq.question}</span>
                <svg
                  className={`w-5 h-5 transform transition-transform duration-200 ${
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
                <p className="mt-2 text-sm text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
    </section>
    </>
  );
};

export default page;
