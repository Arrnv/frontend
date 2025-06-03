"use client";

import { useState } from "react";
import { navLinks } from "./navLinks";
import { renderMenu } from "./MenuRenderer";
import { JSX } from "react/jsx-runtime";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="bg-white" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <a href="/" className="text-xl font-bold" aria-label="TruckNav Home">🚛 TruckNav</a>

        {/* Desktop Nav */}
        <ul className="hidden md:flex gap-6 items-center" role="menubar">
          {navLinks.slice(0, -2).map((item, idx) => (
            <li key={idx} className={`relative group ${item.className || ""}`} role="none">
              {item.subLinks ? (
                <button
                  className="px-4 py-2"
                  aria-haspopup="true"
                  aria-expanded="false"
                  aria-controls={`submenu-${idx}`}
                >
                  {item.label}
                </button>
              ) : (
                <a href={item.href} role="menuitem" className="px-4 py-2 block">
                  {item.label}
                </a>
              )}
              {item.subLinks && renderMenu(item.subLinks)}
            </li>
          ))}
          {/* Login/Signup */}
          <li className="flex items-center gap-2">
            {navLinks.slice(-2).map((item, idx) => (
              <a key={idx} href={item.href} className={`px-2 py-1 ${item.className || ""}`} role="menuitem">
                {item.label}
              </a>
            ))}
          </li>
        </ul>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 focus:outline-none"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle mobile menu"
          aria-expanded={menuOpen}
        >
          <svg className="w-6 h-6 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t shadow-md px-4 py-2 space-y-2">
          {navLinks.map((item, idx) => (
            <MobileNavItem key={idx} item={item} />
          ))}
        </div>
      )}
    </nav>
  );
}

function MobileNavItem({ item }: { item: typeof navLinks[number] }) {
  if (item.subLinks) {
    return (
      <details className="group overflow-hidden">
        <summary className="px-4 py-2 cursor-pointer hover:bg-gray-100 font-medium flex items-center gap-2">
          {item.icon && <span className="">{item.icon}</span>}
          {item.label}
        </summary>
        <ul className="pl-6">{renderMobileSubMenu(item.subLinks)}</ul>
      </details>
    );
  }
  return (
    <summary className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-gray-100 font-medium list-none">
        {item.icon && <span className="">{item.icon}</span>}
        {item.label}
    </summary>
  );
}

function renderMobileSubMenu(subLinks: typeof navLinks): JSX.Element[] {
  return subLinks.map((item, idx) =>
    item.subLinks ? (
      <li key={idx}>
        <details className="group">
            <summary className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-gray-50 list-none">
                {item.icon && <span>{item.icon}</span>}
                {item.label}
            </summary>
          <ul className="pl-4">{renderMobileSubMenu(item.subLinks)}</ul>
        </details>
      </li>
    ) : (
      <li key={idx}>
        <a href={item.href} className={`block px-2 py-1 hover:bg-gray-50 flex flex-row items-center gap-2 ${item.className || ""}`}>
          {item.icon && <span>{item.icon}</span>}
          {item.label}
        </a>
      </li>
    )
  );
}
