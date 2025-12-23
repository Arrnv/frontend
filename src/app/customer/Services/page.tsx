'use client';

import React, { useState, useEffect, useRef, Suspense } from 'react';
import axios from 'axios';
import dynamic from 'next/dynamic';

import Navbar from '@/components/Navbar';
import ServiceNav from '@/components/ServiceNav';
import ParamsInitializer from '@/components/ParamsInitializer';
import DetailDrawer from '@/components/DetailDrawer';
import { motion, AnimatePresence } from "framer-motion";


const MapSection = dynamic(() => import('@/components/MapSection'), { ssr: false });

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
  city?: string; // ✅ ADD THIS
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
  const [subcategoryInfo, setSubcategoryInfo] = useState<{ id: string; label: string; type: string }[]>([]);
  
  // Mobile toggle state
  const [showMap, setShowMap] = useState(true);
  // Add this to your existing states ↑
 const [vibeCityCoords, setVibeCityCoords] = useState<{ lat: number; lng: number } | null>(null);

function normalizeCity(input: string) {
  return input
    .toLowerCase()
    .replace(/[^a-z\s]/g, '')
    .trim();
}


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => setUserLocation({ lat: 18.5204, lng: 73.8567 }) 
    );
  }, []);
useEffect(() => {
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("authToken");

      if (!token) {
        setUserRole(null);
        return;
      }

      const res = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/profile`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setUserRole(res.data.user.role);
    } catch (err) {
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
          const cityLower = normalizeCity(selectedCity);

          results = results.filter((d: { city: any; }) =>
            normalizeCity(d.city || '').includes(cityLower)
          );
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
          { params: { ids: selectedSubcategories.join(',') } }
        );
        setSubcategoryInfo(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch subcategory labels:', err);
        setSubcategoryInfo([]);
      }
    };
    fetchSubcategoryLabels();
  }, [selectedSubcategories]);
  const visibleDetails = React.useMemo(() => {
  if (visibleIds.size === 0) return [];
  return details.filter(d => visibleIds.has(d.id));
}, [details, visibleIds]);


return (
  <main className="h-screen w-screen flex flex-col overflow-hidden">
    <Navbar />

    {/* Mobile toggle buttons */}
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 md:hidden">
      <div className="relative flex bg-white rounded-full shadow-lg overflow-hidden border border-gray-200">
        {/* Animated sliding background */}
        <motion.div
          layout
          className="absolute top-0 h-full w-1/2 bg-[#0099E8] rounded-full"
          animate={{ x: showMap ? "100%" : "0%" }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
        {/* List Button */}
        <button
          onClick={() => setShowMap(false)}
          className={`relative z-10 px-6 py-2 text-sm font-semibold transition-colors duration-300 ${
            !showMap ? "text-white" : "text-gray-700"
          }`}
        >
          List
        </button>
        {/* Map Button */}
        <button
          onClick={() => setShowMap(true)}
          className={`relative z-10 px-6 py-2 text-sm font-semibold transition-colors duration-300 ${
            showMap ? "text-white" : "text-gray-700"
          }`}
        >
          Map
        </button>
      </div>
    </div>

<div className="flex flex-1 overflow-hidden bg-[#F5F7FB] w-screen">
      <div className="flex flex-1 overflow-hidden flex-row w-screen">

<div
  className={`
    ${showMap ? "hidden" : "block"} md:block
    bg-white
    border-r border-slate-200
  `}
>

          <Suspense>
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
                setSelectedCity("");
                handleDetailClick(null);
              }}
            />
          </Suspense>
        </div>

        {/* Initialize Params */}
        <Suspense fallback={null}>
<ParamsInitializer
  onInit={async (type, subcategory, location) => {
    setActiveCategory({ type, id: subcategory });
    setSelectedSubcategories([subcategory]);
    setSelectedCity(location || "");
    handleDetailClick(null);

    // 🌍 Fetch coordinates for searched city
    if (location) {
      try {
        const res = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
        );
        if (res.data.results.length > 0) {
          const { lat, lng } = res.data.results[0].geometry.location;
          setVibeCityCoords({ lat, lng });
        }
      } catch (err) {
        console.error("❌ Failed to fetch city coordinates");
      }
    }
  }}
/>
        </Suspense>

        {/* List Panel */}
        <div
          className={`${
            showMap ? "hidden" : "block"
          } w-full md:block md:w-2/5 p-6 overflow-y-auto no-scrollbar relative bg-white`}
        >
          {!selectedDetail ? (
            <>
{/* Header */}
<div className="mb-6 space-y-2">
  {/* Context */}
  <p className="text-xs uppercase tracking-wide text-slate-400">
    {activeCategory?.type}
  </p>

  {/* Primary title */}
  <h1 className="text-2xl font-semibold text-[#202231] leading-tight">
    {subcategoryInfo[0]?.label ?? "Results"}
  </h1>

  {/* Secondary subcategories */}
  {subcategoryInfo.length > 1 && (
    <div className="flex flex-wrap gap-2 mt-2">
      {subcategoryInfo.slice(1, 4).map(sc => (
        <span
          key={sc.id}
          className="
            px-3 py-1
            text-xs
            rounded-full
            bg-slate-100
            text-slate-600
            border border-slate-200
          "
        >
          {sc.label}
        </span>
      ))}

      {subcategoryInfo.length > 4 && (
        <span className="text-xs text-slate-500 px-2 py-1">
          +{subcategoryInfo.length - 4} more
        </span>
      )}
    </div>
  )}
</div>

              {activeCategory && selectedSubcategories.length > 0 ? (
                <div className="flex flex-col gap-4 ">
                  {visibleDetails.map((detail) => (
<div
  key={detail.id}
  onClick={() => handleDetailClick(detail)}
 className="
  group
  bg-white
  rounded-2xl

  min-h-[96px]
  sm:min-h-[6rem]

  w-full
  min-w-0

  p-4
  shadow-sm
  ring-1 ring-black/5
  overflow-hidden

  transition-all duration-300 ease-out

  hover:shadow-md
  hover:ring-2
  hover:ring-[#0099E8]/60

  active:scale-[0.99]
"

>
  {/* Top row */}
  <div className="flex items-start justify-between gap-3">
    <div className="flex items-center gap-3">
      {detail.businesses?.logo_url && (
        <img
          src={detail.businesses.logo_url}
          alt="logo"
          className="
            w-10 h-10
            rounded-xl
            object-cover
            border
            border-slate-200
            group-hover:border-[#0099E8]/60
            transition
          "
        />
      )}

      <div>
        <h2 className="
          text-[15px]
          font-semibold
          text-[#202231]
          leading-snug
          tracking-tight
        ">
          {detail.name}
        </h2>

        <p className="
          text-xs
          text-[#6B7280]
          mt-0.5
        ">
          {detail.location ?? "Location unavailable"}
        </p>
      </div>
    </div>

    {/* Rating */}
    <div className="
      text-xs
      font-medium
      text-[#0099E8]
      bg-[#0099E8]/10
      px-2.5 py-1
      rounded-lg
      whitespace-nowrap
    ">
      {detail.rating ?? "N/A"} ★
    </div>
  </div>
</div>

                    ))}
                </div>
              ) : (
                <p className="text-gray-500 mt-4">
                  Please select a category to see the entries.
                </p>
              )}
            </>
          ) : (
            // ✅ Only desktop shows inline drawer
            <div className="hidden md:block">
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
            </div>
          )}
        </div>

        {/* Map Section */}
        <div
          className={`${
            !showMap ? "hidden" : "block"
          } md:block w-full md:w-5/6 border-l border-[#415CBB]/60 relative`}
        >
          {userLocation ? (
        <MapSection
          origin={userLocation}
          details={details}
          selectedDetail={selectedDetail}
          onDetailSelect={handleDetailClick}
          onVisibleIdsChange={(ids) => setVisibleIds(new Set(ids))}
          selectedCity={selectedCity}
          vibeCityCoords={vibeCityCoords}  
        />

          ) : (
            <div className="flex items-center justify-center h-full text-[#8B9AB2]">
              Loading map...
            </div>
          )}
        </div>

        <AnimatePresence>
          {selectedDetail && (
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-0 left-0 w-full h-[90%] md:hidden z-[9999] bg-white shadow-2xl rounded-t-2xl overflow-y-auto"
            >
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
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </main>
);

};

export default Page;
