'use client'
import React, { useRef, useState } from 'react'
import servicesData from '../services.json'
import placesData from '../places.json'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'

// Define prop types
type ServiceNavProps = {
  onSelect: (sectionKey: string, itemId: string) => void;
  selectedCategory: string | null;
};

const ServiceNav: React.FC<ServiceNavProps> = ({ onSelect, selectedCategory }) => {
  const [openSection, setOpenSection] = useState<'services' | 'places' | null>(null);
  const [visibleSection, setVisibleSection] = useState<'services' | 'places' | null>(null);
  const [openCategoryKey, setOpenCategoryKey] = useState<string | null>(null);
  const submenuRef = useRef<HTMLUListElement | null>(null);
  const servicesRef = useRef<HTMLDivElement | null>(null);
  const placesRef = useRef<HTMLDivElement | null>(null);


  const toggleSection = (section: 'services' | 'places') => {
        if (openSection === section) {
            // Animate closing
            if (section === 'services' && servicesRef.current) {
            gsap.to(servicesRef.current, {
                opacity: 0,
                y: -10,
                height: 0,
                duration: 0.5,
                ease: 'power2.in',
                onComplete: () => {
                setOpenSection(null);
                setVisibleSection(null);
                }
            });
            } else if (section === 'places' && placesRef.current) {
            gsap.to(placesRef.current, {
                opacity: 0,
                y: -10,
                height: 0,
                duration: 0.5,
                ease: 'power2.in',
                onComplete: () => {
                setOpenSection(null);
                setVisibleSection(null);
                }
            });
            }
        } else {
            // Open new section
            setVisibleSection(section);
            setOpenSection(section);
        }

        setOpenCategoryKey(null); // collapse category list
        };


  const toggleCategory = (key: string) => {
    setOpenCategoryKey(prev => (prev === key ? null : key));
  };

  useGSAP(() => {
    if (submenuRef.current) {
      gsap.fromTo(
        submenuRef.current,
        { opacity: 0, y: -10 },
        { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }
      );
    }
  }, [openCategoryKey]);
  useGSAP(() => {
    if (openSection === 'services' && servicesRef.current) {
        gsap.fromTo(
        servicesRef.current,
        { opacity: 0, y: -10, height: 0 },
        { opacity: 1, y: 0, height: 'auto', duration: 0.5, ease: 'power2.out' }
        );
    } else if (openSection === 'places' && placesRef.current) {
        gsap.fromTo(
        placesRef.current,
        { opacity: 0, y: -10, height: 0 },
        { opacity: 1, y: 0, height: 'auto', duration: 0.5, ease: 'power2.out' }
        );
    }
    }, [openSection]);

  const renderCategory = (
    data: typeof servicesData | typeof placesData,
    sectionKey: 'services' | 'places'
  ) => (
    <ul className="pl-4 space-y-2 mt-2 relative">
      {data.map((category) => (
        <li key={category.key}>
          <button className="text-xl" onClick={() => toggleCategory(category.key)}>
            {category.label}
          </button>
          {openCategoryKey === category.key && (
            <ul ref={submenuRef} className="text-sm absolute border ml-[8rem] bg-white shadow p-2 rounded">
              {category.items.map((item) => (
                <li
                  key={item.id}
                  onClick={() => onSelect(category.key, item.id)}
                  className="cursor-pointer hover:bg-blue-100 p-1 rounded"
                >
                  {item.name}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <nav className="p-4 space-y-4 border w-[10rem] h-screen ">
        <div>
            <button onClick={() => toggleSection('services')} className="text-2xl">
                {openSection === 'services' ? '▼' : '▶'} Services
            </button>
            {visibleSection === 'services' && (
                <div ref={servicesRef}>
                {renderCategory(servicesData, 'services')}
                </div>
            )}
        </div>

        <div className="text-2xl">
            <button onClick={() => toggleSection('places')}>
                {openSection === 'places' ? '▼' : '▶'} Places
            </button>
            {visibleSection === 'places' && (
                <div ref={placesRef}>
                {renderCategory(placesData, 'places')}
                </div>
            )}
        </div>


    </nav>
  );
};

export default ServiceNav;
