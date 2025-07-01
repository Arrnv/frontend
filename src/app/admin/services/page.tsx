'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import AdminNavbar from '@/components/AdminNavbar';

interface Service {
  id: string;
  name: string;
  status: 'approved' | 'pending';
  business_name: string;
  owner_email: string;
  category: string;
  type: 'Place' | 'Service';
}


export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved'>('all');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [placeFilter, setPlaceFilter] = useState('');
  const [appliedFilters, setAppliedFilters] = useState({ status: 'all', category: '', place: '' });
  const [topRated, setTopRated] = useState<any[]>([]);
  const [mostViewed, setMostViewed] = useState<any[]>([]);

  const fetchServices = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (appliedFilters.category) queryParams.append('category', appliedFilters.category);
      if (appliedFilters.place) queryParams.append('place', appliedFilters.place);
      const url = `http://localhost:8000/admin/services?${queryParams.toString()}`;

      const res = await axios.get(url, { withCredentials: true });
      setServices(res.data);
    } catch (err) {
      console.error('Error fetching services:', err);
      alert('Failed to fetch services');
    }
  };

  useEffect(() => {
    fetchServices();
    fetchTopRated();
    fetchMostViewed();
  }, [appliedFilters]);

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    if (status === 'rejected' && !confirm('Reject and delete this service?')) return;

    try {
      await axios.put(`http://localhost:8000/admin/services/${id}/status`, { status }, { withCredentials: true });
      setServices(prev =>
        status === 'approved'
          ? prev.map(s => (s.id === id ? { ...s, status: 'approved' } : s))
          : prev.filter(s => s.id !== id)
      );
    } catch (err) {
      console.error('Failed to update status:', err);
      alert('Failed to update status');
    }
  };
 const fetchTopRated = async () => {
  try {
    const res = await axios.get('http://localhost:8000/admin/services/stats/top-rated', {
      withCredentials: true,
    });
    setTopRated(res.data);
  } catch (err) {
    console.error('Error fetching top-rated services:', err);
  }
};

const fetchMostViewed = async () => {
  try {
    const res = await axios.get('http://localhost:8000/admin/services/stats/most-viewed', {
      withCredentials: true,
    });
    setMostViewed(res.data);
  } catch (err) {
    console.error('Error fetching most viewed services:', err);
  }
}
  // Group by business
  const grouped = services
    .filter(s => appliedFilters.status === 'all' || s.status === appliedFilters.status)
    .reduce<Record<string, Service[]>>((acc, service) => {
      if (!acc[service.business_name]) acc[service.business_name] = [];
      acc[service.business_name].push(service);
      return acc;
    }, {});

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      <AdminNavbar/>
      <h1 className="text-2xl font-bold">Service Management</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 mb-4 items-center">
        <div>
          <label className="block text-sm font-semibold">Status:</label>
          <select
            className="border rounded px-2 py-1"
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value as 'all' | 'pending' | 'approved')}
          >
            <option value="all">All</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold">Category:</label>
          <input
            type="text"
            placeholder="e.g. Salon"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold">Place:</label>
          <input
            type="text"
            placeholder="e.g. Mumbai"
            value={placeFilter}
            onChange={e => setPlaceFilter(e.target.value)}
            className="border px-2 py-1 rounded"
          />
        </div>

        <button
          onClick={() =>
            setAppliedFilters({ status: statusFilter, category: categoryFilter, place: placeFilter })
          }
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Filter
        </button>
      </div>
      {/* Analytics Section */}
        <div className="grid md:grid-cols-2 gap-6">
            {/* Top Rated */}
            <div className="bg-white shadow p-4 rounded border">
            <h3 className="text-lg font-semibold mb-2">Top Rated Services</h3>
            <ul className="text-sm list-disc list-inside space-y-1">
                {topRated.length === 0 ? (
                <li>No data</li>
                ) : (
                topRated.map(item => (
                    <li key={item.detail_id}>
                    {item.name || 'Unnamed'} — Avg Rating: {item.avg_rating?.toFixed(2) ?? 'N/A'}
                    </li>
                ))
                )}
            </ul>
            </div>

            {/* Most Viewed */}
            <div className="bg-white shadow p-4 rounded border">
            <h3 className="text-lg font-semibold mb-2">Most Viewed Services</h3>
            <ul className="text-sm list-disc list-inside space-y-1">
                {mostViewed.length === 0 ? (
                    <li>No data</li>
                ) : (
                    mostViewed.map(item => (
                    <li key={item.detail_id}>
                        {item.details?.name || 'Unnamed'} — Views: {item.total_views ?? 0}
                    </li>
                    ))
                )}
            </ul>

            </div>

        </div>

      {/* Grouped Tree View */}
      {Object.entries(grouped).map(([businessName, services]) => (
        <div key={businessName} className="border rounded shadow p-4 mb-4 bg-white">
          <h2 className="text-xl font-semibold mb-2">{businessName}</h2>
          <table className="w-full table-auto">
            <thead>
            <tr className="bg-gray-100 text-sm">
                <th className="p-2 border">Name</th><th className="p-2 border">Type</th>
                <th className="p-2 border">Category</th><th className="p-2 border">Business</th>
                <th className="p-2 border">Email</th><th className="p-2 border">Status</th>
                <th className="p-2 border">Actions</th>
            </tr>
            </thead>

            <tbody>
                {services.map(service => (
                    <tr key={service.id} className="text-center">
                    <td className="p-2 border">{service.name}</td>
                    <td className="p-2 border">{service.type}</td>
                    <td className="p-2 border">{service.category}</td>
                    <td className="p-2 border">{service.business_name}</td>
                    <td className="p-2 border">{service.owner_email}</td>
                    <td className="p-2 border">{service.status}</td>
                    <td className="p-2 border space-x-2">
                        {service.status === 'pending' && (
                        <>
                            <button
                            onClick={() => updateStatus(service.id, 'approved')}
                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                            >
                            Approve
                            </button>
                            <button
                            onClick={() => updateStatus(service.id, 'rejected')}
                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                            >
                            Reject
                            </button>
                        </>
                        )}
                    </td>
                    </tr>
                ))}
                </tbody>

          </table>
        </div>
      ))}
    </div>
  );
}
