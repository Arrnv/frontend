// import Navbar from '@/components/Navbar';
// import { Metadata } from 'next';
// import { FaPhoneAlt, FaGlobe, FaDirections, FaStar, FaRegStar } from 'react-icons/fa';
// import { IoMdTime } from 'react-icons/io';

// interface BusinessDetail {
//   id: string;
//   name: string;
//   location: string;
//   description?: string;
//   businesses?: {
//     logo_url?: string;
//   };
//   contact?: string;
//   website?: string;
//   latitude?: number;
//   longitude?: number;
//   detail_amenities?: Array<{ amenities: { id: string; name: string; icon_url: string } }>;
//   timings?: string; // e.g., "Monday: 9AM - 5PM, Tuesday: Closed, ..."
//   reviews?: Array<{
//     id?: string;
//     user?: { full_name?: string };
//     date?: string;
//     rating: number;
//     comment: string;
//   }>;
// }

// async function getBusinessDetail(id: string): Promise<BusinessDetail> {
//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/business/${id}`, { cache: 'no-store' });
//   if (!res.ok) throw new Error('Failed to fetch business detail');
//   return res.json();
// }

// export async function generateMetadata({ params: { id } }: { params: { id: string } }): Promise<Metadata> {
//   const data = await getBusinessDetail(id);

//   return {
//     title: `${data.name} - ${data.location}`,
//     description: data.description ?? `Learn more about ${data.name} in ${data.location}`,
//     openGraph: {
//       title: data.name,
//       description: data.description,
//       images: data.businesses?.logo_url ? [data.businesses.logo_url] : undefined,
//     },
//   };
// }

// function StarDisplay({ rating }: { rating: number }) {
//   return (
//     <div className="flex gap-1 text-[#0099E8] text-sm">
//       {[1, 2, 3, 4, 5].map((i) => (i <= rating ? <FaStar key={i} /> : <FaRegStar key={i} />))}
//     </div>
//   );
// }

// function parseTimings(timingString: string) {
//   return timingString.split(',').map((item) => {
//     const [day, hours] = item.split(':');
//     return {
//       day: day.trim(),
//       hours: hours?.replace(/\[|\]/g, '').trim(),
//       closed: hours?.toLowerCase().includes('closed'),
//     };
//   });
// }

// export default async function BusinessPage(props: { params: { id: string } }) {
//   const { params } = props;
//   const detail = await getBusinessDetail(params.id);

//   const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
//   const todayName = dayNames[new Date().getDay()];

//   const timingsParsed = detail.timings ? parseTimings(detail.timings) : [];
//   const todayTiming = timingsParsed.find((d) => d.day.toLowerCase() === todayName.toLowerCase());

//   return (
//     <>
//       <Navbar />
//       <main className="p-6 bg-[#FAFAFA] text-[#202231] font-[Roboto] w-screen mx-auto">
//         <div className="flex items-center gap-4 mb-6">
//           {detail.businesses?.logo_url && (
//             <img
//               src={detail.businesses.logo_url}
//               alt={detail.name}
//               className="w-16 h-16 rounded-full border shadow"
//             />
//           )}
//           <div>
//             <h1 className="text-3xl font-bold">{detail.name}</h1>
//             <p className="text-gray-500">{detail.location}</p>
//           </div>
//         </div>

//         {/* Contact Buttons */}
//         <div className="flex flex-wrap gap-3 mb-6">
//           {detail.contact && (
//             <a
//               href={`tel:${detail.contact}`}
//               className="flex items-center gap-2 text-[#0099E8] bg-white px-4 py-2 rounded-full shadow-md hover:bg-blue-50 transition"
//             >
//               <FaPhoneAlt /> Phone
//             </a>
//           )}
//           {detail.website && (
//             <a
//               href={detail.website}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-2 text-[#0099E8] bg-white px-4 py-2 rounded-full shadow-md hover:bg-blue-50 transition"
//             >
//               <FaGlobe /> Site
//             </a>
//           )}
//           {detail.latitude && detail.longitude && (
//             <a
//               href={`https://www.google.com/maps/dir/?destination=${detail.latitude},${detail.longitude}`}
//               target="_blank"
//               rel="noopener noreferrer"
//               className="flex items-center gap-2 text-[#0099E8] bg-white px-4 py-2 rounded-full shadow-md hover:bg-blue-50 transition"
//             >
//               <FaDirections /> Directions
//             </a>
//           )}
//         </div>

//         <div className="flex flex-row w-full gap-2">
//           {detail.detail_amenities && detail.detail_amenities.length > 0 && (
//             <div className="bg-white p-4 rounded-xl shadow-sm w-1/2 h-full">
//               <h3 className="text-base font-semibold mb-3">Amenities</h3>
//               <div className="grid grid-cols-3 gap-3">
//                 {detail.detail_amenities.map(({ amenities }) => (
//                   <div
//                     key={amenities.id}
//                     className="flex flex-col items-center p-3 border rounded-xl bg-gray-50"
//                   >
//                     <img src={amenities.icon_url} alt={amenities.name} className="w-10 h-10" />
//                     <span className="text-sm text-center mt-1">{amenities.name}</span>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           <div className="bg-white p-4 rounded-xl shadow-sm w-1/2">
//             <div className="flex items-center justify-between text-sm font-medium cursor-pointer">
//               <span className="flex items-center gap-2 text-green-600">
//                 <IoMdTime />
//                 {todayTiming
//                   ? `${todayTiming.day}: ${todayTiming.closed ? 'Closed' : todayTiming.hours}`
//                   : 'Hours not available'}
//               </span>
//             </div>
//             {detail.timings && (
//               <div className="mt-2 text-sm text-gray-700 space-y-1">
//                 {timingsParsed.map((day, i) => (
//                   <div key={i} className="flex justify-between">
//                     <span>{day.day}</span>
//                     <span className={day.closed ? 'text-red-500' : 'font-semibold'}>{day.hours}</span>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Reviews */}
//         <div className="bg-white p-4 rounded-xl shadow-sm mt-10">
//           <h3 className="text-xl font-semibold mb-4">Reviews ({detail.reviews?.length || 0})</h3>
//           {detail.reviews && detail.reviews.length > 0 ? (
//             detail.reviews.map((r, idx) => (
//               <div key={r.id ?? idx} className="bg-gray-50 rounded-lg px-4 py-3 shadow-sm mb-3">
//                 <div className="flex justify-between items-center mb-1">
//                   <p className="font-medium">{r.user?.full_name ?? 'Anonymous'}</p>
//                   <span className="text-sm text-gray-400">
//                     {new Date(r.date ?? Date.now()).toLocaleDateString()}
//                   </span>
//                 </div>
//                 <StarDisplay rating={r.rating} />
//                 <p className="mt-2 text-sm text-gray-700">{r.comment}</p>
//               </div>
//             ))
//           ) : (
//             <p className="text-sm text-gray-500">No reviews yet.</p>
//           )}
//         </div>
//       </main>
//     </>
//   );
// }
