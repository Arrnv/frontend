'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import dynamic from 'next/dynamic';

// Dynamically import Leaflet Map component to prevent SSR issues
const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false });

const AddNewServicePage = () => {
  const [form, setForm] = useState({
    name: '', location: '', contact: '', website: '', status: '', timings: '', rating: '', tags: '',
    latitude: '', longitude: '', labelType: 'place', label: '', categoryLabel: '',
    newLabel: '', newCategoryLabel: '', booking_url: '', gallery_urls: '', video_url: '',
  });

  const [bookings, setBookings] = useState([{ id: uuidv4(), type: '', price: '', note: '' }]);
  const [businessId, setBusinessId] = useState('');
  const [placeOptions, setPlaceOptions] = useState<string[]>([]);
  const [serviceOptions, setServiceOptions] = useState<string[]>([]);
  const [placeCatOptions, setPlaceCatOptions] = useState<string[]>([]);
  const [serviceCatOptions, setServiceCatOptions] = useState<string[]>([]);
  const [planFeatures, setPlanFeatures] = useState({ allow_booking: false, allow_gallery: false, allow_video: false });
  const [error, setError] = useState('');
  

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bizRes, servicesRes, placesRes] = await Promise.all([
          axios.get('http://localhost:8000/businesses/my', { withCredentials: true }),
          axios.get('http://localhost:8000/api/services'),
          axios.get('http://localhost:8000/api/places'),
        ]);

        setBusinessId(bizRes.data.id);
        setPlanFeatures({
          allow_booking: bizRes.data.plan?.allow_booking || false,
          allow_gallery: bizRes.data.plan?.allow_gallery || false,
          allow_video: bizRes.data.plan?.allow_video || false,
        });

        const services = servicesRes.data.data as { label: string; subcategories?: { label: string }[] }[];
        const places = placesRes.data.data as { label: string; subcategories?: { label: string }[] }[];

        setServiceOptions([...new Set(services.map(s => s.label))]);
        setServiceCatOptions([...new Set(services.flatMap(s => s.subcategories?.map(sc => sc.label) || []))]);
        setPlaceOptions([...new Set(places.map(p => p.label))]);
        setPlaceCatOptions([...new Set(places.flatMap(p => p.subcategories?.map(pc => pc.label) || []))]);
      } catch (err) {
        console.error('Error fetching business or categories:', err);
        router.push('/business/dashboard');
      }
    };

    fetchData();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleBookingChange = (id: string, field: string, value: string) => {
    setBookings(prev => prev.map(b => b.id === id ? { ...b, [field]: value } : b));
  };

  const addBooking = () => setBookings([...bookings, { id: uuidv4(), type: '', price: '', note: '' }]);
  const removeBooking = (id: string) => setBookings(bookings.filter(b => b.id !== id));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const label = form.label === '__new__' ? form.newLabel : form.label;
    const categoryLabel = form.categoryLabel === '__new__' ? form.newCategoryLabel : form.categoryLabel;

    const payload = {
      ...form,
      rating: parseFloat(form.rating),
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      tags: form.tags.split(',').map(t => t.trim()),
      business_id: businessId,
      placeLabel: form.labelType === 'place' ? label : '',
      placeCategoryLabel: form.labelType === 'place' ? categoryLabel : '',
      serviceLabel: form.labelType === 'service' ? label : '',
      serviceCategoryLabel: form.labelType === 'service' ? categoryLabel : '',
      booking_url: planFeatures.allow_booking ? form.booking_url : null,
      gallery_urls: planFeatures.allow_gallery ? form.gallery_urls.split(',').map(i => i.trim()) : [],
      video_url: planFeatures.allow_video ? form.video_url : null,
      bookings: planFeatures.allow_booking ? bookings : [],
    };

    try {
      await axios.post('http://localhost:8000/businesses/add-detail', payload, {
        withCredentials: true,
      });
      router.push('/business/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add new service');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Service</h1>

      {["name", "location", "contact", "website", "status", "timings", "rating", "tags"].map(field => (
        <input key={field} name={field} placeholder={field} className="w-full p-2 border rounded" onChange={handleChange} />
      ))}

      {/* Map Picker */}
      <div>
        <h3 className="font-semibold">Select Location on Map</h3>
        <MapPicker onSelect={(lat, lng) => {
          setForm(prev => ({ ...prev, latitude: lat.toString(), longitude: lng.toString() }));
        }} />
      </div>

      {planFeatures.allow_booking && bookings.map(b => (
        <div key={b.id} className="grid grid-cols-3 gap-2 items-end">
          <input placeholder="Type" value={b.type} className="p-2 border rounded" onChange={e => handleBookingChange(b.id, 'type', e.target.value)} />
          <input placeholder="Price" type="number" value={b.price} className="p-2 border rounded" onChange={e => handleBookingChange(b.id, 'price', e.target.value)} />
          <div className="flex items-center gap-2">
            <input placeholder="Note" value={b.note} className="p-2 border rounded w-full" onChange={e => handleBookingChange(b.id, 'note', e.target.value)} />
            {bookings.length > 1 && <button type="button" onClick={() => removeBooking(b.id)} className="text-red-600">X</button>}
          </div>
        </div>
      ))}
      {planFeatures.allow_booking && <button type="button" onClick={addBooking} className="text-blue-600 underline mt-2">+ Add another booking</button>}

      {planFeatures.allow_gallery && <input name="gallery_urls" placeholder="Gallery URLs (comma-separated)" className="w-full p-2 border rounded" onChange={handleChange} />}
      {planFeatures.allow_video && <input name="video_url" placeholder="Video URL" className="w-full p-2 border rounded" onChange={handleChange} />}

      <div className="border p-4 rounded space-y-2">
        <h2 className="font-semibold text-lg">Categorization</h2>
        <select name="labelType" value={form.labelType} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="place">Place</option>
          <option value="service">Service</option>
        </select>
        <select name="label" value={form.label} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">-- Select {form.labelType} --</option>
          {(form.labelType === 'place' ? placeOptions : serviceOptions).map(label => (
            <option key={label} value={label}>{label}</option>
          ))}
          <option value="__new__">+ Add new {form.labelType}</option>
        </select>
        {form.label === '__new__' && <input name="newLabel" value={form.newLabel} onChange={handleChange} placeholder={`New ${form.labelType} Label`} className="w-full p-2 border rounded" />}
        <select name="categoryLabel" value={form.categoryLabel} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="">-- Select {form.labelType} Category --</option>
          {(form.labelType === 'place' ? placeCatOptions : serviceCatOptions).map(label => (
            <option key={label} value={label}>{label}</option>
          ))}
          <option value="__new__">+ Add new Category</option>
        </select>
        {form.categoryLabel === '__new__' && <input name="newCategoryLabel" value={form.newCategoryLabel} onChange={handleChange} placeholder={`New ${form.labelType} Category`} className="w-full p-2 border rounded" />}
      </div>

      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Add Service</button>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
    </form>
  );
};

export default AddNewServicePage;
