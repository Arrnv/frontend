'use client';

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import ServiceNav from '@/components/ServiceNav';
import { FaStar, FaRegStar } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import ClientLayout from '@/app/ClientLayout';
import {  useLoadScript } from '@react-google-maps/api';
import { gsap } from 'gsap';
import dynamic from 'next/dynamic';
import Slider from 'react-slick';
import ParamsInitializer from '@/components/ParamsInitializer';
import { Suspense } from 'react';
const MapSection = dynamic(() => import('@/components/MapSection'), { ssr: false });



const libraries: any = ['places'];

const StarSelector = ({ rating, onChange }: { rating: number; onChange: (val: number) => void }) => (
  <div className="flex gap-1">
    {[1, 2, 3, 4, 5].map((i) => (
      <button key={i} type="button" onClick={() => onChange(i)} className="text-yellow-500 text-xl hover:scale-110">
        {rating >= i ? <FaStar /> : <FaRegStar />}
      </button>
    ))}
  </div>
);

type Booking = { id: string; note: string; price: number; booking_time: string };
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
  gallery_urls?: string[];
  businesses?: {
    id: string;
    name: string;
    logo_url?: string;
  };
  detail_amenities?: {
    amenities: {
      id: string;
      name: string;
      icon_url: string;
    };
  }[];

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
const [activeCategory, setActiveCategory] = useState<{ type: string; id: string | string[] } | null>(null);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ comment: '', rating: 0 });
  const [note, setNote] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [bookingOptions, setBookingOptions] = useState<{ id: string; type: string; price: number; note?: string }[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [directions, setDirections] = useState<any>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);



  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  useEffect(() => {
    if (!drawerRef.current) return;
    if (selectedDetail) {
      drawerRef.current.style.display = 'block';
      gsap.fromTo(drawerRef.current, { x: '-100%' }, { x: 0, duration: 0.5, ease: 'power3.out' });
    } else {
      gsap.to(drawerRef.current, {
        x: '-100%',
        duration: 0.4,
        ease: 'power3.in',
        onComplete: () => {
          if (drawerRef.current) drawerRef.current.style.display = 'none';
        },
      });
    }
  }, [selectedDetail]);

  useEffect(() => {
    if (!cardRef.current || !selectedDetail) return;
    gsap.fromTo(
      cardRef.current,
      { opacity: 0, y: 40, scale: 0.98 },
      { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
    );
  }, [selectedDetail?.id]);

  useEffect(() => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
      console.log("📍 User Location:", loc);
      setUserLocation(loc);
    },
    (err) => {
      console.warn('Geolocation permission denied or unavailable', err);
      // Set fallback location (example: Pune)
      setUserLocation({ lat: 18.5204, lng: 73.8567 });
    }
  );
}, []);


  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`, { withCredentials: true });
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
      if (!selectedSubcategories.length || !type) return;
      const normalizedType = type === 'services' ? 'service' : type === 'places' ? 'place' : type;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/details/${normalizedType}?ids=${selectedSubcategories.join(',')}`
        );
        setDetails(res.data);
      } catch (err) {
        console.error('❌ Failed to fetch details for multiple subcategories:', err);
      }
    };

    fetchDetails();
  }, [activeCategory]);


  useEffect(() => {
    if (!selectedDetail) return;
    const fetchOptions = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/details/${selectedDetail.id}/booking-options`);
        setBookingOptions(res.data || []);
        if (res.data?.[0]?.id) setSelectedOptionId(res.data[0].id);
      } catch (err) {
        console.error('Failed to fetch booking options', err);
      }
    };
    fetchOptions();
  }, [selectedDetail]);

  useEffect(() => {
    if (userLocation && selectedDetail?.latitude && selectedDetail?.longitude) {
      const directionsService = new google.maps.DirectionsService();
      directionsService.route(
        {
          origin: userLocation,
          destination: { lat: selectedDetail.latitude, lng: selectedDetail.longitude },
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (result, status) => {
          if (status === 'OK') setDirections(result);
          else console.error(`Directions request failed due to ${status}`);
        }
      );
    }
  }, [userLocation, selectedDetail]);

  const handleDetailClick = async (detail: Detail | null) => {
    setSelectedDetail(detail);
    setReviews([]);
    if (!detail) return;
    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/track`, { detailId: detail.id, eventType: 'view' }, { withCredentials: true });
      const reviewRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${detail.id}`, { withCredentials: true });
      setReviews(reviewRes.data);
    } catch (err) {
      console.error('Error fetching detail or reviews', err);
    }
  };

  const handleReviewSubmit = async () => {
    if (!selectedDetail) return;
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${selectedDetail.id}`, newReview, { withCredentials: true });
      setReviews((prev) => [...prev, res.data]);
      setNewReview({ comment: '', rating: 0 });
    } catch (err) {
      console.error('Failed to submit review', err);
    }
  };

  const handleBooking = async () => {
    if (!selectedOptionId || !selectedDetail) return;
    setIsBooking(true);
    setBookingStatus(null);
    try {
      // Optional: track click
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/analytics/track`, {
        detailId: selectedDetail.id,
        eventType: 'click',
      }, { withCredentials: true });

      // Create Stripe Checkout session
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/create-checkout-session`,
        { option_id: selectedOptionId, note },
        { withCredentials: true }
      );

      const { url } = res.data;

      if (url) {
        window.location.href = url; 
      } else {
        setBookingStatus('Error: Invalid session URL');
      }

    } catch (err) {
      console.error(err);
      setBookingStatus('Booking failed.');
    } finally {
      setIsBooking(false);
    }
  };


return (
  <ClientLayout>
    <div className="flex h-screen bg-[#0E1C2F]">
      <Navbar />
      <div className="flex flex-1 overflow-visible">
        <div className="w-1/5 bg-gradient-to-b from-[#1F3B79] to-[#2E60C3] border-r border-[#2E60C3]/60">
        <ServiceNav
          selectedCategory={null}
          onSelect={(type, ids) => {
            const firstId = Array.isArray(ids) ? ids[0] : ids;
            setActiveCategory({ type, id: firstId });
            setSelectedSubcategories(ids);
            handleDetailClick(null);
          }}
        />


        </div>
<Suspense fallback={null}>
  <ParamsInitializer
    onInit={(type, subcategory) => {
      if (!activeCategory) {
        setActiveCategory({ type, id: subcategory });
        setSelectedSubcategories([subcategory]);
        handleDetailClick(null);
      }
    }}
  />
</Suspense>
        {/* Main Content */}
        <div className="w-2/5 p-6 overflow-y-auto relative">
          {activeCategory ? (
            <>
              <h1 className="text-2xl font-bold capitalize mb-4 text-[#FFFFFF]">
                Entries for {activeCategory.type}
              </h1>
              {loading ? (
                <p>Loading...</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {details.map((detail) => (
                    <div
                      key={detail.id}
                      className="cursor-pointer p-4 rounded-2xl bg-white/10 border border-[#415CBB] backdrop-blur-lg hover:scale-105 transform transition duration-300"
                      onClick={() => handleDetailClick(detail)}
                    >
                      {/* ✅ Show logo if available */}
                      {detail.businesses?.logo_url && (
                        <img
                          src={detail.businesses.logo_url}
                          alt="Business logo"
                          className="w-10 h-10 mb-2 rounded-full object-cover border border-white"
                        />
                      )}
                      <h2 className="font-semibold text-white">{detail.name}</h2>
                      <p className="text-sm text-[#8B9AB2]">Rating: {detail.rating ?? 'N/A'}</p>
                      <p className="text-sm text-[#8B9AB2]">Status: {detail.status ?? 'N/A'}</p>
                      
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div>
              <h1 className="text-xl font-bold text-white">Welcome, customer!</h1>
              <p className="text-[#8B9AB2]">Select a category to get started.</p>
            </div>
          )}

          {/* Drawer */}
          <div
            ref={drawerRef}
            className="absolute top-0 left-0 w-full h-full bg-[#1B2944] text-white p-6 shadow-2xl overflow-y-auto rounded-r-2xl z-50 border border-[#2E60C3]/60"
          >
            <button className="absolute top-3 right-4 text-xl" onClick={() => setSelectedDetail(null)}>
              ×
            </button>

            {selectedDetail && (
              <>
                {/* ✅ Show logo in drawer */}
                {selectedDetail.businesses?.logo_url && (
                  <img
                    src={selectedDetail.businesses.logo_url}
                    alt="Business logo"
                    className="w-16 h-16 mb-4 rounded-full object-cover border border-white"
                  />
                )}
                <h2 className="text-xl font-bold mb-2">{selectedDetail.name}</h2>
                <p><strong>Rating:</strong> {selectedDetail.rating ?? 'N/A'}</p>
                <p><strong>Location:</strong> {selectedDetail.location ?? 'N/A'}</p>
                <p><strong>Status:</strong> {selectedDetail.status ?? 'N/A'}</p>
                <p><strong>Timings:</strong> {selectedDetail.timings ?? 'N/A'}</p>
                <p><strong>Contact:</strong> {selectedDetail.contact ?? 'N/A'}</p>
                {selectedDetail.gallery_urls && selectedDetail.gallery_urls.length > 0 && (
                  <div className="mb-4 ">
                    <div className="relative h-[15rem] bg-no-repeat  overflow-hidden rounded-xl border border-white/20 ">
                      <Slider
                        dots={true}
                        infinite={true}
                        speed={500}
                        slidesToShow={1}
                        slidesToScroll={1}
                      >
                        {selectedDetail.gallery_urls.map((url, idx) => (
                          <div key={idx} className="w-full h-60">
                            <img
                              src={url}
                              alt={`Gallery image ${idx + 1}`}
                              className="w-full h-full bg-no-repeat "
                            />
                          </div>
                        ))}
                      </Slider>
                    </div>
                  </div>
                )}


                <p>
                  <strong>Website:</strong>{' '}
                  <a
                    href={selectedDetail.website ?? '#'}
                    target="_blank"
                    className="text-blue-600"
                    onClick={async () => {
                      try {
                        await axios.post(
                          `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/track`,
                          { detailId: selectedDetail.id, eventType: 'click' },
                          { withCredentials: true }
                        );
                      } catch (err) {
                        console.error('Failed to track website click', err);
                      }
                    }}
                  >
                    {selectedDetail.website}
                  </a>
                </p>

                  {Array.isArray(selectedDetail?.detail_amenities) && selectedDetail.detail_amenities.length > 0 && (
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-2">Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {selectedDetail.detail_amenities.map(({ amenities }) => (
                          <div
                            key={amenities.id}
                            className="flex flex-col items-center  gap-2 px-3 py-1 border border-white/20 rounded-xl bg-white text-sm text-black w-[7rem] h-[6rem]"
                          >
                            {amenities.icon_url && (
                              <img
                                src={amenities.icon_url}
                                alt={amenities.name}
                                className="w-[3rem] h-[3rem] object-contain"
                              />
                            )}
                            {amenities.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                {/* Navigate button */}
                {selectedDetail.latitude && selectedDetail.longitude && (
                  <a
                    href={`https://www.google.com/maps/dir/?api=AIzaSyB0zwhBlkBl8bfOlsXGm5TBWuheeoTLa9w&destination=${selectedDetail.latitude},${selectedDetail.longitude}&travelmode=driving`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-3 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Navigate with Google Maps
                  </a>
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
                      <h3 className="text-lg font-semibold">Public Reviews</h3>
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
                      <button className="bg-blue-600 text-white px-4 py-2 rounded mt-2" onClick={handleReviewSubmit}>
                        Submit Review
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2 text-sm text-yellow-800">
                      <p>You need to <a href="/customer/login" className="text-blue-600 underline">log in</a> to leave a review.</p>
                    </div>
                  )}
                </div>
                </>
                )}
              </div>
            
          </div>

          <div className="w-2/5 border-l border-[#415CBB]/60">
           {userLocation ? (
              <MapSection origin={userLocation} details={details} selectedDetail={selectedDetail} />
            ) : (
              <div className="flex items-center justify-center h-full text-[#8B9AB2]">Loading map...</div>
            )}

          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default Page;
