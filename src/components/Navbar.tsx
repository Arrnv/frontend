// Navbar.tsx
'use client';

import { useState } from "react";
import { dynamicNavLinks } from "./generateNavLinks";
import { useRouter } from 'next/navigation';

interface NavbarProps {
  onSelect: (section: string, itemId: string) => void;
}

export default function Navbar({ onSelect }: NavbarProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const router = useRouter();

  const handleClick = (section: string, id: string) => {
    onSelect(section, id); 
    router.push(`/customer/Services?section=${section}&id=${id}`);
  };
  return (
    <nav className="bg-white shadow" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/customer/Home" className="text-xl font-bold" aria-label="TruckNav Home">
          🚛 TruckNav
        </a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-6 items-center" role="menubar">
          {dynamicNavLinks.map((item, idx) => (
            <li
              key={idx}
              className={`relative ${item.className || ''}`}
              onMouseEnter={() => setOpenIndex(idx)}
              onMouseLeave={() => setOpenIndex(null)}
            >
              {item.subLinks ? (
                <div className="cursor-pointer flex items-center gap-1">
                  {item.icon} {item.label}
                </div>
              ) : (
                <a href={item.href} className="flex items-center gap-1">
                  {item.icon} {item.label}
                </a>
              )}

              {/* Dropdown */}
              {item.subLinks && openIndex === idx && (
                <ul className="absolute top-full left-0 bg-white border shadow-lg rounded w-48 z-10">
                  {item.subLinks.map((subItem, subIdx) => (
                    <li key={subIdx} className="border-b last:border-none">
                      {subItem.subLinks ? (
                        <div className="relative group">
                          <div className="flex items-center justify-between px-4 py-2 hover:bg-gray-100 cursor-pointer">
                            {subItem.icon} {subItem.label}
                            <span className="ml-auto">▸</span>
                          </div>
                          <ul className="absolute left-full top-0 bg-white border shadow-md rounded w-48 hidden group-hover:block">
                            {subItem.subLinks.map((nested, nestedIdx) => (
                              <li key={nestedIdx}>
                                <a
                                  href="#"
                                  onClick={(e) => {
                                    e.preventDefault();
                                    handleClick(item.label, nested.id!);
                                  }}
                                  className="block px-4 py-2 hover:bg-gray-100"
                                >
                                  {subItem.icon} {nested.id}
                                </a>

                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <a
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            handleClick(item.label, subItem.label);
                          }}
                          className="block px-4 py-2 hover:bg-gray-100"
                        >
                          {subItem.icon} {subItem.label}
                        </a>

                      )}
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
