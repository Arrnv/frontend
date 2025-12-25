'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false });

/* =====================
   Reusable UI Primitives
===================== */

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
      <h2 className="text-sm font-semibold text-slate-900">{title}</h2>
      {children}
    </section>
  );
}

function Input({ label, ...props }: any) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <input
        {...props}
        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#52C4FF]"
      />
    </label>
  );
}

function Select({ label, children, ...props }: any) {
  return (
    <label className="space-y-1">
      <span className="text-xs font-medium text-slate-600">{label}</span>
      <select
        {...props}
        className="w-full px-3 py-2 text-sm border border-slate-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#52C4FF]"
      >
        {children}
      </select>
    </label>
  );
}

/* =====================
   Main Page
===================== */

export default function AddNewServicePage() {
  const router = useRouter();

  const [form, setForm] = useState<any>({
    name: '', location: '', contact: '', website: '', status: '', timings: '', rating: '', tags: '',
    labelType: 'place', label: '', categoryLabel: '', newLabel: '', newCategoryLabel: '',
  });

  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [bookings, setBookings] = useState([{ id: uuidv4(), type: '', price: '', note: '' }]);
  const [businessId, setBusinessId] = useState('');
  const [placeOptions, setPlaceOptions] = useState<string[]>([]);
  const [serviceOptions, setServiceOptions] = useState<string[]>([]);
  const [placeCategoryMap, setPlaceCategoryMap] = useState<Record<string, string[]>>({});
  const [serviceCategoryMap, setServiceCategoryMap] = useState<Record<string, string[]>>({});
  const [planFeatures, setPlanFeatures] = useState({ allow_booking: false, allow_gallery: false, allow_video: false });
  const [amenities, setAmenities] = useState<any[]>([]);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [error, setError] = useState('');

  const getAuthConfig = () => ({
    headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
  });

  /* ---------------- Fetch Init Data ---------------- */
  useEffect(() => {
    const init = async () => {
      try {
        const bizRes = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/businesses/my`, getAuthConfig());
        setBusinessId(bizRes.data.id);
        setPlanFeatures({
          allow_booking: !!bizRes.data.plan?.allow_booking,
          allow_gallery: !!bizRes.data.plan?.allow_gallery,
          allow_video: !!bizRes.data.plan?.allow_video,
        });

        const [servicesRes, placesRes, amenitiesRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/services`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/places`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/amenities`),
        ]);

        const serviceMap: any = {};
        servicesRes.data.data.forEach((s: any) => serviceMap[s.label] = s.subcategories?.map((x: any) => x.label) || []);
        setServiceCategoryMap(serviceMap);
        setServiceOptions(Object.keys(serviceMap));

        const placeMap: any = {};
        placesRes.data.data.forEach((p: any) => placeMap[p.label] = p.subcategories?.map((x: any) => x.label) || []);
        setPlaceCategoryMap(placeMap);
        setPlaceOptions(Object.keys(placeMap));

        setAmenities(amenitiesRes.data);
      } catch (e) {
        console.error(e);
        router.push('/business/dashboard');
      }
    };

    init();
  }, [router]);

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setForm((p: any) => ({ ...p, [name]: value, ...(name === 'label' ? { categoryLabel: '' } : {}) }));
  };

  /* ---------------- Submit ---------------- */
  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setError('');

    if (!selectedPosition) {
      setError('Please select a location on the map');
      return;
    }

    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, v as any));

    fd.append('business_id', businessId);
    fd.append('latitude', String(selectedPosition.lat));
    fd.append('longitude', String(selectedPosition.lng));
    fd.append('selectedAmenities', JSON.stringify(selectedAmenities));
    if (planFeatures.allow_booking) fd.append('bookings', JSON.stringify(bookings));

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/businesses/add-detail`, fd, {
        ...getAuthConfig(),
        headers: { ...getAuthConfig().headers, 'Content-Type': 'multipart/form-data' },
      });
      router.push('/business/dashboard');
    } catch (e: any) {
      setError(e.response?.data?.message || 'Failed to add service');
    }
  };

  /* =====================
     UI
  ===================== */

  return (
    <div className="min-h-screen bg-slate-50">
      <form onSubmit={handleSubmit} className="max-w-screen-2xl mx-auto px-6 py-8 space-y-10">

        {/* Header */}
        <header className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900">Add New Service</h1>
          <p className="text-sm text-slate-500">Create a new listing for your business</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-8">
            <Card title="Basic Details">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Service Name" name="name" value={form.name} onChange={handleChange} />
                <Input label="Location" name="location" value={form.location} onChange={handleChange} />
                <Input label="Contact" name="contact" value={form.contact} onChange={handleChange} />
                <Input label="Website" name="website" value={form.website} onChange={handleChange} />
                <Input label="Status" name="status" value={form.status} onChange={handleChange} />
                <Input label="Timings" name="timings" value={form.timings} onChange={handleChange} />
                <Input label="Rating" type="number" name="rating" value={form.rating} onChange={handleChange} />
                <Input label="Tags" name="tags" value={form.tags} onChange={handleChange} />
              </div>
            </Card>

            {planFeatures.allow_booking && (
              <Card title="Booking Options">
                {bookings.map((b, i) => (
                  <div key={b.id} className="grid grid-cols-12 gap-3">
                    <input className="col-span-3 input" placeholder="Type" value={b.type} />
                    <input className="col-span-2 input" placeholder="Price" />
                    <input className="col-span-6 input" placeholder="Note" />
                    {i > 0 && <button type="button" className="text-xs text-red-600">Remove</button>}
                  </div>
                ))}
                <button type="button" className="text-sm text-[#52C4FF]">+ Add booking</button>
              </Card>
            )}

            <Card title="Categorization">
              <div className="space-y-4">
                <Select label="Type" name="labelType" value={form.labelType} onChange={handleChange}>
                  <option value="place">Place</option>
                  <option value="service">Service</option>
                </Select>

                <Select label="Label" name="label" value={form.label} onChange={handleChange}>
                  <option value="">Select</option>
                  {(form.labelType === 'place' ? placeOptions : serviceOptions).map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                  <option value="__new__">Add New</option>
                </Select>

                {form.label === '__new__' && (
                  <Input label="New Label" name="newLabel" value={form.newLabel} onChange={handleChange} />
                )}

                <Select label="Category" name="categoryLabel" value={form.categoryLabel} onChange={handleChange}>
                  <option value="">Select</option>
                  {(form.labelType === 'place' ? placeCategoryMap[form.label] : serviceCategoryMap[form.label])?.map(c => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                  <option value="__new__">Add New</option>
                </Select>

                {form.categoryLabel === '__new__' && (
                  <Input label="New Category" name="newCategoryLabel" value={form.newCategoryLabel} onChange={handleChange} />
                )}
              </div>
            </Card>
          </div>

          {/* RIGHT */}
          <div className="space-y-8">
            <Card title="Location">
              <MapPicker selectedPosition={selectedPosition} onSelect={(lat: number, lng: number) => setSelectedPosition({ lat, lng })} />
              {error && <p className="text-xs text-red-600">{error}</p>}
            </Card>

            <Card title="Amenities">
              <div className="grid grid-cols-2 gap-3 max-h-56 overflow-y-auto">
                {amenities.map(a => (
                  <label key={a.id} className="flex items-center gap-2 text-sm">
                    <input type="checkbox" checked={selectedAmenities.includes(a.id)} onChange={() => {
                      setSelectedAmenities(p => p.includes(a.id) ? p.filter(x => x !== a.id) : [...p, a.id]);
                    }} />
                    <span>{a.name}</span>
                  </label>
                ))}
              </div>
            </Card>
          </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
          <button className="px-6 py-3 rounded-md bg-[#52C4FF] text-white font-medium hover:opacity-90">
            Add Service
          </button>
        </div>
      </form>
    </div>
  );
}
