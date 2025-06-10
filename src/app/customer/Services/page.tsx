'use client';

import React, { useState } from 'react';
import ServiceNav from '@/components/ServiceNav';
import DetailPanel from '@/components/DetailPanel';
import { AnimatePresence } from 'framer-motion';
import data from '@/details.json';
import Navbar from '@/components/Navbar';

const Page = () => {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedSection, setSelectedSection] = useState<string | null>(null);
  const [selectedId2, setSelectedId2] = useState<string | null>(null);

  const handleSelect = (sectionKey: string, itemId: string) => {
    setSelectedSection(sectionKey);
    setSelectedId(itemId);
    const relatedItems = data.filter((d) => d.id === itemId);
    // if (relatedItems.length > 0) {
    //   setSelectedId2(relatedItems[0].id2); // default to first
    // } else {
    //   setSelectedId2(null);
    // }
  };

  const relatedItems = data.filter((item) => item.id === selectedId);
  const selectedItem = data.find((item) => item.id === selectedId && item.id2 === selectedId2);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <div className="flex">
        <ServiceNav onSelect={handleSelect} selectedCategory={selectedSection} />
        <main className="flex-1 p-4 space-y-4">
          {/* Secondary selection buttons */}
          {relatedItems.length > 1 && (
            <div className="flex gap-4 flex-wrap">
              {relatedItems.map((item) => (
                <button
                  key={item.id2}
                  onClick={() => setSelectedId2(item.id2)}
                  className={`p-3 border rounded shadow-sm ${
                    item.id2 === selectedId2 ? 'bg-blue-100 border-blue-500' : 'bg-white'
                  }`}
                >
                  <div className="text-lg font-semibold">{item.name}</div>
                  <div className="text-sm text-gray-600">Rating: {item.rating}</div>
                  <div className="text-xs italic text-gray-500">{item.category}</div>
                </button>
              ))}
            </div>
          )}

          <AnimatePresence>
            {selectedItem && (
              <DetailPanel
                key={selectedItem.id2}
                service={selectedItem}
                onClose={() => {
                  setSelectedId(null);
                  setSelectedId2(null);
                }}
              />
            )}
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default Page;
