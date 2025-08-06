'use client';

import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import FloatingSubmenu from '@/components/FloatingSubmenu';
import {
  ChevronDown, ChevronUp, Wrench, MapPin,
} from 'lucide-react';

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
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => setIsClient(true), []);
  const isSidebar = isClient && pathname.includes('/customer/Services');

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

  const handleSubcategoryClick = (section: 'services' | 'places', subcategoryId: string) => {
    setSelectedSubcategories(prev => {
      const updated = prev.includes(subcategoryId)
        ? prev.filter(id => id !== subcategoryId)
        : [...prev, subcategoryId];

      if (isSidebar) {
        onSelect(section, updated);
      } else {
        const query = updated.map(id => `subcategory=${id}`).join('&');
        router.push(`/customer/Services?type=${section}&${query}`);
      }

      return updated;
    });

    setFloatingAnchor(null);
    setOpenCategoryKey(null);
  };

  const renderCategories = (data: Category[], section: 'services' | 'places') => (
    <div className="space-y-1">
      {data.map(category => (
        <div key={category.key} className="relative">
          <button
            ref={el => { categoryButtonRefs.current[category.key] = el }}
            className="w-full flex items-center justify-between text-left font-semibold py-2 px-3 rounded transition bg-white hover:bg-gray-100"
            onClick={() => toggleCategory(category.key)}
          >
            <span className="flex items-center">
              {category.icon_url ? (
                <img src={category.icon_url} alt="" className="w-6 h-6 mr-2 object-contain" />
              ) : (
                <Wrench size={20} className="mr-2" />
              )}
              <p className="text-black">{category.label}</p>
            </span>
            {openCategoryKey === category.key ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>

          {openCategoryKey === category.key && floatingAnchor && (
            <FloatingSubmenu
              anchorRect={floatingAnchor}
              subcategories={category.subcategories}
              selectedSubcategory={selectedSubcategories}
              onSelect={(updatedIds) => {
                setSelectedSubcategories(updatedIds);
                if (isSidebar) {
                  onSelect(section, updatedIds);
                } else {
                  const query = updatedIds.map(id => `subcategory=${id}`).join('&');
                  router.push(`/customer/Services?type=${section}&${query}`);
                }
              }}
            />
          )}
        </div>
      ))}
    </div>
  );

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

  // 🔁 Dual-mode rendering
  return isSidebar ? (
    <div className="bg-[#F7F6F9] border-r space-y-4 p-6 min-h-screen sticky top-0 overflow-y-auto w-full z-40">
      <div className="space-y-6">
        <div>
          <button onClick={() => setOpenSection(openSection === 'services' ? null : 'services')}
            className="w-full text-left font-bold text-lg mb-2 bg-[#FFFFFF]">
            <p className="text-[#202231]">Services</p>
          </button>
          {openSection === 'services' && <div ref={servicesRef}>{renderCategories(servicesData, 'services')}</div>}
        </div>

        <div>
          <button onClick={() => setOpenSection(openSection === 'places' ? null : 'places')}
            className="w-full text-left font-bold text-lg mb-2 bg-[#FFFFFF]">
            <p className="text-[#202231]">Places</p>
          </button>
          {openSection === 'places' && <div ref={placesRef}>{renderCategories(placesData, 'places')}</div>}
        </div>
      </div>
    </div>
  ) : (
    <nav className="w-screen bg-white border-b border-[#8B9AB2] px-6 py-3 flex items-center justify-between text-[#0E1C2F]">
      <div className="flex items-center space-x-2 cursor-pointer" onClick={() => router.push('/')}>
        <img src="/logo-desi-22.png" alt="Logo" className="h-6" />
        <span className="font-bold text-xl text-[#0E1C2F]">
          DailEn<span className="text-[#246BFD]">Search</span>
        </span>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative"
             onMouseEnter={() => handleHover('services', true)}
             onMouseLeave={() => handleHover('services', false)}>
          <button className="flex items-center text-sm font-medium">
            <img src="/app.svg" alt="services" className="h-6" />
            <p className="ml-1 text-black">Services</p>
            {openSection === 'services' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {visibleSection === 'services' && (
            <div ref={servicesRef} className="absolute right-0 mt-2 w-72 bg-white border rounded-xl shadow-xl p-4 z-50">
              {renderCategories(servicesData, 'services')}
            </div>
          )}
        </div>

        <div className="relative"
             onMouseEnter={() => handleHover('places', true)}
             onMouseLeave={() => handleHover('places', false)}>
          <button className="flex items-center text-sm font-medium">
            <img src="/svg/tool.svg" alt="places" className="h-6" />
            <p className="ml-1 text-black">Places</p>
            {openSection === 'places' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {visibleSection === 'places' && (
            <div ref={placesRef} className="absolute right-0 mt-2 w-72 bg-white border rounded-xl shadow-xl p-4 z-50">
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
};

export default ServiceNav;
