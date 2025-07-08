'use client';

import React, { JSX, useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import { useRouter, usePathname } from 'next/navigation';
import FloatingSubmenu from '@/components/FloatingSubmenu';
import {
  ChevronDown,
  ChevronUp,
  Wrench,
  MapPin,
  Car,
  Hammer,
  Bed,
  Briefcase,
  Utensils,
  HeartPulse,
  GraduationCap,
  Building,
  Home,
  BookOpen,
  LogIn
} from 'lucide-react';

// Type definitions

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
  onSelect: (section: 'services' | 'places', subcategoryId: string) => void;
};

const ServiceNav: React.FC<ServiceNavProps> = ({ selectedCategory, onSelect }) => {
  const [servicesData, setServicesData] = useState<Category[]>([]);
  const [placesData, setPlacesData] = useState<Category[]>([]);
  const [openSection, setOpenSection] = useState<'services' | 'places' | null>(null);
  const [visibleSection, setVisibleSection] = useState<'services' | 'places' | null>(null);
  const [openCategoryKey, setOpenCategoryKey] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);

  const servicesRef = useRef<HTMLDivElement | null>(null);
  const placesRef = useRef<HTMLDivElement | null>(null);
  const selectedSubRef = useRef<HTMLButtonElement | null>(null);
  const categoryButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  const [floatingAnchor, setFloatingAnchor] = useState<DOMRect | null>(null);

  const router = useRouter();
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const isSidebar = isClient && pathname.includes('/Service');

  const iconMap: Record<string, JSX.Element> = {
    Wrench: <Wrench size={16} className="inline-block mr-2" />,
    MapPin: <MapPin size={16} className="inline-block mr-2" />,
    Car: <Car size={16} className="inline-block mr-2" />,
    Hammer: <Hammer size={16} className="inline-block mr-2" />,
    Bed: <Bed size={16} className="inline-block mr-2" />,
    Briefcase: <Briefcase size={16} className="inline-block mr-2" />,
    Utensils: <Utensils size={16} className="inline-block mr-2" />,
    HeartPulse: <HeartPulse size={16} className="inline-block mr-2" />,
    GraduationCap: <GraduationCap size={16} className="inline-block mr-2" />,
    Building: <Building size={16} className="inline-block mr-2" />,
  };

  const navItems = [
    { name: 'Home', href: '/customer/Home', icon: Home },
    { name: 'My Bookings', href: '/customer/my-bookings', icon: BookOpen },
    { name: 'Login', href: '/customer/login', icon: LogIn },
    { name: 'Signup', href: '/customer/Signup', icon: LogIn },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, placesRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/services`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/places`),
        ]);
        const services: Category[] = (servicesRes.data.data || []).map((service: any) => ({
          key: service.id,
          label: service.label,
          icon: service.icon || 'Wrench', // fallback icon key (not used now, but kept for future)
          icon_url: service.icon_url || '', // ✅ main source now
          subcategories: (service.subcategories || []).map((cat: any) => ({
            key: cat.id,
            label: cat.label,
          })),
        }));

        const places: Category[] = (placesRes.data.data || []).map((place: any) => ({
          key: place.id,
          label: place.label,
          icon: 'MapPin',
          icon_url: place.icon_url || '', // ✅ pulled from places table
          subcategories: (place.subcategories || []).map((cat: any) => ({
            key: cat.id,
            label: cat.label,
          })),
        }));

        setServicesData(services);
        setPlacesData(places);
      } catch (err) {
        console.error("🔥 Axios fetch error:", err);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!selectedCategory) return;
    const match =
      servicesData.find(cat => cat.key === selectedCategory) ||
      placesData.find(cat => cat.key === selectedCategory);

    if (match) {
      const section = servicesData.includes(match) ? 'services' : 'places';
      setVisibleSection(section);
      setOpenSection(section);
      setOpenCategoryKey(selectedCategory);
    }
  }, [selectedCategory, servicesData, placesData]);

  const toggleSection = (section: 'services' | 'places') => {
    if (openSection === section) {
      const ref = section === 'services' ? servicesRef.current : placesRef.current;
      if (ref) {
        gsap.to(ref, {
          opacity: 0,
          y: -10,
          height: 0,
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => {
            setOpenSection(null);
            setVisibleSection(null);
          },
        });
      }
    } else {
      setVisibleSection(section);
      setOpenSection(section);
    }
    setOpenCategoryKey(null);
    setFloatingAnchor(null);
  };

  const toggleCategory = (key: string) => {
    setOpenCategoryKey(prev => {
      if (prev === key) {
        setFloatingAnchor(null);
        return null;
      }
      const button = categoryButtonRefs.current[key];
      if (button) setFloatingAnchor(button.getBoundingClientRect());
      return key;
    });
  };

  useGSAP(() => {
    const ref = openSection === 'services' ? servicesRef.current : placesRef.current;
    if (ref) {
      gsap.fromTo(ref, { opacity: 0, y: -10, height: 0 }, { opacity: 1, y: 0, height: 'auto', duration: 0.2 });
    }
  }, [openSection]);

  const handleSubcategoryClick = (section: 'services' | 'places', subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
    setFloatingAnchor(null);           
    setOpenCategoryKey(null);         

    if (isSidebar) {
      onSelect(section, subcategoryId);  
    } else {
      router.push(`/customer/Services?type=${section}&subcategory=${subcategoryId}`); // 🔁 Nav route
    }
  };


  useEffect(() => {
    if (selectedSubRef.current) {
      selectedSubRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [selectedSubcategory]);

  const renderCategories = (data: Category[], sectionKey: 'services' | 'places') => (
    <div className="space-y-1">
      {data.map(category => (
        <div key={category.key} className="relative">
          <button
            ref={el => {
              categoryButtonRefs.current[category.key] = el;
            }}
            className={`w-full flex items-center justify-between text-left font-semibold py-2 px-3 rounded transition bg-white hover:bg-gray-100 ${
              selectedCategory === category.key ? 'text-[#246BFD]' : ''
            }`}
            onClick={() => toggleCategory(category.key)}
          >

            <span className="flex items-center">
              {/* ✅ Dynamically render from DB icon_url or fallback */}
              {category.icon_url ? (
                <img
                  src={category.icon_url}
                  alt=""
                  className="w-6 h-6 mr-2 object-contain"
                />
              ) : (
                <Wrench size={20} className="mr-2 " />
              )}


              <p className='text-black '>{category.label}</p>
            </span>

            {openCategoryKey === category.key ? (
              <ChevronUp size={16} className="ml-1" />
            ) : (
              <ChevronDown size={16} className="ml-1" />
            )}
          </button>

          {openCategoryKey === category.key && floatingAnchor && (
            <FloatingSubmenu
              anchorRect={floatingAnchor}
              subcategories={category.subcategories}
              selectedSubcategory={selectedSubcategory}
              onSelect={(subcategoryId) => handleSubcategoryClick(sectionKey, subcategoryId)}
            />
          )}
        </div>
      ))}

    </div>
  );

return isSidebar ? (
  <div className="bg-[#0E1C2F] border-r space-y-4 p-6 min-h-screen sticky top-0 overflow-y-auto w-72 z-40 shadow-md overflow-x-hidden">
    <div className="space-y-6">
      <div>
        <button
          onClick={() => toggleSection('services')}
          className="w-full text-left font-bold text-lg mb-2  bg-transparent hover:text-[#246BFD]"
        >
          <p className='text-black'>Services</p>
        </button>
        {visibleSection === 'services' && <div ref={servicesRef}>{renderCategories(servicesData, 'services')}</div>}
      </div>

      <div>
        <button
          onClick={() => toggleSection('places')}
          className="w-full text-left font-bold text-lg mb-2"
        >
          Places
        </button>
        {visibleSection === 'places' && <div ref={placesRef}>{renderCategories(placesData, 'places')}</div>}
      </div>
    </div>
  </div>

) : (
  // ✅ Top navbar view
<nav className="w-full bg-white border-b border-[#8B9AB2] px-6 py-3 flex items-center justify-between text-[#0E1C2F]">
  {/* Left: Logo */}
  <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
    <img src="/logo.svg" alt="Logo" className="h-6" />
    <span className="font-bold text-xl text-[#0E1C2F]">TRUCKER<span className="text-[#246BFD]">GUIDE</span></span>
  </div>

  {/* Center: Dropdowns */}

  <div className="flex items-center space-x-4">
      <div className="relative">
      <button
        onClick={() => toggleSection('services')}
        className="flex items-center text-sm font-medium "
      >
        <img src="/app.svg" alt="Logo" className="h-6 text-white" />
        <p className='text-black'>Services</p>
        {openSection === 'services' ? (
          <ChevronUp size={16} className="ml-1" />
        ) : (
          <ChevronDown size={16} className="ml-1" />
        )}
      </button>

      {/* Dropdown container */}
      {visibleSection === 'services' && (
        <div
          ref={servicesRef}
          className="absolute right-0 mt-2 w-72  border rounded-xl shadow-xl p-4 z-50"
        >
          {renderCategories(servicesData, 'services')}
        </div>
      )}
    </div>

    <div className="relative">
      <button
        onClick={() => toggleSection('places')}
        className="flex items-center text-sm font-medium hover:text-[#246BFD] text-[#0E1C2F]"
      >
        <img src="/svg/tool.svg" alt="Logo" className="h-6 text-white" />
        <p className='text-black'>Places</p>
        {openSection === 'places' ? (
          <ChevronUp size={16} className="ml-1" />
        ) : (
          <ChevronDown size={16} className="ml-1" />
        )}
      </button>

      {/* Dropdown container */}
      {visibleSection === 'places' && (
        <div
          ref={placesRef}
          className="absolute right-0 mt-2 w-72 bg-white border rounded-xl shadow-xl p-4 z-50"
        >
          {renderCategories(placesData, 'places')}
        </div>
      )}
    </div>
    <Link href="/business/signup" className="bg-gradient-to-r from-[#1F3B79] to-[#2E60C3] text-white font-medium px-4 py-2 rounded-xl hover:opacity-90 transition shadow-sm">
      List Your Business
    </Link>
    <Link href="/login" className="text-sm font-semibold text-[#0E1C2F] hover:text-[#246BFD]">Log In</Link>
    <Link href="/signup" className="text-sm font-semibold text-[#246BFD] hover:underline">Sign Up</Link>
  </div>
</nav>

);

}
export default ServiceNav;
