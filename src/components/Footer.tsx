'use client';

import React from 'react';
import Link from 'next/link';
import {
  FaFacebookF,
  FaInstagram,
  FaEnvelope,
  FaTimes,
} from 'react-icons/fa';
import { FaApple, FaGooglePlay } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="w-full bg-[url('/Footer.png')] bg-cover bg-center py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-10">
        
        {/* Logo & Social */}
        <div className="flex flex-col items-center lg:items-start gap-4">
          <div className="flex items-center gap-2 text-xl font-bold">
            <img
              src="/Pathsure_final_files-02.png"
              alt="Trucker Guide Logo"
              className="h-6 w-6"
            />
            <span className="text-white">
              Path<span className="text-[#0099E8]">Sure</span>
            </span>
          </div>

          <div className="flex gap-4 text-lg text-white">
            <FaTimes className="hover:text-[#0099E8] cursor-pointer" />
            <FaFacebookF className="hover:text-[#0099E8] cursor-pointer" />
            <FaInstagram className="hover:text-[#0099E8] cursor-pointer" />
            <FaEnvelope className="hover:text-[#0099E8] cursor-pointer" />
          </div>

          <p className="text-xs text-gray-400 text-center lg:text-left mt-2 leading-relaxed">
            © 2025 Trucker Guide LLC <br />
            <Link href="/terms" className="underline mr-2">Terms of Use</Link>
            <Link href="/privacy" className="underline">Privacy Policy</Link>
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm text-white text-center sm:text-left">
          <div>
            <h4 className="font-semibold mb-2">Company</h4>
            <ul className="space-y-1">
              <li><Link href="/customer/Contact" className="hover:text-[#0099E8]">Contact us</Link></li>
              <li><Link href="/blog" className="hover:text-[#0099E8]">Blog</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">For Drivers</h4>
            <ul className="space-y-1">
              <li><Link href="/customer/Services" className="hover:text-[#0099E8]">Places</Link></li>
              <li><Link href="/customer/Services?type=services&subcategory=48cb06e6-df5d-4cf4-b0b8-6bd48b70fb9f" className="hover:text-[#0099E8]">Services</Link></li>
              <li><Link href="/customer/Navigation" className="hover:text-[#0099E8]">Navigation</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">For Business</h4>
            <ul className="space-y-1">
              <li><Link href="/business/signup" className="hover:text-[#0099E8]">Add Business</Link></li>
              <li><Link href="/customer/login" className="hover:text-[#0099E8]">Log in</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Download</h4>
            <ul className="space-y-2">
              <li className="flex flex-col sm:flex-row sm:items-center gap-2">
                <FaApple />
                <a
                  href="https://apps.apple.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0099E8]"
                >
                  Download on the App Store
                </a>
              </li>
              <li className="flex flex-col sm:flex-row sm:items-center gap-2">
                <FaGooglePlay />
                <a
                  href="https://play.google.com/store"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#0099E8]"
                >
                  Get it on Google Play
                </a>
              </li>
            </ul>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
