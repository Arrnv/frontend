// File: app/businesses/onboard/page.tsx
'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const BusinessOnboardingPage = () => {
  const [form, setForm] = useState({
    businessName: '',
    businessLocation: '',
    contact: '',
    website: '',
    detailName: '',
    rating: '',
    detailLocation: '',
    status: '',
    timings: '',
    detailContact: '',
    detailWebsite: '',
    tags: '',
    latitude: '',
    longitude: '',
    labelType: 'place', // either 'place' or 'service'
    label: '',
    categoryLabel: '',
    newLabel: '',
    newCategoryLabel: '',
  });

  const [placeOptions, setPlaceOptions] = useState<string[]>([]);
  const [serviceOptions, setServiceOptions] = useState<string[]>([]);
  const [placeCatOptions, setPlaceCatOptions] = useState<string[]>([]);
  const [serviceCatOptions, setServiceCatOptions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchMeta = async () => {
      try {
        const [servicesRes, placesRes] = await Promise.all([
          axios.get('http://localhost:8000/api/services'),
          axios.get('http://localhost:8000/api/places'),
        ]);

        const services = servicesRes.data.data;
        const serviceLabels = [...new Set(services.map((s: any) => s.label))];
        const serviceCategoryLabels = [
          ...new Set(services.flatMap((s: any) => s.subcategories?.map((sc: any) => sc.label) || [])),
        ];

        const places = placesRes.data.data;
        const placeLabels = [...new Set(places.map((p: any) => p.label))];
        const placeCategoryLabels = [
          ...new Set(places.flatMap((p: any) => p.subcategories?.map((pc: any) => pc.label) || [])),
        ];

        setPlaceOptions(placeLabels as string[]);
        setServiceOptions(serviceLabels as string[]);
        setPlaceCatOptions(placeCategoryLabels as string[]);
        setServiceCatOptions(serviceCategoryLabels as string[]);
      } catch (err) {
        console.error('Metadata fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeta();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleCancel = () => {
    router.push('/');
  };

  const handleDeleteNewLabel = () => {
    setForm({ ...form, newLabel: '', label: '' });
  };

  const handleDeleteNewCategory = () => {
    setForm({ ...form, newCategoryLabel: '', categoryLabel: '' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError('');

  let label = form.label === '__new__' ? form.newLabel : form.label;
  let categoryLabel = form.categoryLabel === '__new__' ? form.newCategoryLabel : form.categoryLabel;

  const payload = {
        name: form.businessName,
        location: form.businessLocation,
        contact: form.contact,
        website: form.website,
        detailName: form.detailName,
        detailLocation: form.detailLocation,
        detailContact: form.detailContact,
        detailWebsite: form.detailWebsite,
        status: form.status,
        timings: form.timings,
        rating: form.rating,
        tags: form.tags,
        latitude: form.latitude,
        longitude: form.longitude,
        placeLabel: form.labelType === 'place' ? label : '',
        placeCategoryLabel: form.labelType === 'place' ? categoryLabel : '',
        serviceLabel: form.labelType === 'service' ? label : '',
        serviceCategoryLabel: form.labelType === 'service' ? categoryLabel : '',
    };

    try {
        await axios.post('http://localhost:8000/businesses/onboard', payload, {
        withCredentials: true,
        });
        router.push('/business/dashboard');
    } catch (err: any) {
        setError(err.response?.data?.message || 'Onboarding failed');
    }
    };


  if (loading) return <p className="text-center py-6">Loading options...</p>;

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-2">Business Onboarding</h1>

      {/* BUSINESS INFO */}
      <div className="border p-4 rounded space-y-2">
        <h2 className="font-semibold text-lg">Business Info</h2>
        <input name="businessName" value={form.businessName} onChange={handleChange} placeholder="Business Name" className="w-full p-2 border rounded" />
        <input name="businessLocation" value={form.businessLocation} onChange={handleChange} placeholder="Business Location" className="w-full p-2 border rounded" />
        <input name="contact" value={form.contact} onChange={handleChange} placeholder="Contact" className="w-full p-2 border rounded" />
        <input name="website" value={form.website} onChange={handleChange} placeholder="Website" className="w-full p-2 border rounded" />
      </div>

      {/* DETAIL INFO */}
      <div className="border p-4 rounded space-y-2">
        <h2 className="font-semibold text-lg">Business Detail</h2>
        <input name="detailName" value={form.detailName} onChange={handleChange} placeholder="Detail Name" className="w-full p-2 border rounded" />
        <input name="detailLocation" value={form.detailLocation} onChange={handleChange} placeholder="Detail Location" className="w-full p-2 border rounded" />
        <input name="detailContact" value={form.detailContact} onChange={handleChange} placeholder="Detail Contact" className="w-full p-2 border rounded" />
        <input name="detailWebsite" value={form.detailWebsite} onChange={handleChange} placeholder="Detail Website" className="w-full p-2 border rounded" />
        <input name="status" value={form.status} onChange={handleChange} placeholder="Status (open/closed)" className="w-full p-2 border rounded" />
        <input name="timings" value={form.timings} onChange={handleChange} placeholder="Timings (e.g. 9AM - 9PM)" className="w-full p-2 border rounded" />
        <input name="rating" value={form.rating} onChange={handleChange} placeholder="Rating" className="w-full p-2 border rounded" />
        <input name="tags" value={form.tags} onChange={handleChange} placeholder="Tags (comma-separated)" className="w-full p-2 border rounded" />
        <input name="latitude" value={form.latitude} onChange={handleChange} placeholder="Latitude" className="w-full p-2 border rounded" />
        <input name="longitude" value={form.longitude} onChange={handleChange} placeholder="Longitude" className="w-full p-2 border rounded" />
      </div>

      {/* SELECTION */}
      <div className="border p-4 rounded space-y-2">
        <h2 className="font-semibold text-lg">Categorization</h2>
        <select name="labelType" value={form.labelType} onChange={handleChange} className="w-full p-2 border rounded">
          <option value="place">Place</option>
          <option value="service">Service</option>
        </select>

        {form.labelType === 'place' ? (
          <>
            <select name="label" value={form.label} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">-- Select Place --</option>
              {placeOptions.map((label) => <option key={label} value={label}>{label}</option>)}
              <option value="__new__">+ Add new place</option>
            </select>
            {form.label === '__new__' && (
              <div className="flex gap-2">
                <input name="newLabel" value={form.newLabel} onChange={handleChange} placeholder="New Place Label" className="w-full p-2 border rounded" />
                <button type="button" onClick={handleDeleteNewLabel} className="bg-red-100 px-2 rounded text-sm">✕</button>
              </div>
            )}
            <select name="categoryLabel" value={form.categoryLabel} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">-- Select Place Category --</option>
              {placeCatOptions.map((label) => <option key={label} value={label}>{label}</option>)}
              <option value="__new__">+ Add new category</option>
            </select>
            {form.categoryLabel === '__new__' && (
              <div className="flex gap-2">
                <input name="newCategoryLabel" value={form.newCategoryLabel} onChange={handleChange} placeholder="New Place Category" className="w-full p-2 border rounded" />
                <button type="button" onClick={handleDeleteNewCategory} className="bg-red-100 px-2 rounded text-sm">✕</button>
              </div>
            )}
          </>
        ) : (
          <>
            <select name="label" value={form.label} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">-- Select Service --</option>
              {serviceOptions.map((label) => <option key={label} value={label}>{label}</option>)}
              <option value="__new__">+ Add new service</option>
            </select>
            {form.label === '__new__' && (
              <div className="flex gap-2">
                <input name="newLabel" value={form.newLabel} onChange={handleChange} placeholder="New Service Label" className="w-full p-2 border rounded" />
                <button type="button" onClick={handleDeleteNewLabel} className="bg-red-100 px-2 rounded text-sm">✕</button>
              </div>
            )}
            <select name="categoryLabel" value={form.categoryLabel} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">-- Select Service Category --</option>
              {serviceCatOptions.map((label) => <option key={label} value={label}>{label}</option>)}
              <option value="__new__">+ Add new category</option>
            </select>
            {form.categoryLabel === '__new__' && (
              <div className="flex gap-2">
                <input name="newCategoryLabel" value={form.newCategoryLabel} onChange={handleChange} placeholder="New Service Category" className="w-full p-2 border rounded" />
                <button type="button" onClick={handleDeleteNewCategory} className="bg-red-100 px-2 rounded text-sm">✕</button>
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex gap-4">
        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          Submit
        </button>
        <button type="button" onClick={handleCancel} className="w-full bg-gray-300 text-black py-2 rounded hover:bg-gray-400">
          Cancel
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}
    </form>
  );
};

export default BusinessOnboardingPage;
