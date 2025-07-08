'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('@/components/MapPicker'), { ssr: false });

const AddNewServicePage = () => {
  const [form, setForm] = useState({
    name: '', location: '', contact: '', website: '', status: '', timings: '', rating: '', tags: '',
    latitude: '', longitude: '', labelType: 'place', label: '', categoryLabel: '',
    newLabel: '', newCategoryLabel: '', booking_url: '', gallery_urls: '', video_url: '',
  });
  const [selectedPosition, setSelectedPosition] = useState<{ lat: number; lng: number } | null>(null);
  const [bookings, setBookings] = useState([{ id: uuidv4(), type: '', price: '', note: '' }]);
  const [businessId, setBusinessId] = useState('');
  const [placeOptions, setPlaceOptions] = useState<string[]>([]);
  const [serviceOptions, setServiceOptions] = useState<string[]>([]);
  const [placeCatOptions, setPlaceCatOptions] = useState<string[]>([]);
  const [serviceCatOptions, setServiceCatOptions] = useState<string[]>([]);
  const [planFeatures, setPlanFeatures] = useState({ allow_booking: false, allow_gallery: false, allow_video: false });
  const [error, setError] = useState('');
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
    const [amenities, setAmenities] = useState<{ id: string; name: string; icon_url: string }[]>([]);
    const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bizRes, servicesRes, placesRes, amenitiesRes] = await Promise.all([
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/businesses/my`, { withCredentials: true }),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/services`),
          axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/places`),
           axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/amenities`),
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
        setAmenities(amenitiesRes.data); // assuming it's correct

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

    if (!selectedPosition) {
      setError('Please select a location on the map.');
      return;
    }

    form.latitude = String(selectedPosition.lat);
    form.longitude = String(selectedPosition.lng);

    const label = form.label === '__new__' ? form.newLabel : form.label;
    const categoryLabel = form.categoryLabel === '__new__' ? form.newCategoryLabel : form.categoryLabel;

    const formData = new FormData();

    formData.append('name', form.name);
    formData.append('location', form.location);
    formData.append('contact', form.contact);
    formData.append('website', form.website);
    formData.append('status', form.status);
    formData.append('timings', form.timings);
    formData.append('rating', form.rating);
    formData.append('tags', form.tags);
    formData.append('latitude', form.latitude);
    formData.append('longitude', form.longitude);
    formData.append('business_id', businessId);
    formData.append('labelType', form.labelType);
    formData.append('placeLabel', form.labelType === 'place' ? label : '');
    formData.append('placeCategoryLabel', form.labelType === 'place' ? categoryLabel : '');
    formData.append('serviceLabel', form.labelType === 'service' ? label : '');
    formData.append('serviceCategoryLabel', form.labelType === 'service' ? categoryLabel : '');
    formData.append('selectedAmenities', JSON.stringify(selectedAmenities));


    if (planFeatures.allow_booking) formData.append('booking_url', form.booking_url);
    if (planFeatures.allow_gallery && galleryFiles.length > 0) {
      galleryFiles.forEach(file => formData.append('galleryFiles', file));
    }
    if (planFeatures.allow_video && videoFile) {
      formData.append('videoFile', videoFile);
    }
    if (planFeatures.allow_booking) {
      formData.append('bookings', JSON.stringify(bookings));
    }

    try {
      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/businesses/add-detail`, formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
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

      <div>
        <h3 className="font-semibold">Select Location on Map</h3>
        <MapPicker
          selectedPosition={selectedPosition}
          onSelect={(lat, lng) => setSelectedPosition({ lat, lng })}
        />
      </div>
      <div className="border p-4 rounded space-y-2">
        <h2 className="font-semibold text-lg">Select Amenities</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {amenities.map(a => (
            <label key={a.id} className="flex items-center gap-2">
              <input
                type="checkbox"
                value={a.id}
                checked={selectedAmenities.includes(a.id)}
                onChange={e => {
                  if (e.target.checked)
                    setSelectedAmenities(prev => [...prev, a.id]);
                  else
                    setSelectedAmenities(prev => prev.filter(id => id !== a.id));
                }}
              />
              <img src={a.icon_url} alt={a.name} className="w-5 h-5" />
              <span>{a.name}</span>
            </label>
          ))}
        </div>
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

      {planFeatures.allow_gallery && (
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={e => setGalleryFiles(Array.from(e.target.files || []))}
          className="w-full p-2 border rounded"
        />
      )}

      {planFeatures.allow_video && (
        <input
          type="file"
          accept="video/*"
          onChange={e => setVideoFile(e.target.files?.[0] || null)}
          className="w-full p-2 border rounded"
        />
      )}

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
function setAmenities(data: any) {
  throw new Error('Function not implemented.');
}

