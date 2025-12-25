'use client';

import React, { useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import {
  FaStar,
  FaRegStar,
  FaPhoneAlt,
  FaGlobe,
  FaDirections,
} from 'react-icons/fa';
import { IoMdTime } from 'react-icons/io';

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

const StarDisplay = ({ rating }: { rating: number }) => (
  <div className="flex gap-1 text-[#0099E8] text-sm">
    {[1, 2, 3, 4, 5].map((i) =>
      i <= rating ? <FaStar key={i} /> : <FaRegStar key={i} />
    )}
  </div>
);

/* -------------------------------------------------------------------------- */
/* TYPES                                                                      */
/* -------------------------------------------------------------------------- */

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

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function DetailDrawer({
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
}: Props) {
  const [showHours, setShowHours] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [showReviews, setShowReviews] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFullscreenImage(null);
    };
    window.addEventListener('keydown', esc);
    return () => window.removeEventListener('keydown', esc);
  }, []);

  if (!selectedDetail) return null;

  /* ------------------------------------------------------------------------ */
  /* TIMINGS                                                                  */
  /* ------------------------------------------------------------------------ */

  const parseTimings = (timingString: string) =>
    timingString.split(',').map((item) => {
      const [day, hours] = item.split(':');
      return {
        day: day.trim(),
        hours: hours?.replace(/\[|\]/g, '').trim(),
        closed: hours?.toLowerCase().includes('closed'),
      };
    });

  const dayNames = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ];

  const todayName = dayNames[new Date().getDay()];
  const todayTiming = selectedDetail.timings
    ? parseTimings(selectedDetail.timings).find(
        (d) => d.day.toLowerCase() === todayName.toLowerCase()
      )
    : null;

  /* ------------------------------------------------------------------------ */
  /* UI                                                                       */
  /* ------------------------------------------------------------------------ */

  return (
    <div className="absolute inset-0 bg-slate-100 p-1 md:p-1">
      {/* Drawer Card */}
      <div
        className="
          relative
          h-full
          w-full
          max-w-[720px]
          mx-auto
          bg-white
          rounded-2xl
          border border-black/5
          shadow-sm
          overflow-y-auto
          no-scrollbar
        "
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-500 hover:text-black"
          aria-label="Close"
        >
          <IoClose size={18} />
        </button>

        {/* CONTENT */}
        <div className="p-6">

          {/* ---------------------------------------------------------------- */}
          {/* HEADER                                                           */}
          {/* ---------------------------------------------------------------- */}
          <div className="flex gap-4 mb-4">
            {selectedDetail.business?.logo_url && (
              <img
                src={selectedDetail.business.logo_url}
                className="w-14 h-14 rounded-xl object-cover ring-1 ring-black/10"
              />
            )}

            <div className="min-w-0">
              <h2 className="text-lg font-semibold tracking-tight">
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

          <div className="border-b border-slate-200 mb-6" />

          {/* ---------------------------------------------------------------- */}
          {/* ACTIONS                                                          */}
          {/* ---------------------------------------------------------------- */}
          <div className="grid grid-cols-3 gap-2 mb-6">
            {[
              { icon: <FaPhoneAlt />, label: 'Call', href: `tel:${selectedDetail.contact}` },
              { icon: <FaGlobe />, label: 'Website', href: selectedDetail.website },
              {
                icon: <FaDirections />,
                label: 'Directions',
                href: `https://www.google.com/maps?q=${selectedDetail.latitude},${selectedDetail.longitude}`,
              },
            ].map((item, i) => (
              <a
                key={i}
                href={item.href}
                target="_blank"
                className="
                  flex items-center justify-center gap-2
                  py-2 text-sm font-medium
                  rounded-xl
                  bg-white
                  border border-black/5
                  hover:border-[#0099E8]/40
                  transition
                "
              >
                <span className="text-[#0099E8]">{item.icon}</span>
                {item.label}
              </a>
            ))}
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* HOURS                                                            */}
          {/* ---------------------------------------------------------------- */}
          <div className="mb-6 bg-white rounded-2xl border border-black/5 p-4">
            <button
              onClick={() => setShowHours(!showHours)}
              className="w-full flex justify-between text-sm font-medium"
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
              <div className="mt-3 space-y-1 text-sm text-slate-600">
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

          {/* ---------------------------------------------------------------- */}
          {/* GALLERY                                                          */}
          {/* ---------------------------------------------------------------- */}
          {selectedDetail.gallery_urls?.length > 0 && (
            <div className="mb-6 bg-white rounded-2xl border border-black/5 p-4">
              <h3 className="text-sm font-semibold mb-3">Photos</h3>

              <div
                className="relative h-[220px] rounded-xl overflow-hidden ring-1 ring-black/10 cursor-pointer"
                onClick={() =>
                  setFullscreenImage(activeImage || selectedDetail.gallery_urls[0])
                }
              >
                <img
                  src={activeImage || selectedDetail.gallery_urls[0]}
                  className="w-full h-full object-cover"
                />
              </div>

              {selectedDetail.gallery_urls.length > 1 && (
                <div className="flex gap-3 mt-3 overflow-x-auto">
                  {selectedDetail.gallery_urls.map((img: string, idx: number) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImage(img)}
                      className="
                        w-20 h-20 rounded-xl overflow-hidden
                        border border-black/10
                        hover:border-[#0099E8]/60
                        transition
                      "
                    >
                      <img src={img} className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* AMENITIES                                                        */}
          {/* ---------------------------------------------------------------- */}
          <div className="mb-6 bg-white rounded-2xl border border-black/5 p-4">
            <h3 className="text-sm font-semibold mb-3">Amenities</h3>
            <div className="grid grid-cols-2 gap-3">
              {selectedDetail.detail_amenities.map(({ amenities }: any) => (
                <div
                  key={amenities.id}
                  className="flex items-center gap-3 px-3 py-2 bg-white rounded-lg border border-black/5"
                >
                  <img src={amenities.icon_url} className="w-5 h-5" />
                  <span className="text-sm">{amenities.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* BOOKING                                                          */}
          {/* ---------------------------------------------------------------- */}
          {userRole && (
            <div className="mb-6 bg-white rounded-2xl border border-black/5 p-4">
              <h3 className="text-sm font-semibold mb-3">Book This Service</h3>

              {bookingOptions.length === 0 ? (
                <p className="text-sm text-slate-500">No booking options available.</p>
              ) : (
                <>
                  <select
                    value={selectedOptionId}
                    onChange={(e) => setSelectedOptionId(e.target.value)}
                    className="w-full border p-2 rounded mb-3 text-sm"
                  >
                    {bookingOptions.map((opt: any) => (
                      <option key={opt.id} value={opt.id}>
                        {opt.type} — ₹{opt.price}
                      </option>
                    ))}
                  </select>

                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Any note?"
                    className="w-full border p-2 rounded mb-3 text-sm resize-none"
                  />

                  <button
                    onClick={handleBooking}
                    disabled={isBooking}
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    {isBooking ? 'Booking…' : 'Book Now'}
                  </button>

                  {bookingStatus && (
                    <p className="mt-2 text-sm text-slate-600">{bookingStatus}</p>
                  )}
                </>
              )}
            </div>
          )}

          {/* ---------------------------------------------------------------- */}
          {/* REVIEWS                                                          */}
          {/* ---------------------------------------------------------------- */}
          <div className="bg-white rounded-2xl border border-black/5 p-4">
            <button
              onClick={() => setShowReviews(!showReviews)}
              className="flex justify-between w-full mb-3"
            >
              <h3 className="text-sm font-semibold">
                Reviews ({reviews.length})
              </h3>
              <span className="text-slate-400">{showReviews ? '−' : '+'}</span>
            </button>

            {showReviews && (
              <>
                <div className="space-y-4">
                  {reviews.map((r, idx) => (
                    <div
                      key={idx}
                      className="bg-white rounded-xl border border-black/5 p-3"
                    >
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          {r.full_name || r.user_id}
                        </span>
                        <StarDisplay rating={r.rating} />
                      </div>
                      <p className="text-sm text-slate-600">{r.comment}</p>
                    </div>
                  ))}
                </div>

                {userRole && (
                  <>
                    <button
                      onClick={() => setShowAddForm(!showAddForm)}
                      className="mt-4 w-full bg-[#0099E8] text-white py-2 rounded-xl"
                    >
                      {showAddForm ? 'Cancel' : 'Add Review'}
                    </button>

                    {showAddForm && (
                      <div className="mt-3">
                        <textarea
                          value={newReview.comment}
                          onChange={(e) =>
                            setNewReview({ ...newReview, comment: e.target.value })
                          }
                          className="w-full border p-2 rounded mb-2 text-sm"
                        />
                        <button
                          onClick={handleReviewSubmit}
                          className="w-full bg-blue-600 text-white py-2 rounded"
                        >
                          Submit Review
                        </button>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* FULLSCREEN IMAGE */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 bg-black/90 z-[99999] flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <img
            src={fullscreenImage}
            className="max-w-full max-h-full rounded-xl"
          />
        </div>
      )}
    </div>
  );
}
