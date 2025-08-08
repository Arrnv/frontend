'use client';

import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';
import Image from 'next/image';
import React, { useState } from 'react';

const ContactUsPage = () => {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    message: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
    // Submit logic here
  };

  return (
    <>
    <Navbar/>
    <div className="w-screen mx-auto px-6 py-12 text-black">
      <div className="flex flex-col lg:flex-row gap-20 px-20">
        {/* Left Section */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
          <p className="mb-6 text-sm text-gray-700">
            Got questions, comments, or feedback? You're in the right place.
          </p>

          <div className="mb-4">
            <p className="font-semibold">For Listing Opportunities:</p>
            <a href="mailto:sales@truckerguide.app" className="text-[#0099E8] underline">
              sales@truckerguide.app
            </a>
          </div>

          <div className="mb-4">
            <p className="font-semibold">For Business Development and Partnerships:</p>
            <a href="mailto:jacob@truckerguide.app" className="text-[#0099E8] underline">
              jacob@truckerguide.app
            </a>
          </div>

          <p className="text-sm mb-6">
            For any other inquiries or if you need assistance, please complete the contact form
            with a short explanation, and we&apos;ll get back to you shortly. Thank you!
          </p>

          {/* Contact Form */}
          <form
            onSubmit={handleSubmit}
            className="border border-gray-200 rounded-md p-6 space-y-4"
          >
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                name="firstName"
                placeholder="First Name"
                onChange={handleChange}
                value={form.firstName}
                className="flex-1 border rounded-md px-3 py-2 text-sm"
              />
              <input
                name="lastName"
                placeholder="Last Name"
                onChange={handleChange}
                value={form.lastName}
                className="flex-1 border rounded-md px-3 py-2 text-sm"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                name="phone"
                placeholder="Phone"
                onChange={handleChange}
                value={form.phone}
                className="flex-1 border rounded-md px-3 py-2 text-sm"
              />
              <input
                name="email"
                placeholder="Email"
                onChange={handleChange}
                value={form.email}
                className="flex-1 border rounded-md px-3 py-2 text-sm"
              />
            </div>
            <textarea
              name="message"
              placeholder="Type your message here"
              rows={4}
              onChange={handleChange}
              value={form.message}
              className="w-full border rounded-md px-3 py-2 text-sm"
            />
            <div className="pt-4 bg-gray-50 p-4 rounded-md">
              <button
                type="submit"
                className="bg-[#F05A00] text-white px-6 py-2 rounded hover:bg-orange-600 transition"
              >
                Submit
              </button>
            </div>
          </form>
        </div>

        {/* Right Side Image */}
        <div className="hidden lg:block w-[300px]">
          <Image
            src="/contact-banner.webp" // Add this to your public folder as `public/truck-image.png`
            alt="Trucker"
            width={300}
            height={400}
            className="object-cover rounded"
          />
        </div>
      </div>
    </div>
    <Footer/>
    </>
    
  );
};

export default ContactUsPage;
