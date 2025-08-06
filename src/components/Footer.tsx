'use client';

import React from 'react';
import {
  FaFacebookF,
  FaInstagram,
  FaEnvelope,
  FaTimes,
} from 'react-icons/fa';
import { FaApple, FaGooglePlay } from 'react-icons/fa6';

const Footer = () => {
  return (
    <footer className="w-screen h-64 bg-[url('/Footer.png')] bg-cover bg-center py-10 px-6 ">
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row justify-between gap-8">
        {/* Logo + Social + Copyright */}
        <div className="flex flex-col items-center lg:items-start gap-4">
          <div className="flex items-center gap-2 text-xl font-bold">
            <img
              src="/logo-icon.png" // Replace with your icon path
              alt="Trucker Guide Logo"
              className="h-6 w-6"
            />
            <span className="text-white">
              TRUCKER<span className="text-[#0099E8]">GUIDE</span>
            </span>
          </div>

          <div className="flex gap-4 text-lg text-white">
            <FaTimes className="hover:text-[#0099E8] cursor-pointer" />
            <FaFacebookF className="hover:text-[#0099E8] cursor-pointer" />
            <FaInstagram className="hover:text-[#0099E8] cursor-pointer" />
            <FaEnvelope className="hover:text-[#0099E8] cursor-pointer" />
          </div>

          <p className="text-xs text-gray-400 mt-2">
            © 2025 Trucker Guide LLC <br />
            <a href="#" className="underline mr-2">Terms of Use</a>
            <a href="#" className="underline">Privacy Policy</a>
          </p>
        </div>

        {/* Links */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-sm">
          <div>
            <h4 className="font-semibold mb-2">Company</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-[#0099E8]">Contact us</a></li>
              <li><a href="#" className="hover:text-[#0099E8]">Blog</a></li>
              <li><a href="#" className="hover:text-[#0099E8]">Press Kit</a></li>
              <li><a href="#" className="hover:text-[#0099E8]">Categories</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">For Drivers</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-[#0099E8]">Places</a></li>
              <li><a href="#" className="hover:text-[#0099E8]">Services</a></li>
              <li><a href="#" className="hover:text-[#0099E8]">Traffic Cameras</a></li>
              <li><a href="#" className="hover:text-[#0099E8]">Navigation</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">For Business</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-[#0099E8]">Add Business</a></li>
              <li><a href="#" className="hover:text-[#0099E8]">Log in</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-2">Download</h4>
            <ul className="space-y-2">
              <li className="flex items-center gap-2">
                <FaApple />
                <a href="#" className="hover:text-[#0099E8]">Download on the App Store</a>
              </li>
              <li className="flex items-center gap-2">
                <FaGooglePlay />
                <a href="#" className="hover:text-[#0099E8]">Get it on Google Play</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
