'use client';
import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { gsap } from 'gsap';
import { useGSAP } from '@gsap/react';
import { useRouter } from 'next/navigation';

type SubCategory = { key: string; label: string };
type Category = {
  key: string;
  label: string;
  icon: string;
  subcategories: SubCategory[];
};

type ServiceNavProps = {
  selectedCategory: string | null;
  onSelect: (section: 'services' | 'places', subcategoryId: string) => void;
};


const ServiceNav: React.FC<ServiceNavProps> = ({ selectedCategory, onSelect}) => {
  const [servicesData, setServicesData] = useState<Category[]>([]);
  const [placesData, setPlacesData] = useState<Category[]>([]);
  const [openSection, setOpenSection] = useState<'services' | 'places' | null>(null);
  const [visibleSection, setVisibleSection] = useState<'services' | 'places' | null>(null);
  const [openCategoryKey, setOpenCategoryKey] = useState<string | null>(null);

  const servicesRef = useRef<HTMLDivElement | null>(null);
  const placesRef = useRef<HTMLDivElement | null>(null);
  const submenuRef = useRef<HTMLUListElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [servicesRes, placesRes] = await Promise.all([
          axios.get('http://localhost:8000/api/services'),
          axios.get('http://localhost:8000/api/places'),
        ]);

        const services: Category[] = (servicesRes.data.data || []).map((service: any) => ({
          key: service.id,
          label: service.label,
          icon: 'Wrench',
          subcategories: (service.subcategories || []).map((cat: any) => ({
            key: cat.id,
            label: cat.label,
          })),
        }));

        const places: Category[] = (placesRes.data.data || []).map((place: any) => ({
          key: place.id,
          label: place.label,
          icon: 'MapPin',
          subcategories: (place.subcategories || []).map((cat: any) => ({
            key: cat.id,
            label: cat.label,
          })),
        }));
        console.log("Services response:", servicesRes.data.data);
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
  };

  const toggleCategory = (key: string) => {
    setOpenCategoryKey(prev => (prev === key ? null : key));
  };

  useGSAP(() => {
    if (submenuRef.current) {
      gsap.fromTo(submenuRef.current, { opacity: 0, y: -10 }, { opacity: 1, y: 0, duration: 0.1 });
    }
  }, [openCategoryKey]);

  useGSAP(() => {
    const ref = openSection === 'services' ? servicesRef.current : placesRef.current;
    if (ref) {
      gsap.fromTo(ref, { opacity: 0, y: -10, height: 0 }, { opacity: 1, y: 0, height: 'auto', duration: 0.2 });
    }
  }, [openSection]);

  const handleSubcategoryClick = (section: 'services' | 'places', subcategoryId: string) => {
    onSelect(section, subcategoryId); // 👈 Replace router.push
    };



  const renderCategories = (data: Category[], sectionKey: 'services' | 'places') => (
    <ul className="pl-2 space-y-2">
      {data.map(category => (
        <li key={category.key}>
          <button
            className={`w-full text-left font-semibold py-1 ${
              selectedCategory === category.key ? 'text-blue-700' : ''
            }`}
            onClick={() => toggleCategory(category.key)}
          >
            {category.label}
          </button>

          {openCategoryKey === category.key && (
            <ul ref={submenuRef} className="pl-4 mt-1 space-y-2">
              {category.subcategories.map(sub => (
                <li key={sub.key}>
                  <button
                    className="text-sm font-medium text-left"
                    onClick={() => handleSubcategoryClick(sectionKey, sub.key)}
                  >
                    {sub.label}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <aside className="w-64 bg-white border-r p-4 space-y-4">
      <button onClick={() => toggleSection('services')} className="w-full text-left font-bold">
        Services
      </button>
      {visibleSection === 'services' && <div ref={servicesRef}>{renderCategories(servicesData, 'services')}</div>}
      <button onClick={() => toggleSection('places')} className="w-full text-left font-bold">
        Places
      </button>
      {visibleSection === 'places' && <div ref={placesRef}>{renderCategories(placesData, 'places')}</div>}
    </aside>
  );
};

export default ServiceNav;
