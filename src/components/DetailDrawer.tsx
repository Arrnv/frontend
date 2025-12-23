'use client';

import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5'; // or any other icon set
import { FaStar, FaRegStar, FaPhoneAlt, FaGlobe, FaDirections } from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';
import Link from 'next/link';

const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex gap-1 text-[#0099E8] text-sm">
    {[1, 2, 3, 4, 5].map((i) =>
      i <= rating ? <FaStar key={i} /> : <FaRegStar key={i} />
    )}
  </div>
);

type Props = {
  selectedDetail: any;
  onClose: () => void;
  reviews: any[];
  userRole: string | null;
  newReview: { comment: string; rating: number };
  setNewReview: (val: any) => void;
  bookingOptions: any[];
  selectedOptionId: string;
  setSelectedOptionId: (val: string) => void;
  note: string;
  setNote: (val: string) => void;
  handleBooking: () => void;
  bookingStatus: string | null;
  isBooking: boolean;
  handleReviewSubmit: () => void;
};


const DetailDrawer = ({
  selectedDetail,
  onClose,
  reviews,
  userRole,
  newReview,
  setNewReview,
  bookingOptions,
  selectedOptionId,
  setSelectedOptionId,
  note,
  setNote,
  handleBooking,
  bookingStatus,
  isBooking,
  handleReviewSubmit,
}: Props) => {
  const [showHours, setShowHours] = useState(false);
  const [showAmenities, setShowAmenities] = useState(true); // add this with your other state
  const [reviewTab, setReviewTab] = useState('All');
  const [sortOption, setSortOption] = useState('Newest First');
  const [showGallery, setShowGallery] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
useEffect(() => {
  const esc = (e: KeyboardEvent) => {
    if (e.key === 'Escape') setFullscreenImage(null);
  };
  window.addEventListener('keydown', esc);
  return () => window.removeEventListener('keydown', esc);
}, []);


    const [showReviews, setShowReviews] = useState(true);
    const [showAddForm, setShowAddForm] = useState(false);
    
    const parseTimings = (timingString: string) => {
    return timingString.split(",").map((item) => {
        const [day, hours] = item.split(":");
        return {
        day: day.trim(),
        hours: hours?.replace(/\[|\]/g, "").trim(),
        closed: hours?.toLowerCase().includes("closed"),
        };
    });
    };

    const dayNames = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ];

    const todayName = dayNames[new Date().getDay()];
    const todayTiming = selectedDetail?.timings
    ? parseTimings(selectedDetail.timings).find(
        (d) => d.day.toLowerCase() === todayName.toLowerCase()
        )
    : null;


  if (!selectedDetail) return null;
console.log("DETAIL:", selectedDetail);
  return (
    <div className="absolute top-0 left-0 w-full h-full  overflow-y-auto  bg-[#FAFAFA]
  p-6
  overflow-y-auto
  text-[#202231]
  font-[Roboto]  transition-all duration-300">
    <button
    className="absolute top-3 right-4 text-2xl text-black hover:text-gray-700 transition"
    onClick={onClose}
    aria-label="Close"
    >
    <IoClose className='text-black' size={16}/>
    </button>
    {/* Header */}
<div className="flex items-start gap-4 mb-6">
  {selectedDetail.business?.logo_url && (
    <img
      src={selectedDetail.business.logo_url}
      className="w-14 h-14 rounded-xl object-cover ring-1 ring-black/10"
    />
  )}

  <div className="min-w-0">
    <h2 className="text-[20px] font-semibold leading-snug">
      {selectedDetail.name}
    </h2>

    <p className="text-sm text-slate-500 mt-1">
      {selectedDetail.location}
    </p>

    <div className="mt-2">
      <StarDisplay rating={Math.round(selectedDetail.rating || 0)} />
    </div>
  </div>
</div>



<div className="
  grid grid-cols-3
  gap-2
  mb-6
">
  {[
    { icon: <FaPhoneAlt />, label: 'Call', href: `tel:${selectedDetail.contact}` },
    { icon: <FaGlobe />, label: 'Website', href: selectedDetail.website },
    { icon: <FaDirections />, label: 'Directions', href: `https://www.google.com/maps?q=${selectedDetail.latitude},${selectedDetail.longitude}` },
  ].map((item, i) => (
    <a
      key={i}
      href={item.href}
      target="_blank"
      className="
        flex items-center justify-center gap-2
        py-2
        text-sm font-medium
        rounded-xl
        bg-white
        ring-1 ring-black/5
        hover:ring-[#0099E8]/50
        transition
      "
    >
      <span className="text-[#0099E8]">{item.icon}</span>
      {item.label}
    </a>
  ))}
</div>

    
<div className="mb-6">
  <button
    onClick={() => setShowHours(!showHours)}
    className="
      w-full
      flex items-center justify-between
      text-sm
      font-medium
      py-2
      border-b border-slate-200
      
    "
  >
    <span className="flex items-center gap-2">
      <IoMdTime className="text-[#0099E8]" />
      {todayTiming
        ? `${todayTiming.day}: ${todayTiming.closed ? 'Closed' : todayTiming.hours}`
        : 'Hours not available'}
    </span>
    <span className="text-slate-400">{showHours ? '−' : '+'}</span>
  </button>

  {showHours && (
    <div className="mt-3 space-y-1 text-sm text-slate-600 animate-fadeIn">
      {parseTimings(selectedDetail.timings).map((d, i) => (
        <div key={i} className="flex justify-between">
          <span>{d.day}</span>
          <span className={d.closed ? 'text-red-500' : 'font-medium'}>
            {d.closed ? 'Closed' : d.hours}
          </span>
        </div>
      ))}
    </div>
  )}
</div>


{/* Gallery Section */}
{selectedDetail.gallery_urls?.length > 0 && (
  <div className="mb-8">
    <h3 className="text-sm font-semibold mb-3">
      Photos
    </h3>

    {/* MAIN IMAGE */}
    <div
      className="
        relative
        w-full
        h-[220px]
        md:h-[260px]
        rounded-2xl
        overflow-hidden
        ring-1 ring-black/10
        bg-black
        cursor-pointer
      "
      onClick={() =>
        setFullscreenImage(
          activeImage || selectedDetail.gallery_urls[0]
        )
      }
    >
      <img
        src={activeImage || selectedDetail.gallery_urls[0]}
        className="
          w-full h-full
          object-cover
          transition-transform duration-300
          hover:scale-[1.02]
        "
        alt="Gallery preview"
      />

      {/* Zoom hint */}
      <div className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-1 rounded">
        Click to enlarge
      </div>
    </div>

    {/* THUMBNAILS */}
    {selectedDetail.gallery_urls.length > 1 && (
      <div className="flex gap-3 mt-3 overflow-x-auto pb-1">
        {selectedDetail.gallery_urls.map((img: string, idx: number) => (
          <button
            key={idx}
            onClick={() => setActiveImage(img)}
            className={`
              flex-shrink-0
              w-20 h-20
              rounded-xl
              overflow-hidden
              ring-1
              ${
                (activeImage || selectedDetail.gallery_urls[0]) === img
                  ? 'ring-[#0099E8]'
                  : 'ring-black/10'
              }
              hover:ring-[#0099E8]/50
              transition
            `}
          >
            <img
              src={img}
              className="w-full h-full object-cover"
              alt={`Thumbnail ${idx + 1}`}
            />
          </button>
        ))}
      </div>
    )}
  </div>
)}




    {/* Amenities */}
<div className="mb-6">
  <h3 className="text-sm font-semibold mb-3">Amenities</h3>

<div className="grid grid-cols-2 gap-3">
  {selectedDetail.detail_amenities.map(({ amenities }: any) => (
    <div
      key={amenities.id}
      className="
        flex items-center gap-3
        px-3 py-2
        bg-white
        rounded-lg
        ring-1 ring-black/5
      "
    >
      <img src={amenities.icon_url} className="w-5 h-5" />
      <span className="text-sm">
        {amenities.name}
      </span>
    </div>
  ))}
</div>

</div>

    {/* <Link className='text-black mb-5 bg-white p-4 rounded-xl shadow-sm' href={`/customer/bus/${selectedDetail.id}`}>
        View Detail
    </Link> */}
    {/* Booking */}
    {userRole && (
        <div className="mb-8 bg-white p-5 rounded-xl shadow-sm">
        <h3 className="text-lg font-bold mb-3">Book This Service</h3>
        {bookingOptions.length === 0 ? (
            <p className="text-sm text-gray-500">No booking options available.</p>
        ) : (
            <>
            <label className="block text-sm font-medium text-gray-700 mb-1">Select Option:</label>
            <select
                value={selectedOptionId}
                onChange={(e) => setSelectedOptionId(e.target.value)}
                className="w-full border p-2 rounded mb-3 shadow-sm"
            >
                {bookingOptions.map((opt: any) => (
                <option key={opt.id} value={opt.id}>
                    {opt.type} — ₹{opt.price} {opt.note ? `(${opt.note})` : ''}
                </option>
                ))}
            </select>
            <textarea
                placeholder="Any note for the service provider?"
                className="w-full border p-2 rounded mb-3 shadow-sm text-sm resize-none"
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />
            <button
                onClick={handleBooking}
                disabled={isBooking}
                className="w-full bg-green-600 text-white px-4 py-2 rounded shadow-md hover:bg-green-700 transition"
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

    <div className="mt-8 pt-4 text-black">
    <div
        className="flex justify-between items-center cursor-pointer mb-2"
        onClick={() => setShowReviews(!showReviews)}
    >
        <h3 className="text-xl font-semibold text-[#202231] tracking-tight">Reviews ({reviews.length})</h3>
        <span className="text-sm text-gray-500">{showReviews ? '▲' : '▼'}</span>
    </div>
    
   
    {showReviews && (
        <>
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mt-3 mb-4">
            {['All'].map((tab) => (
            <button
                key={tab}
                onClick={() => setReviewTab(tab)}
                className={`px-4 py-1 rounded-full font-medium text-sm transition-all border shadow-sm ${
                reviewTab === tab
                    ? 'bg-[#0099E8] text-white border-[#0099E8]'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                }`}
            >
                {tab}
            </button>
            ))}
        </div>

        {/* Sort Dropdown */}
        <select
            className="mb-4 px-3 py-2 border rounded text-sm text-gray-800 shadow-sm"
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
        >
            <option>Newest First</option>
            <option>Oldest First</option>
        </select>

        {/* Review Cards */}
        <div className="flex flex-col gap-4">
            {reviews.length > 0 ? (
            reviews.map((r, idx) => (
                <div
                key={r.id || `${r.user_id}-${idx}`}
                className="bg-white rounded-xl px-4 py-3 shadow-md border border-gray-100"
                >
                <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-[#202231]">{r.full_name || r.user_id}</p>
                    <span className="text-sm text-gray-400">from Google</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                    <StarDisplay rating={r.rating} />
                    <span className="text-sm text-gray-400">
                    {new Date(r.date || Date.now()).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                    })}
                    </span>
                </div>
                <p className="mt-2 text-sm text-gray-700 leading-relaxed">{r.comment}</p>
                </div>
            ))
            ) : (
            <p className="text-gray-500 text-sm">No reviews yet.</p>
            )}
        </div>

        {/* Add Review Section */}
        {userRole && (
            <>
            <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-[#0099E8] hover:bg-[#007FCC] text-white font-medium mt-6 py-2 px-4 rounded-full shadow-md transition-all w-full"
            >
                {showAddForm ? 'Cancel' : 'Add Review'}
            </button>

            {showAddForm && (
                <div className="mt-4 border p-4 rounded-xl bg-white shadow-sm">
                <textarea
                    value={newReview.comment}
                    onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                    className="w-full border p-2 mb-2 text-sm rounded text-gray-800 resize-none shadow-sm focus:outline-none focus:ring-1 focus:ring-[#0099E8]"
                    placeholder="Share your experience..."
                />
                <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                    <button
                        key={i}
                        onClick={() => setNewReview({ ...newReview, rating: i })}
                        className={`text-2xl transition-all ${
                        i <= newReview.rating ? 'text-[#0099E8]' : 'text-gray-300'
                        }`}
                    >
                        <FaStar />
                    </button>
                    ))}
                </div>
                <button
                    onClick={handleReviewSubmit}
                    className="bg-blue-600 text-white px-4 py-2 rounded mt-4 w-full shadow hover:bg-blue-700 transition-all"
                >
                    Submit Review
                </button>
                </div>
            )}
            </>
        )}

        {!userRole && (
            <div className="mt-4 text-sm text-yellow-800">
            You need to{' '}
            <a href="/customer/login" className="text-blue-600 underline">
                log in
            </a>{' '}
            to leave a review.
            </div>
        )}
        </>
    )}
    </div>
{fullscreenImage && (
  <div
    className="
      fixed inset-0
      z-[99999]
      bg-black/90
      flex items-center justify-center
      p-4
    "
    onClick={() => setFullscreenImage(null)}
  >
    <button
      className="absolute top-4 right-4 text-white text-2xl"
      onClick={() => setFullscreenImage(null)}
      aria-label="Close image"
    >
      <IoClose />
    </button>

    <img
      src={fullscreenImage}
      className="
        max-w-full
        max-h-full
        rounded-xl
        shadow-2xl
      "
      alt="Full size preview"
    />
  </div>
)}

    </div>

  );
};

export default DetailDrawer;
