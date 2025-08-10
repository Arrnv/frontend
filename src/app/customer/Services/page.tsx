'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import axios from 'axios';
import { useLoadScript } from '@react-google-maps/api';
import dynamic from 'next/dynamic';

import { FaStar, FaRegStar } from 'react-icons/fa';
import Navbar from '@/components/Navbar';
import ServiceNav from '@/components/ServiceNav';
import ParamsInitializer from '@/components/ParamsInitializer';
import DetailDrawer from '@/components/DetailDrawer';

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
  businesses?: { id: string; name: string; logo_url?: string };
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
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>(''); 
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [directions, setDirections] = useState<any>(null);
  const [userRole, setUserRole] = useState<string | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [newReview, setNewReview] = useState({ comment: '', rating: 0 });
  const [note, setNote] = useState('');
  const [isBooking, setIsBooking] = useState(false);
  const [bookingStatus, setBookingStatus] = useState<string | null>(null);
  const [bookingOptions, setBookingOptions] = useState<{ id: string; type: string; price: number; note?: string }[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string>('');
  const [visibleIds, setVisibleIds] = useState<Set<string>>(new Set());
  const [subcategoryInfo, setSubcategoryInfo] = useState<
    { id: string; label: string; type: string }[]
  >([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries,
  });

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation({ lat: 18.5204, lng: 73.8567 }) 
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
    const fetchDetails = async () => {
      if (!activeCategory || selectedSubcategories.length === 0) {
        setDetails([]);
        return;
      }

      const validIds = selectedSubcategories.filter(id => id.trim() !== '');
      if (validIds.length === 0) {
        setDetails([]);
        return;
      }

      const { type } = activeCategory;
      const normalizedType = type === 'services' ? 'service' : type === 'places' ? 'place' : type;

      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/details/${normalizedType}?ids=${validIds.join(',')}`
        );

        let results = res.data;

        if (selectedCity.trim()) {
          const cityLower = selectedCity.toLowerCase();
          results = results.filter((d: Detail) => d.location?.toLowerCase().includes(cityLower));
        }

        setDetails(results);
      } catch (err) {
        console.error('❌ Failed to fetch details:', err);
        setDetails([]);
      }
    };

    fetchDetails();
  }, [activeCategory?.type, activeCategory?.id, selectedSubcategories.join(','), selectedCity]);

  useEffect(() => {
    if (!selectedDetail) return;

    const fetchOptions = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/details/${selectedDetail.id}/booking-options`
        );
        setBookingOptions(res.data || []);
        if (res.data?.[0]?.id) setSelectedOptionId(res.data[0].id);
      } catch (err) {
        console.error('Failed to fetch booking options', err);
      }
    };

    fetchOptions();
  }, [selectedDetail]);

  useEffect(() => {
    if (!selectedDetail || !userLocation) return;

    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: userLocation,
        destination: { lat: selectedDetail.latitude!, lng: selectedDetail.longitude! },
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === 'OK') setDirections(result);
      }
    );
  }, [selectedDetail, userLocation]);

  const handleDetailClick = async (detail: Detail | null) => {
    setSelectedDetail(detail);
    setReviews([]);
    if (!detail) return;

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/track`,
        { detailId: detail.id, eventType: 'view' },
        { withCredentials: true }
      );

      const reviewRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${detail.id}`, {
        withCredentials: true,
      });
      setReviews(reviewRes.data);
    } catch (err) {
      console.error('Error fetching detail or reviews', err);
    }
  };

  const handleBooking = async () => {
    if (!selectedOptionId || !selectedDetail) return;
    setIsBooking(true);
    setBookingStatus(null);

    try {
      await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/analytics/track`,
        { detailId: selectedDetail.id, eventType: 'click' },
        { withCredentials: true }
      );

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/bookings/create-checkout-session`,
        { option_id: selectedOptionId, note },
        { withCredentials: true }
      );

      if (res.data.url) {
        window.location.href = res.data.url;
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

  const handleReviewSubmit = async () => {
    if (!selectedDetail || !newReview.comment || newReview.rating === 0) return;

    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/reviews/${selectedDetail.id}`,
        {
          detail_id: selectedDetail.id,
          comment: newReview.comment,
          rating: newReview.rating,
        },
        { withCredentials: true }
      );

      setReviews((prev) => [...prev, res.data]);
      setNewReview({ comment: '', rating: 0 });
    } catch (err) {
      console.error('Error submitting review:', err);
    }
  };

  useEffect(() => {
    if (selectedSubcategories.length === 0) {
      setSubcategoryInfo([]);
      return;
    }

    const fetchSubcategoryLabels = async () => {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/api/subcategories`,
          {
            params: { ids: selectedSubcategories.join(',') },
          }
        );
        setSubcategoryInfo(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch subcategory labels:', err);
        setSubcategoryInfo([]);
      }
    };

    fetchSubcategoryLabels();
  }, [selectedSubcategories]);

  return (
    <main className='h-screen w-screen flex flex-col'>
      <Navbar />
      <div className="flex flex-1 overflow-hidden bg-[#0E1C2F] w-screen">
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar */}
          <div className="w-auto bg-gradient-to-b from-[#1F3B79] to-[#2E60C3] border-r border-[#2E60C3]/60">
            <ServiceNav
              selectedCategory={null}
              onSelect={(type, ids) => {
                if (!ids || (Array.isArray(ids) && ids.length === 0)) {
                  setActiveCategory(null);
                  setSelectedSubcategories([]);
                  setDetails([]);
                  handleDetailClick(null);
                  return;
                }
                const firstId = Array.isArray(ids) ? ids[0] : ids;
                setActiveCategory({ type, id: firstId });
                setSelectedSubcategories(Array.isArray(ids) ? ids : [ids]);
                setSelectedCity('');
                handleDetailClick(null);
              }}
            />
          </div>

          <Suspense fallback={null}>
            <ParamsInitializer
              onInit={(type, subcategory, location) => {
                setActiveCategory({ type, id: subcategory });
                setSelectedSubcategories([subcategory]);
                setSelectedCity(location || '');
                handleDetailClick(null);
              }}
            />
          </Suspense>

          {/* Center Content */}
          <div className="w-2/6 p-6 overflow-y-auto no-scrollbar relative bg-[#FFFFFF]">
            {!selectedDetail ? (
              <>
                <h1 className="text-2xl font-bold capitalize mb-4 text-[#202231]">
                  {activeCategory ? (
                    <>
                      Entries for {activeCategory.type} &gt;{' '}
                      {subcategoryInfo.length > 0
                        ? subcategoryInfo.map((sc) => sc.label).join(', ')
                        : ' '}
                    </>
                  ) : (
                    'Welcome, customer!'
                  )}
                </h1>
                {activeCategory && selectedSubcategories.length > 0 ? (
                  <div className="flex flex-col gap-4 ">
                    {details
                      .filter((detail) => visibleIds.has(detail.id))
                      .map((detail) => (
                        <div
                          key={detail.id}
                          onClick={() => handleDetailClick(detail)}
                          className="cursor-pointer p-4 rounded-2xl bg-white/10 border border-[#909198] backdrop-blur-lg hover:scale-105 transition h-24"
                        >
                          {detail.businesses?.logo_url && (
                            <img
                              src={detail.businesses.logo_url}
                              alt="logo"
                              className="w-10 h-10 mb-2 rounded-full object-cover border border-white"
                            />
                          )}
                          <div className="flex flex-row place-content-between">
                            <h2 className="font-semibold text-[#202231]">{detail.name}</h2>
                            <p className="text-sm text-[#8B9AB2]">{detail.rating ?? 'N/A'} ⭐️</p>
                          </div>
                          <p className="text-sm text-[#56575B]">location: {detail.location ?? 'N/A'}</p>
                        </div>
                      ))}
                  </div>
                ) : (
                  <p className="text-gray-500 mt-4">Please select a category to see the entries.</p>
                )}
              </>
            ) : (
              <DetailDrawer
                selectedDetail={selectedDetail}
                onClose={() => setSelectedDetail(null)}
                reviews={reviews}
                userRole={userRole}
                newReview={newReview}
                setNewReview={setNewReview}
                bookingOptions={bookingOptions}
                selectedOptionId={selectedOptionId}
                setSelectedOptionId={setSelectedOptionId}
                note={note}
                setNote={setNote}
                handleBooking={handleBooking}
                bookingStatus={bookingStatus}
                isBooking={isBooking}
                handleReviewSubmit={handleReviewSubmit}
              />
            )}
          </div>

          {/* Map Section */}
          <div className="w-4/6 border-l border-[#415CBB]/60">
            {userLocation ? (
              <MapSection
                origin={userLocation}
                details={details}
                selectedDetail={selectedDetail}
                onDetailSelect={handleDetailClick}
                onVisibleIdsChange={(ids) => setVisibleIds(new Set(ids))}
              />
            ) : (
              <div className="flex items-center justify-center h-full text-[#8B9AB2]">Loading map...</div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Page;
