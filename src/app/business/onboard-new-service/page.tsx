'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

const AddNewServicePage = () => {
  const [form, setForm] = useState({
    name: '',
    location: '',
    contact: '',
    website: '',
    status: '',
    timings: '',
    rating: '',
    tags: '',
    latitude: '',
    longitude: '',
    labelType: 'place',
    label: '',
    categoryLabel: '',
    newLabel: '',
    newCategoryLabel: '',
  });

  const [businessId, setBusinessId] = useState('');
  const [placeOptions, setPlaceOptions] = useState<string[]>([]);
  const [serviceOptions, setServiceOptions] = useState<string[]>([]);
  const [placeCatOptions, setPlaceCatOptions] = useState<string[]>([]);
  const [serviceCatOptions, setServiceCatOptions] = useState<string[]>([]);
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

        const services = servicesRes.data.data;
        const places = placesRes.data.data;

        setServiceOptions([...new Set(services.map((s: any) => s.label))] as string[] );
        setServiceCatOptions([
          ...new Set(services.flatMap((s: any) => s.subcategories?.map((sc: any) => sc.label) || [])),
        ] as string[]);

        setPlaceOptions([...new Set(places.map((p: any) => p.label))] as string[]);
        setPlaceCatOptions([
          ...new Set(places.flatMap((p: any) => p.subcategories?.map((pc: any) => pc.label) || [])),
        ] as string[]);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const label = form.label === '__new__' ? form.newLabel : form.label;
    const categoryLabel =
      form.categoryLabel === '__new__' ? form.newCategoryLabel : form.categoryLabel;

    const payload = {
      ...form,
      rating: parseFloat(form.rating),
      latitude: parseFloat(form.latitude),
      longitude: parseFloat(form.longitude),
      tags: form.tags.split(',').map((t) => t.trim()),
      business_id: businessId,
      placeLabel: form.labelType === 'place' ? label : '',
      placeCategoryLabel: form.labelType === 'place' ? categoryLabel : '',
      serviceLabel: form.labelType === 'service' ? label : '',
      serviceCategoryLabel: form.labelType === 'service' ? categoryLabel : '',
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

  const handleDeleteNewLabel = () => setForm({ ...form, newLabel: '', label: '' });
  const handleDeleteNewCategory = () => setForm({ ...form, newCategoryLabel: '', categoryLabel: '' });

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4 p-4">
      <h1 className="text-2xl font-bold mb-4">Add New Service</h1>

      <input name="name" placeholder="Service Name" className="w-full p-2 border rounded" onChange={handleChange} />
      <input name="location" placeholder="Location" className="w-full p-2 border rounded" onChange={handleChange} />
      <input name="contact" placeholder="Contact" className="w-full p-2 border rounded" onChange={handleChange} />
      <input name="website" placeholder="Website" className="w-full p-2 border rounded" onChange={handleChange} />
      <input name="status" placeholder="Status (e.g. Open)" className="w-full p-2 border rounded" onChange={handleChange} />
      <input name="timings" placeholder="Timings (e.g. 10AM - 9PM)" className="w-full p-2 border rounded" onChange={handleChange} />
      <input name="rating" placeholder="Rating (1-5)" className="w-full p-2 border rounded" onChange={handleChange} />
      <input name="tags" placeholder="Tags (comma-separated)" className="w-full p-2 border rounded" onChange={handleChange} />
      <input name="latitude" placeholder="Latitude" className="w-full p-2 border rounded" onChange={handleChange} />
      <input name="longitude" placeholder="Longitude" className="w-full p-2 border rounded" onChange={handleChange} />

      {/* CATEGORY SELECTION */}
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
                <button type="button" onClick={handleDeleteNewLabel} className="px-2 bg-red-200 rounded">✕</button>
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
                <button type="button" onClick={handleDeleteNewCategory} className="px-2 bg-red-200 rounded">✕</button>
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
                <button type="button" onClick={handleDeleteNewLabel} className="px-2 bg-red-200 rounded">✕</button>
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
                <button type="button" onClick={handleDeleteNewCategory} className="px-2 bg-red-200 rounded">✕</button>
              </div>
            )}
          </>
        )}
      </div>

      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">
        Add Service
      </button>

      {error && <p className="text-red-600 text-sm">{error}</p>}
    </form>
  );
};

export default AddNewServicePage;
