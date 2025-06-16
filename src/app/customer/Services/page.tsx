'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ServiceNav from '@/components/ServiceNav';

type Detail = {
  id: string;
  name: string;
  rating?: number;
  location?: string;
  status?: string;
  timings?: string;
  contact?: string;
  website?: string;
  tags?: string[];
};

const Page = () => {
  const [details, setDetails] = useState<Detail[]>([]);
  const [selectedDetail, setSelectedDetail] = useState<Detail | null>(null);
  const [activeCategory, setActiveCategory] = useState<{ type: string; id: string } | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!activeCategory) return;

    const { type, id } = activeCategory;
    const normalizedType = type === 'services' ? 'service' : type === 'places' ? 'place' : type;

    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await axios.get(`http://localhost:8000/api/details/${normalizedType}/${id}`);
        setDetails(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [activeCategory]);

  return (
    <div className="flex">
      {/* Sidebar Navigation */}
      <ServiceNav
        selectedCategory={null}
        onSelect={(type, id) => {
          setActiveCategory({ type, id });
          setSelectedDetail(null);
        }}
      />

      {/* Main content */}
      <div className="flex-1 p-6">
        {activeCategory ? (
          <>
            <h1 className="text-2xl font-bold capitalize mb-4">
              Entries for {activeCategory.type}
            </h1>

            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {details.map((detail) => (
                  <div
                    key={detail.id}
                    className="cursor-pointer border p-4 rounded shadow hover:shadow-md"
                    onClick={() => setSelectedDetail(detail)}
                  >
                    <h2 className="font-semibold">{detail.name}</h2>
                    <p className="text-sm text-gray-600">Rating: {detail.rating ?? 'N/A'}</p>
                    <p className="text-sm text-gray-600">Status: {detail.status ?? 'N/A'}</p>
                  </div>
                ))}
              </div>
            )}

        
            {selectedDetail && (
            <div className="relative">
                <div className="absolute right-0 top-0 z-40 bg-white p-6 rounded-lg shadow-xl w-full max-w-md border">
                <button
                    className="absolute top-2 right-3 text-gray-700 text-xl"
                    onClick={() => setSelectedDetail(null)}
                >
                    ×
                </button>
                <h2 className="text-xl font-bold mb-2">{selectedDetail.name}</h2>
                <p><strong>Rating:</strong> {selectedDetail.rating ?? 'N/A'}</p>
                <p><strong>Location:</strong> {selectedDetail.location ?? 'N/A'}</p>
                <p><strong>Status:</strong> {selectedDetail.status ?? 'N/A'}</p>
                <p><strong>Timings:</strong> {selectedDetail.timings ?? 'N/A'}</p>
                <p><strong>Contact:</strong> {selectedDetail.contact ?? 'N/A'}</p>
                <p>
                    <strong>Website:</strong>{' '}
                    {selectedDetail.website ? (
                    <a href={selectedDetail.website} className="text-blue-600 underline" target="_blank" rel="noreferrer">
                        {selectedDetail.website}
                    </a>
                    ) : (
                    'N/A'
                    )}
                </p>
                {(() => {
                const tags = selectedDetail.tags;
                return tags && tags.length > 0 ? (
                    <p>
                    <strong>Tags:</strong> {tags.join(', ')}
                    </p>
                ) : null;
                })()}
                </div>
            </div>
            )}

          </>
        ) : (
          <>
            <h1 className="text-xl font-bold">Welcome, customer!</h1>
            <p>Select a category to get started.</p>
          </>
        )}
      </div>
    </div>
  );
};

export default Page;
