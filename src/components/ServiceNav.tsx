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
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [placesData, setPlacesData] = useState<Category[]>([]);
  const [openSection, setOpenSection] = useState<'services' | 'places' | null>(null);
  const [visibleSection, setVisibleSection] = useState<'services' | 'places' | null>(null);
  const [openCategoryKey, setOpenCategoryKey] = useState<string | null>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [floatingAnchor, setFloatingAnchor] = useState<DOMRect | null>(null);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const categoryButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const servicesRef = useRef<HTMLDivElement | null>(null);
  const placesRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  const [isSidebar, setIsSidebar] = useState(false);
  const pathname = usePathname();


  // Mobile menu state
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
const searchParams = useSearchParams();

useEffect(() => {
  const type = searchParams.get("type") as 'services' | 'places' | null;
  const subcategory = searchParams.getAll("subcategory");

  if (type && subcategory.length > 0) {
    setOpenSection(type);
    setSelectedSubcategories(subcategory);

    // Optional: expand the category in the sidebar if subcategory belongs to it
    const data = type === 'services' ? servicesData : placesData;
    const parentCategory = data.find(cat =>
      cat.subcategories.some(sc => subcategory.includes(sc.key))
    );
    if (parentCategory) {
      setOpenCategoryKey(parentCategory.key);
    }
  }
}, [searchParams, servicesData, placesData]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsSidebar(pathname.includes('/customer/Services'));
    }
  }, [pathname]);



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

  const hoverTimeoutRef = React.useRef<NodeJS.Timeout | null>(null);
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
    <div className={`${isSidebar ? 'flex flex-col items-center space-y-4' : 'space-y-1'}`}>
      {data.map((category) => {
        const handleMouseEnter = () => {
          clearHoverTimeout();
          setOpenCategoryKey(category.key);
          const button = categoryButtonRefs.current[category.key];
          if (button) setFloatingAnchor(button.getBoundingClientRect());
        };

        const handleMouseLeave = () => {
          setCloseTimeout();
        };

        return (
          <div
            key={category.key}
            className="relative group"
            onMouseEnter={ handleMouseEnter }
            onMouseLeave={ handleMouseLeave}
          >
            <button
              ref={el => { categoryButtonRefs.current[category.key] = el }}
              title={isSidebar ? category.label : undefined}
              className={`transition rounded-md focus:outline-none ${
                isSidebar
                  ? 'w-10 h-10 flex items-center justify-center bg-white hover:text-white'
                  : 'w-full flex items-center justify-between px-2 py-1 text-left font-semibold hover:text-[#0099E8]'
              } ${openCategoryKey === category.key ? 'text-[#0099E8]' : ''}`}
            >
              <div className={`flex items-center ${!isSidebar ? 'gap-2' : ''}`}>
                {category.icon_url ? (
                  <img src={category.icon_url} alt="" className="w-6 h-6 object-contain" />
                ) : (
                  <Wrench size={20} />
                )}
                {!isSidebar && (
                  <span className={`${openCategoryKey === category.key ? 'text-[#0099E8]' : 'text-black group-hover:text-[#0099E8]'}`}>
                    {category.label}
                  </span>
                )}
              </div>
              {!isSidebar && !mobileMenuOpen && (
                <span>{openCategoryKey === category.key ? <ChevronUp size={16} /> : <ChevronDown size={16} />}</span>
              )}
            </button>

            {!mobileMenuOpen && openCategoryKey === category.key && floatingAnchor && (
              <FloatingSubmenu
                anchorRect={floatingAnchor}
                subcategories={category.subcategories}
                selectedSubcategory={selectedSubcategories}
                allowMultiSelect={isSidebar}
                onSelect={(updatedIds) => {
                    setSelectedSubcategories(updatedIds); // ✅ Also update state here
                    if (isSidebar) {
                      onSelect(section, updatedIds);
                    } else {
                      const query = updatedIds.map(id => `subcategory=${id}`).join('&');
                      router.push(`/customer/Services?type=${section}&${query}`);
                    }
                  }}

                onMouseEnter={clearHoverTimeout}
                onMouseLeave={setCloseTimeout}
              />
            )}
          </div>
        );
      })}
    </div>
  );

  // For GSAP animation
  useGSAP(() => {
    const ref = openSection === 'services' ? servicesRef.current : placesRef.current;
    if (ref) {
      gsap.fromTo(ref, { opacity: 0, y: -10, height: 0 }, { opacity: 1, y: 0, height: 'auto', duration: 0.2 });
    }
  }, [openSection]);

  const handleHover = (section: 'services' | 'places', enter: boolean) => {
    if (hoverTimeout) clearTimeout(hoverTimeout);
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
    setHoverTimeout(timeout);
  };

  return isSidebar ? (
    <div className="bg-[#F7F6F9] border-r space-y-4 p-2 h-full sticky top-0 overflow-y-auto w-full z-40">
      <div className="space-y-6 p-3">
        <div>
          <button
            onClick={() => setOpenSection(openSection === 'services' ? null : 'services')}
            className="w-full flex justify-center p-2 transition bg-white rounded-xl mb-2"
          >
          <svg
            className={`w-8 h-8 mr-1 flex-shrink-0 transition ${
              openSection === 'services' ? 'text-[#0099E8]' : 'text-[#0E1C2F] group-hover:text-[#0099E8]'
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fillRule="evenodd" d="M6.094 12.463v-.088c0-1.225.096-2.396.275-3.486H2.677a9.525 9.525 0 0 0-.487 5.303l-1.271.563a11 11 0 0 1-.263-2.38C.656 6.379 5.535 1.5 11.531 1.5s10.875 4.879 10.875 10.875S17.528 23.25 11.531 23.25c-.81 0-1.6-.09-2.361-.258l.818-1.891c.5.512 1.03.79 1.543.79 1.33 0 2.764-1.857 3.527-4.846h-3.314l.588-1.36h3.011c.17-1.013.266-2.123.266-3.31a20 20 0 0 0-.296-3.486h-.06l.254-.595-1.343.595H7.75a19.6 19.6 0 0 0-.29 2.969zM8.44 3.375a9.57 9.57 0 0 0-5.096 4.154h3.3c.41-1.684 1.03-3.112 1.796-4.154m8.02 13.67c-.408 1.76-1.045 3.251-1.837 4.33a9.57 9.57 0 0 0 5.197-4.33zm3.992-1.357-.059-.003h-3.671c.16-1.04.247-2.15.247-3.31 0-1.225-.097-2.396-.275-3.486h3.691a9.5 9.5 0 0 1 .662 3.486c0 1.165-.21 2.28-.595 3.313m-4.033-8.159h3.299a9.57 9.57 0 0 0-5.095-4.154c.766 1.042 1.386 2.47 1.796 4.154M11.53 2.86c-1.303 0-2.706 1.784-3.48 4.67h6.96c-.773-2.886-2.177-4.67-3.48-4.67" clipRule="evenodd" />
            <path fillRule="evenodd" d="M13.23 11.73 4.947 15.42l2.338 1.204 1.189 2.368 1.227-2.796-.805.35-1.112-1.087 4.754-2.136-3.949 9.125-2.377-4.737-4.678-2.408L14.073 9.75z" clipRule="evenodd" />
            <path fillRule="evenodd" d="m5.751 18.214 2.339 4.737L7.016 24l-2.032-4.038-1.802 1.825-.997-1.01 1.803-1.824L0 16.894l1.035-1.087z" clipRule="evenodd" />
          </svg>
          </button>

          {openSection === 'services' && <div ref={servicesRef}>{renderCategories(servicesData, 'services')}</div>}
        </div>

        <div>
        <button
          onClick={() => setOpenSection(openSection === 'places' ? null : 'places')}
          className="w-full flex justify-center p-2 transition bg-white rounded-xl mb-2"
        >
        <svg
          className={`w-8 h-8 mr-1 flex-shrink-0 transition ${
            openSection === 'places' ? 'text-[#0099E8]' : 'text-[#0E1C2F] group-hover:text-[#0099E8]'
          }`}
          fill="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="m10.025 13.34 1.015 1.37-1.228 1.275-1.393-.945a4 4 0 0 1-.874.378l-.26 1.677-1.77.023-.331-1.653a6 6 0 0 1-.898-.354l-1.37 1.015-1.275-1.228.945-1.417a4 4 0 0 1-.378-.873l-1.677-.26v-1.771l1.677-.33c.094-.308.213-.615.354-.875l-1.015-1.37 1.228-1.275 1.393.969c.283-.166.567-.284.874-.378l.26-1.7 1.77-.024.308 1.677c.307.094.59.188.874.354l1.393-1.016 1.275 1.228-.968 1.394c.165.283.283.566.378.873l1.676.26.024 1.771-1.677.307a2.6 2.6 0 0 1-.33.898M6.27 9.75c-.898.024-1.606.756-1.582 1.63.023.897.755 1.605 1.63 1.582.897-.024 1.605-.756 1.581-1.63-.023-.897-.755-1.605-1.63-1.582" />
          <path d="m21.763 16.245.023 1.771-1.676.307c-.071.307-.19.614-.355.898l1.016 1.37-1.228 1.251-1.393-.944a4 4 0 0 1-.874.377l-.26 1.677-1.771.024-.33-1.653a6 6 0 0 1-.898-.355l-1.37 1.016-1.275-1.228.944-1.417a4 4 0 0 1-.377-.874l-1.677-.26-.024-1.77 1.677-.331c.095-.307.213-.614.354-.874l-1.015-1.37 1.228-1.275 1.393.968c.284-.165.567-.283.874-.378l.26-1.7 1.77-.024.308 1.677c.307.094.59.189.874.354l1.393-1.015 1.275 1.228-.968 1.393c.165.283.283.567.378.874zM16 15.608c-.898.023-1.606.755-1.583 1.63.024.896.756 1.605 1.63 1.581.897-.023 1.606-.755 1.582-1.63 0-.873-.732-1.581-1.63-1.581" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M14.077.698a2.662 2.662 0 0 1 3.323 3.66l4.77 4.344a1.026 1.026 0 0 1 0 1.446l-.21.21a1.026 1.026 0 0 1-1.446 0l-4.343-4.77a2.663 2.663 0 0 1-3.66-3.324l1.569 1.569a.356.356 0 0 0 .502 0l1.064-1.064a.356.356 0 0 0 0-.502z"
          />
        </svg>
        </button>

          {openSection === 'places' && <div ref={placesRef}>{renderCategories(placesData, 'places')}</div>}
        </div>
      </div>
    </div>
  ) : (
    <>
      {/* Top Nav */}
      <nav className="fixed top-0 left-0 z-50 w-screen bg-white border-b border-[#D9E4EF] px-6 py-3 flex items-center justify-between text-[#0E1C2F]">
        {/* Logo */}
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
          <img src="/logo-desi-22.png" alt="Logo" className="h-6" />
          <span className="font-bold text-xl text-[#0E1C2F]">
            DailEn<span className="text-[#246BFD]">Search</span>
          </span>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Services */}
          <div className="relative"
            onMouseEnter={() => handleHover('services', true)}
            onMouseLeave={() => handleHover('services', false)}>
            <button
              className={`flex items-center text-sm font-medium transition ${
                openSection === 'services' ? 'text-[#0099E8]' : 'hover:text-[#0099E8]'
              }`}
            >
            <svg
              className={`w-8 h-8 mr-1 flex-shrink-0 transition ${
                openSection === 'services' ? 'text-[#0099E8]' : 'text-[#0E1C2F] group-hover:text-[#0099E8]'
              }`}
              fill="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path fillRule="evenodd" d="M6.094 12.463v-.088c0-1.225.096-2.396.275-3.486H2.677a9.525 9.525 0 0 0-.487 5.303l-1.271.563a11 11 0 0 1-.263-2.38C.656 6.379 5.535 1.5 11.531 1.5s10.875 4.879 10.875 10.875S17.528 23.25 11.531 23.25c-.81 0-1.6-.09-2.361-.258l.818-1.891c.5.512 1.03.79 1.543.79 1.33 0 2.764-1.857 3.527-4.846h-3.314l.588-1.36h3.011c.17-1.013.266-2.123.266-3.31a20 20 0 0 0-.296-3.486h-.06l.254-.595-1.343.595H7.75a19.6 19.6 0 0 0-.29 2.969zM8.44 3.375a9.57 9.57 0 0 0-5.096 4.154h3.3c.41-1.684 1.03-3.112 1.796-4.154m8.02 13.67c-.408 1.76-1.045 3.251-1.837 4.33a9.57 9.57 0 0 0 5.197-4.33zm3.992-1.357-.059-.003h-3.671c.16-1.04.247-2.15.247-3.31 0-1.225-.097-2.396-.275-3.486h3.691a9.5 9.5 0 0 1 .662 3.486c0 1.165-.21 2.28-.595 3.313m-4.033-8.159h3.299a9.57 9.57 0 0 0-5.095-4.154c.766 1.042 1.386 2.47 1.796 4.154M11.53 2.86c-1.303 0-2.706 1.784-3.48 4.67h6.96c-.773-2.886-2.177-4.67-3.48-4.67" clipRule="evenodd" />
              <path fillRule="evenodd" d="M13.23 11.73 4.947 15.42l2.338 1.204 1.189 2.368 1.227-2.796-.805.35-1.112-1.087 4.754-2.136-3.949 9.125-2.377-4.737-4.678-2.408L14.073 9.75z" clipRule="evenodd" />
              <path fillRule="evenodd" d="m5.751 18.214 2.339 4.737L7.016 24l-2.032-4.038-1.802 1.825-.997-1.01 1.803-1.824L0 16.894l1.035-1.087z" clipRule="evenodd" />
            </svg>
              <p
                className={`transition ${
                  openSection === 'services' ? 'text-[#0099E8]' : 'text-[#0E1C2F] hover:text-[#0099E8]'
                }`}
              >
                Services
              </p>
              {openSection === 'services' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>


          {visibleSection === 'services' && (
            <div ref={servicesRef} className="absolute right-0 mt-2 w-72 bg-white  rounded-xl shadow-xl p-4 z-50">
              {renderCategories(servicesData, 'services')}
            </div>
          )}
        </div>

        <div className="relative"
             onMouseEnter={() => handleHover('places', true)}
             onMouseLeave={() => handleHover('places', false)}>
          <button
            className={`flex items-center text-sm font-medium transition ${
              openSection === 'places' ? 'text-[#0099E8]' : 'hover:text-[#0099E8]'
            }`}
          >
          <svg
            className={`w-8 h-8 mr-1 flex-shrink-0 transition ${
              openSection === 'places' ? 'text-[#0099E8]' : 'text-[#0E1C2F] group-hover:text-[#0099E8]'
            }`}
            fill="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="m10.025 13.34 1.015 1.37-1.228 1.275-1.393-.945a4 4 0 0 1-.874.378l-.26 1.677-1.77.023-.331-1.653a6 6 0 0 1-.898-.354l-1.37 1.015-1.275-1.228.945-1.417a4 4 0 0 1-.378-.873l-1.677-.26v-1.771l1.677-.33c.094-.308.213-.615.354-.875l-1.015-1.37 1.228-1.275 1.393.969c.283-.166.567-.284.874-.378l.26-1.7 1.77-.024.308 1.677c.307.094.59.188.874.354l1.393-1.016 1.275 1.228-.968 1.394c.165.283.283.566.378.873l1.676.26.024 1.771-1.677.307a2.6 2.6 0 0 1-.33.898M6.27 9.75c-.898.024-1.606.756-1.582 1.63.023.897.755 1.605 1.63 1.582.897-.024 1.605-.756 1.581-1.63-.023-.897-.755-1.605-1.63-1.582" />
            <path d="m21.763 16.245.023 1.771-1.676.307c-.071.307-.19.614-.355.898l1.016 1.37-1.228 1.251-1.393-.944a4 4 0 0 1-.874.377l-.26 1.677-1.771.024-.33-1.653a6 6 0 0 1-.898-.355l-1.37 1.016-1.275-1.228.944-1.417a4 4 0 0 1-.377-.874l-1.677-.26-.024-1.77 1.677-.331c.095-.307.213-.614.354-.874l-1.015-1.37 1.228-1.275 1.393.968c.284-.165.567-.283.874-.378l.26-1.7 1.77-.024.308 1.677c.307.094.59.189.874.354l1.393-1.015 1.275 1.228-.968 1.393c.165.283.283.567.378.874zM16 15.608c-.898.023-1.606.755-1.583 1.63.024.896.756 1.605 1.63 1.581.897-.023 1.606-.755 1.582-1.63 0-.873-.732-1.581-1.63-1.581" />
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M14.077.698a2.662 2.662 0 0 1 3.323 3.66l4.77 4.344a1.026 1.026 0 0 1 0 1.446l-.21.21a1.026 1.026 0 0 1-1.446 0l-4.343-4.77a2.663 2.663 0 0 1-3.66-3.324l1.569 1.569a.356.356 0 0 0 .502 0l1.064-1.064a.356.356 0 0 0 0-.502z"
            />
          </svg>


            <p className={`ml-1 transition ${
              openSection === 'places' ? 'text-[#0099E8]' : 'text-[#0E1C2F] hover:text-[#0099E8]'
            }`}>
              Places
            </p>

            {openSection === 'places' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {visibleSection === 'places' && (
            <div ref={placesRef} className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl p-4 z-50">
              {renderCategories(placesData, 'places')}
            </div>
          )}
        </div>

        <Link href="/business/signup" className="bg-gradient-to-r from-[#1F3B79] to-[#2E60C3] text-white font-medium px-4 py-2 rounded-xl hover:opacity-90 transition shadow-sm">
          List Your Business
        </Link>
        <button
            onClick={() => setIsLoginOpen(true)}
            className="text-sm font-semibold text-[#246BFD]  rounded"
        >
          Login
        </button>        
      </div>
      <div className="md:hidden">
    <button
      onClick={() => setMobileMenuOpen(prev => !prev)}
      className="p-2 rounded-md hover:bg-gray-100 focus:outline-none"
    >
      {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
    </button>
  </div>

    </nav>
      {/* Mobile Menu Dropdown */}
{/* Mobile Menu */}
{/* Mobile Menu */}
{mobileMenuOpen && (
  <div className="md:hidden mt-[60px] bg-white border-t border-[#D9E4EF] shadow-lg h-[calc(100vh-60px)] flex flex-col">
    <div className="flex-1 overflow-y-auto p-4 space-y-4">

      {/* Services Section */}
      <div>
        <p className="text-lg font-semibold mb-2">Services</p>
        <div className="space-y-2">
          {servicesData.map(cat => (
            <div key={cat.key} className="bg-gray-50 rounded-lg overflow-hidden">
              <button
                onClick={() =>
                  setOpenCategoryKey(prev => prev === cat.key ? null : cat.key)
                }
                className="w-full flex items-center justify-between p-3 hover:bg-gray-100"
              >
                <span className="flex items-center gap-2">
                  {cat.icon_url ? (
                    <img src={cat.icon_url} alt="" className="w-6 h-6 object-contain" />
                  ) : (
                    <Wrench size={20} />
                  )}
                  {cat.label}
                </span>
                {openCategoryKey === cat.key ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {/* Subcategories Accordion */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openCategoryKey === cat.key ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="p-3 space-y-2">
                  {cat.subcategories.map(sub => (
                    <button
                      key={sub.key}
                      onClick={() => {
                        router.push(`/customer/Services?type=services&subcategory=${sub.key}`);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded hover:bg-gray-200 text-sm"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Places Section */}
      <div>
        <p className="text-lg font-semibold mb-2">Places</p>
        <div className="space-y-2">
          {placesData.map(cat => (
            <div key={cat.key} className="bg-gray-50 rounded-lg overflow-hidden">
              <button
                onClick={() =>
                  setOpenCategoryKey(prev => prev === cat.key ? null : cat.key)
                }
                className="w-full flex items-center justify-between p-3 hover:bg-gray-100"
              >
                <span className="flex items-center gap-2">
                  {cat.icon_url ? (
                    <img src={cat.icon_url} alt="" className="w-6 h-6 object-contain" />
                  ) : (
                    <Wrench size={20} />
                  )}
                  {cat.label}
                </span>
                {openCategoryKey === cat.key ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
              </button>

              {/* Subcategories Accordion */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  openCategoryKey === cat.key ? 'max-h-96' : 'max-h-0'
                }`}
              >
                <div className="p-3 space-y-2">
                  {cat.subcategories.map(sub => (
                    <button
                      key={sub.key}
                      onClick={() => {
                        router.push(`/customer/Services?type=places&subcategory=${sub.key}`);
                        setMobileMenuOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded hover:bg-gray-200 text-sm"
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

    {/* Footer Buttons */}
    <div className="p-4 border-t space-y-2">
      <Link
        href="/business/signup"
        className="block text-center bg-gradient-to-r from-[#1F3B79] to-[#2E60C3] text-white font-medium px-4 py-2 rounded-xl hover:opacity-90 transition shadow-sm"
        onClick={() => setMobileMenuOpen(false)}
      >
        List Your Business
      </Link>
      <button
        onClick={() => {
          setIsLoginOpen(true);
          setMobileMenuOpen(false);
        }}
        className="block w-full text-sm font-semibold text-[#246BFD]"
      >
        Login
      </button>
    </div>
  </div>
)}


    <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
</>
  );
};

export default ServiceNav;
