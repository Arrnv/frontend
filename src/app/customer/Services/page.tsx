'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ServiceNav from '@/components/ServiceNav';
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const StarSelector = ({ rating, onChange }: { rating: number; onChange: (val: number) => void }) => {
  const handleClick = (index: number) => onChange(index);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => handleClick(i)}
          className="text-yellow-500 text-xl hover:scale-110"
        >
          {rating >= i ? <FaStar /> : <FaRegStar />}
        </button>
      ))}
    </div>
  );
};

type JWTUser = {
  email: string;
  fullName: string;
  role: 'visitor' | 'business_owner' | 'admin';
  exp: number;
};

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

type Review = {
  id: string;
  user_id: string;
  full_name?: string;
  comment: string;
  rating: number;
};

const Page = () => {
  const [details, setDetails] = useState<Detail[]>([]);
  const [selectedDetail, setSelectedDetail] = useState<Detail | null>(null);
  const [activeCategory, setActiveCategory] = useState<{ type: string; id: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ comment: '', rating: 0 });

  const handleDetailClick = async (detail: Detail | null) => {
    setSelectedDetail(detail);
    setReviews([]);

    if (!detail) return;

    try {
      await axios.post('http://localhost:8000/api/analytics/track', {
        detailId: detail.id,
        eventType: 'view',
      }, { withCredentials: true });

      const reviewRes = await axios.get(`http://localhost:8000/api/reviews/${detail.id}`, {
        withCredentials: true,
      });
      setReviews(reviewRes.data);
    } catch (err) {
      console.error('Error fetching detail or reviews', err);
    }
  };

  const handleReviewSubmit = async () => {
    if (!selectedDetail) return;

    try {
      const response = await axios.post(
        `http://localhost:8000/api/reviews/${selectedDetail.id}`,
        newReview,
        { withCredentials: true }
      );
      setReviews((prev) => [...prev, response.data]);
      setNewReview({ comment: '', rating: 0 });
    } catch (err) {
      console.error('Failed to submit review', err);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/auth/profile', {
          withCredentials: true,
        });
        setUserRole(res.data.user.role);
      } catch (err) {
        console.log('User not logged in or token invalid');
        setUserRole(null);
      }
    };

    fetchProfile();
  }, []);

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
      <ServiceNav
        selectedCategory={null}
        onSelect={(type, id) => {
          setActiveCategory({ type, id });
          handleDetailClick(null);
        }}
      />

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
                    onClick={async () => {
                      handleDetailClick(detail);
                      try {
                        await axios.post('http://localhost:8000/api/analytics/track', {
                          detailId: detail.id,
                          eventType: 'click',
                        }, { withCredentials: true });
                      } catch (err) {
                        console.error('Failed to track click', err);
                      }
                    }}
                  >
                    <h2 className="font-semibold">{detail.name}</h2>
                    <p className="text-sm text-gray-600">
                      Rating: {detail.rating ?? 'N/A'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Status: {detail.status ?? 'N/A'}
                    </p>
                  </div>
                ))}
              </div>
            )}

            {selectedDetail && (
              <div className="relative">
                <div className="absolute right-0 top-0 z-40 bg-white p-6 rounded-lg shadow-xl w-full max-w-md border max-h-screen overflow-y-auto">
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
                  <p><strong>Website:</strong> {selectedDetail.website ?? 'N/A'}</p>
                  {Array.isArray(selectedDetail.tags) && selectedDetail.tags.length > 0 && (
                    <p><strong>Tags:</strong> {selectedDetail.tags.join(', ')}</p>
                  )}

                  <div className="mt-4">
                    <h3 className="text-lg font-semibold">Reviews</h3>
                    {reviews.length > 0 ? (
                      reviews.map((r, index) => (
                        <div key={r.id || `${r.user_id}-${index}`} className="border-b py-2">
                          <p className="font-semibold">{r.full_name || r.user_id}</p>
                          <p>Rating: {r.rating}</p>
                          <p>{r.comment}</p>
                        </div>
                      ))

                    ) : (
                      <p className="text-gray-600">No reviews yet.</p>
                    )}

                    {userRole ? (
                      <div className="mt-4">
                        <textarea
                          value={newReview.comment}
                          onChange={(e) => setNewReview((prev) => ({ ...prev, comment: e.target.value }))}
                          className="w-full border p-2 mb-2"
                          placeholder="Leave a comment"
                        />
                        <StarSelector
                          rating={newReview.rating}
                          onChange={(val) => setNewReview((prev) => ({ ...prev, rating: val }))}
                        />
                        <button
                          onClick={handleReviewSubmit}
                          className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
                        >
                          Submit Review
                        </button>
                      </div>
                    ) : (
                      <div className="mt-2 text-sm text-yellow-800">
                        <p>
                          You need to <a href="/customer/login" className="text-blue-600 underline">log in</a> to leave a review.
                        </p>
                      </div>
                    )}
                  </div>
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
