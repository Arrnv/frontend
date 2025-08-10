'use client';

import React, { useState } from 'react';
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

  return (
    <div className="absolute top-0 left-0 w-full h-full bg-[#FAFAFA]  p-5 overflow-y-auto rounded-r-2xl shadow-2xl text-[#202231] font-[Roboto] transition-all duration-300">
    <button
    className="absolute top-3 right-4 text-2xl text-black hover:text-gray-700 transition"
    onClick={onClose}
    aria-label="Close"
    >
    <IoClose className='text-black' size={16}/>
    </button>
    {/* Header */}
    <div className="flex items-center gap-4 mb-6">
        <img src={selectedDetail.businesses?.logo_url} alt="Logo" className="w-14 h-14 rounded-full border shadow" />
        <div>
        <h2 className="text-2xl font-bold text-[#202231]">{selectedDetail.name}</h2>
        <p className="text-gray-500 text-sm">{selectedDetail.location}</p>
        </div>
    </div>

    {/* Contact Buttons */}
    <div className="flex flex-row gap-2 mb-6 justify-between">
        <a href={`tel:${selectedDetail.contact}`} className="flex items-center gap-2 text-[#0099E8] bg-white px-4 py-2 rounded-full shadow-md hover:bg-blue-50 transition w-[10rem] justify-center">
        <FaPhoneAlt /> Phone
        </a>
        <a href={selectedDetail.website} target="_blank" className="flex items-center gap-2 text-[#0099E8] bg-white px-4 py-2 rounded-full shadow-md hover:bg-blue-50 transition w-[10rem] justify-center">
        <FaGlobe /> Site
        </a>
        {selectedDetail.latitude && selectedDetail.longitude && (
        <a
            href={`https://www.google.com/maps/dir/?destination=${selectedDetail.latitude},${selectedDetail.longitude}`}
            target="_blank"
            className="flex items-center gap-2 text-[#0099E8] bg-white px-4 py-2 rounded-full shadow-md hover:bg-blue-50 transition w-[10rem] justify-center"
        >
            <FaDirections /> Direction
        </a>
        )}
    </div>
 <Link className='text-black' href={`/customer/bus/${selectedDetail.id}`}>
    View Detail
    </Link>
    <div className="mb-5 bg-white p-4 rounded-xl shadow-sm">
        <button
            className="flex items-center justify-between w-full text-sm font-medium"
            onClick={() => setShowHours(!showHours)}
        >
            <span
            className={`flex items-center gap-2 ${
                todayTiming?.closed ? "text-red-500" : "text-green-600"
            }`}
            >
            <IoMdTime />
            {todayTiming
                ? `${todayTiming.day}: ${
                    todayTiming.closed ? "Closed" : todayTiming.hours
                }`
                : "Hours not available"}
            </span>
            <span>{showHours ? "▲" : "▼"}</span>
        </button>

        {showHours && selectedDetail?.timings && (
            <div className="mt-2 text-sm text-gray-700 space-y-1">
            {parseTimings(selectedDetail.timings).map((day, i) => (
                <div key={i} className="flex justify-between">
                <span>{day.day}</span>
                <span
                    className={day.closed ? "text-red-500" : "font-semibold"}
                >
                    {day.closed ? "Closed" : day.hours}
                </span>
                </div>
            ))}
            </div>
        )}
    </div>



    {/* Amenities */}
    {selectedDetail.detail_amenities?.length > 0 && (
        <div className="mb-6 bg-white p-4 rounded-xl shadow-sm">
        <button className="flex justify-between items-center w-full text-sm font-medium" onClick={() => setShowAmenities(!showAmenities)}>
            <h3 className="text-base font-semibold text-[#202231]">Amenities</h3>
            <span>{showAmenities ? '▲' : '▼'}</span>
        </button>
        {showAmenities && (
            <div className="grid grid-cols-3 gap-3 mt-3">
            {selectedDetail.detail_amenities.map(({ amenities }: any) => (
                <div key={amenities.id} className="flex flex-col items-center p-3 border rounded-xl bg-gray-50">
                <img src={amenities.icon_url} alt={amenities.name} className="w-10 h-10" />
                <span className="text-sm text-center mt-1 text-[#202231]">{amenities.name}</span>
                </div>
            ))}
            </div>
        )}
        </div>
    )}

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

    </div>

  );
};

export default DetailDrawer;
