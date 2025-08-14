'use client';

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import FloatingSubmenu from '@/components/FloatingSubmenu';
import {
  ChevronDown, ChevronUp, Wrench, Menu, X,
} from 'lucide-react';
import LoginModal from './LoginModal';

type SubCategory = { key: string; label: string };
type Category = {
  key: string;
  label: string;
  icon: string;
  icon_url: string;
  subcategories: SubCategory[];
};

type ServiceNavProps = {
  selectedCategory: string | null;
  onSelect: (section: 'services' | 'places', selectedSubcategoryIds: string[]) => void;
};

const ServiceNav: React.FC<ServiceNavProps> = ({ selectedCategory, onSelect }) => {
  const [servicesData, setServicesData] = useState<Category[]>([]);
  const [placesData, setPlacesData] = useState<Category[]>([]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const [openSection, setOpenSection] = useState<'services' | 'places' | null>(null);
  const [visibleSection, setVisibleSection] = useState<'services' | 'places' | null>(null);
  const [openCategoryKey, setOpenCategoryKey] = useState<string | null>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [floatingAnchor, setFloatingAnchor] = useState<DOMRect | null>(null);

  const [isSidebar, setIsSidebar] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // NEW: mobile menu toggle
  const [mobileDropdown, setMobileDropdown] = useState<{ [key: string]: boolean }>({}); // NEW: mobile collapsible

  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();

  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const categoryButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const placesRef = useRef<HTMLDivElement | null>(null);

  // Sidebar check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSidebar(pathname.includes('/customer/Services'));
    }
  }, [pathname]);

  // Load selected from query
  useEffect(() => {
    const subcategoryParams = searchParams.getAll('subcategory');
    setSelectedSubcategories(subcategoryParams);
  }, [searchParams]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, placesRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/services`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/places`),
        ]);

        setServicesData((servicesRes.data.data || []).map((s: any) => ({
          key: s.id,
          label: s.label,
          icon: s.icon || 'Wrench',
          icon_url: s.icon_url || '',
          subcategories: (s.subcategories || []).map((sc: any) => ({ key: sc.id, label: sc.label })),
        })));

        setPlacesData((placesRes.data.data || []).map((p: any) => ({
          key: p.id,
          label: p.label,
          icon: 'MapPin',
          icon_url: p.icon_url || '',
          subcategories: (p.subcategories || []).map((sc: any) => ({ key: sc.id, label: sc.label })),
        })));
      } catch (err) {
        console.error("🔥 Axios fetch error:", err);
      }
    };

    fetchData();
  }, []);

  const clearHoverTimeout = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }
  };

  const setCloseTimeout = () => {
    hoverTimeoutRef.current = setTimeout(() => {
      setOpenCategoryKey(null);
      setFloatingAnchor(null);
    }, 200);
  };

  const renderCategories = (data: Category[], section: 'services' | 'places') => (
    <div className={`${isSidebar ? 'flex flex-col items-center space-y-4' : 'space-y-1 text-black'}`}>
      {data.map((category) => {
        const handleMouseEnter = () => {
          if (window.innerWidth < 768) return; // disable on mobile
          clearHoverTimeout();
          setOpenCategoryKey(category.key);
          const button = categoryButtonRefs.current[category.key];
          if (button) setFloatingAnchor(button.getBoundingClientRect());
        };

        const handleMouseLeave = () => {
          if (window.innerWidth < 768) return; // disable on mobile
          setCloseTimeout();
        };

        const handleSubmenuMouseEnter = () => clearHoverTimeout();
        const handleSubmenuMouseLeave = () => setCloseTimeout();

        // Mobile toggle
        const toggleMobileDropdown = () => {
          setMobileDropdown((prev) => ({
            ...prev,
            [category.key]: !prev[category.key],
          }));
        };

        return (
          <div
            key={category.key}
            className="relative group"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              ref={el => { categoryButtonRefs.current[category.key] = el }}
              title={isSidebar ? category.label : undefined}
              onClick={() => {
                if (window.innerWidth < 768) {
                  toggleMobileDropdown();
                }
              }}
              className={`transition rounded-md focus:outline-none ${
                isSidebar
                  ? 'w-10 h-10 flex items-center justify-center bg-white hover:text-white'
                  : 'w-full flex items-center justify-between px-2 py-1 text-left font-semibold hover:text-[#0099E8]'
              } ${openCategoryKey === category.key ? 'text-[#0099E8]' : ''}`}
            >
              <div className={`flex items-center ${!isSidebar ? 'gap-2' : ''}`}>
                {category.icon_url ? (
                  <img
                    src={category.icon_url}
                    alt=""
                    className="w-6 h-6 object-contain"
                  />
                ) : (
                  <Wrench size={20} />
                )}
                {!isSidebar && (
                  <span>{category.label}</span>
                )}
              </div>
              {!isSidebar && (
                <span>
                  {window.innerWidth < 768
                    ? mobileDropdown[category.key] ? <ChevronUp size={16} /> : <ChevronDown size={16} />
                    : openCategoryKey === category.key ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </span>
              )}
            </button>

            {/* Desktop floating menu */}
            {openCategoryKey === category.key && floatingAnchor && window.innerWidth >= 768 && (
              <FloatingSubmenu
                anchorRect={floatingAnchor}
                subcategories={category.subcategories}
                selectedSubcategory={selectedSubcategories}
                allowMultiSelect={isSidebar}
                onSelect={(updatedIds) => {
                  setSelectedSubcategories(updatedIds);
                  if (isSidebar) {
                    onSelect(section, updatedIds);
                  } else {
                    const query = updatedIds.map(id => `subcategory=${id}`).join('&');
                    router.push(`/customer/Services?type=${section}&${query}`);
                  }
                }}
                onMouseEnter={handleSubmenuMouseEnter}
                onMouseLeave={handleSubmenuMouseLeave}
              />
            )}

            {/* Mobile dropdown */}
            {mobileDropdown[category.key] && window.innerWidth < 768 && (
              <div className="ml-4 mt-2 space-y-1">
                {category.subcategories.map((sub) => (
                  <button
                    key={sub.key}
                    className={`block text-left w-full px-2 py-1 text-sm rounded hover:bg-gray-100 ${
                      selectedSubcategories.includes(sub.key) ? 'text-[#0099E8]' : ''
                    }`}
                    onClick={() => {
                      const updatedIds = selectedSubcategories.includes(sub.key)
                        ? selectedSubcategories.filter(id => id !== sub.key)
                        : [...selectedSubcategories, sub.key];
                      setSelectedSubcategories(updatedIds);
                      const query = updatedIds.map(id => `subcategory=${id}`).join('&');
                      router.push(`/customer/Services?type=${section}&${query}`);
                    }}
                  >
                    {sub.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  useGSAP(() => {
    const ref = openSection === 'services' ? servicesRef.current : placesRef.current;
    if (ref) {
      gsap.fromTo(ref, { opacity: 0, y: -10, height: 0 }, { opacity: 1, y: 0, height: 'auto', duration: 0.2 });
    }
  }, [openSection]);

  const handleHover = (section: 'services' | 'places', enter: boolean) => {
    if (window.innerWidth < 768) return; // disable hover on mobile
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
    const timeout = setTimeout(() => {
      if (enter) {
        setVisibleSection(section);
        setOpenSection(section);
      } else {
        setVisibleSection(null);
        setOpenSection(null);
        setOpenCategoryKey(null);
        setFloatingAnchor(null);
      }
    }, 200);
    hoverTimeoutRef.current = timeout;
  };

  // SIDEBAR VIEW (unchanged)
  if (isSidebar) {
    return (
      <div className="bg-[#F7F6F9] border-r space-y-4 p-2 h-full sticky top-0 overflow-y-auto w-full z-40 text-black">
        <div className="space-y-6 p-3">
          {openSection === 'services' && <div ref={servicesRef}>{renderCategories(servicesData, 'services')}</div>}
          {openSection === 'places' && <div ref={placesRef}>{renderCategories(placesData, 'places')}</div>}
        </div>
      </div>
    );
  }

  // TOP NAV
  return (
    <>
      <nav className="fixed top-0 left-0 z-50 w-screen bg-white border-b border-[#D9E4EF] px-4 py-3 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
          <img src="/logo-desi-22.png" alt="Logo" className="h-6" />
          <span className="font-bold text-xl text-[#0E1C2F]">
            DailEn<span className="text-[#246BFD]">Search</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="relative" onMouseEnter={() => handleHover('services', true)} onMouseLeave={() => handleHover('services', false)}>
            <button className={`flex items-center text-sm font-medium ${openSection === 'services' ? 'text-[#0099E8]' : 'hover:text-[#0099E8]'}`}>
              Services {openSection === 'services' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {visibleSection === 'services' && (
              <div ref={servicesRef} className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl p-4 z-50">
                {renderCategories(servicesData, 'services')}
              </div>
            )}
          </div>

          <div className="relative" onMouseEnter={() => handleHover('places', true)} onMouseLeave={() => handleHover('places', false)}>
            <button className={`flex items-center text-sm font-medium ${openSection === 'places' ? 'text-[#0099E8]' : 'hover:text-[#0099E8]'}`}>
              Places {openSection === 'places' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
            {visibleSection === 'places' && (
              <div ref={placesRef} className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl p-4 z-50">
                {renderCategories(placesData, 'places')}
              </div>
            )}
          </div>

          <Link href="/business/signup" className="bg-gradient-to-r from-[#1F3B79] to-[#2E60C3] text-white px-4 py-2 rounded-xl">
            List Your Business
          </Link>
          <button onClick={() => setIsLoginOpen(true)} className="text-sm font-semibold text-[#246BFD]">
            Login
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden mt-14 px-4 pb-4 bg-white shadow-md">
          <div>
            <p className="font-semibold py-2 cursor-pointer flex flex-row items-center gap-2" onClick={() => setMobileDropdown(prev => ({ ...prev, services: !prev.services }))}>
              Services {mobileDropdown.services ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </p>
            {mobileDropdown.services && renderCategories(servicesData, 'services')}
          </div>

          <div className="mt-2">
            <p className="font-semibold py-2 cursor-pointer flex flex-row items-center gap-2" onClick={() => setMobileDropdown(prev => ({ ...prev, places: !prev.places }))}>
              Places {mobileDropdown.places ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </p>
            {mobileDropdown.places && renderCategories(placesData, 'places')}
          </div>

          <Link href="/business/signup" className="block mt-4 bg-gradient-to-r from-[#1F3B79] to-[#2E60C3] text-white px-4 py-2 rounded-xl text-center">
            List Your Business
          </Link>
          <button onClick={() => setIsLoginOpen(true)} className="mt-2 w-full text-sm font-semibold text-[#246BFD]">
            Login
          </button>
        </div>
      )}

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default ServiceNav;
