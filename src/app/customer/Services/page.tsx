'use client';

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ServiceNav from '@/components/ServiceNav';
import { FaStar, FaRegStar } from 'react-icons/fa';

const StarSelector = ({ rating, onChange }: { rating: number; onChange: (val: number) => void }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onChange(i)}
          className="text-yellow-500 text-xl hover:scale-110"
        >
          {rating >= i ? <FaStar /> : <FaRegStar />}
        </button>
      ))}
    </div>
  );
};

type Booking = {
  id: string;
  note: string;
  price: number;
  booking_time: string;
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
  latitude?: number;
  longitude?: number;
  price?: number;
  bookings?: Booking[];
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
  const [note, setNote] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);

  const [bookingOptions, setBookingOptions] = useState<{ id: string; type: string; price: number; note?: string }[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get('http://localhost:8000/api/auth/profile', { withCredentials: true });
        setUserRole(res.data.user.role);
      } catch {
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

  useEffect(() => {
    if (!selectedDetail) return;
    const fetchOptions = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/details/${selectedDetail.id}/booking-options`);
        setBookingOptions(res.data || []);
        if (res.data?.[0]?.id) setSelectedOptionId(res.data[0].id);
      } catch (err) {
        console.error('Failed to fetch booking options', err);
      }
    };
    fetchOptions();
  }, [selectedDetail]);

  const handleDetailClick = async (detail: Detail | null) => {
  setSelectedDetail(detail);
  setReviews([]);
  if (!detail) return;

  try {
    await axios.post('http://localhost:8000/api/analytics/track', {
      detailId: detail.id,
      eventType: 'view'
    }, { withCredentials: true });

    const reviewRes = await axios.get(`http://localhost:8000/api/reviews/${detail.id}`, {
      withCredentials: true
    });

    const bookingOptionsRes = await axios.get(`http://localhost:8000/api/details/${detail.id}/booking-options`, {
      withCredentials: true
    });

    setReviews(reviewRes.data);
    setSelectedDetail(detail);

  } catch (err) {
    console.error('Error fetching detail or reviews', err);
  }
};


  const handleReviewSubmit = async () => {
    if (!selectedDetail) return;
    try {
      const res = await axios.post(`http://localhost:8000/api/reviews/${selectedDetail.id}`, newReview, { withCredentials: true });
      setReviews((prev) => [...prev, res.data]);
      setNewReview({ comment: '', rating: 0 });
    } catch (err) {
      console.error('Failed to submit review', err);
    }
  };

  const handleBooking = async () => {
    if (!selectedOptionId) return;
    setIsBooking(true);
    setBookingStatus(null);
    try {
      await axios.post('http://localhost:8000/api/bookings', { option_id: selectedOptionId, note }, { withCredentials: true });
      setBookingStatus('Booking successful!');
      setNote('');
    } catch (err) {
      console.error(err);
      setBookingStatus('Booking failed.');
    } finally {
      setIsBooking(false);
    }
  };

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
            <h1 className="text-2xl font-bold capitalize mb-4">Entries for {activeCategory.type}</h1>
            {loading ? (
              <p>Loading...</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {details.map((detail) => (
                  <div
                    key={detail.id}
                    className="cursor-pointer border p-4 rounded shadow hover:shadow-md"
                    onClick={() => handleDetailClick(detail)}
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
                <div className="absolute right-0 top-0 z-40 bg-white p-6 rounded-lg shadow-xl w-full max-w-md border max-h-screen overflow-y-auto">
                  <button className="absolute top-2 right-3 text-gray-700 text-xl" onClick={() => setSelectedDetail(null)}>
                    ×
                  </button>
                  <h2 className="text-xl font-bold mb-2">{selectedDetail.name}</h2>
                  <p><strong>Rating:</strong> {selectedDetail.rating ?? 'N/A'}</p>
                  <p><strong>Location:</strong> {selectedDetail.location ?? 'N/A'}</p>
                  <p><strong>Status:</strong> {selectedDetail.status ?? 'N/A'}</p>
                  <p><strong>Timings:</strong> {selectedDetail.timings ?? 'N/A'}</p>
                  <p><strong>Contact:</strong> {selectedDetail.contact ?? 'N/A'}</p>
                  <p><strong>Website:</strong> {selectedDetail.website ?? 'N/A'}</p>
                  {selectedDetail.latitude && selectedDetail.longitude && (
                    <iframe
                      title="map"
                      width="100%"
                      height="200"
                      className="my-4"
                      src={`https://maps.google.com/maps?q=${selectedDetail.latitude},${selectedDetail.longitude}&z=15&output=embed`}
                      loading="lazy"
                    ></iframe>
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

                    {userRole && (
                      <div className="mt-6 border-t pt-4">
                        <h3 className="text-lg font-bold">Book This Service</h3>
                        {bookingOptions.length === 0 ? (
                          <p className="text-sm text-gray-600">No booking options available.</p>
                        ) : (
                          <>
                            <label className="block text-sm font-medium text-gray-700 mt-2 mb-1">Select Option:</label>
                            <select
                              value={selectedOptionId}
                              onChange={(e) => setSelectedOptionId(e.target.value)}
                              className="w-full border p-2 rounded mb-3"
                            >
                              {bookingOptions.map((opt) => (
                                <option key={opt.id} value={opt.id}>
                                  {opt.type} — ₹{opt.price} {opt.note ? `(${opt.note})` : ''}
                                </option>
                              ))}
                            </select>
                            <textarea
                              placeholder="Any note for the service provider?"
                              className="w-full border p-2 my-2"
                              value={note}
                              onChange={(e) => setNote(e.target.value)}
                            />
                            <button
                              onClick={handleBooking}
                              disabled={isBooking || !selectedOptionId}
                              className="bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
                            >
                              {isBooking ? 'Booking...' : 'Book Now'}
                            </button>
                            {bookingStatus && (
                              <p className={`mt-2 text-sm ${bookingStatus.includes('failed') ? 'text-red-600' : 'text-green-600'}`}>
                                {bookingStatus}
                              </p>
                            )}
                          </>
                        )}
                      </div>
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
                        <p>You need to <a href="/customer/login" className="text-blue-600 underline">log in</a> to leave a review.</p>
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
