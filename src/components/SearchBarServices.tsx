'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type Category = {
  id: string;
  label: string;
  icon_url: string;
};

const SearchBarServices = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filtered, setFiltered] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/search/services`);
        setCategories(res.data);
      } catch (err) {
        console.error('Failed to fetch service categories', err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const term = searchTerm.toLowerCase();
    const filtered = categories.filter(c => c.label.toLowerCase().includes(term));
    setFiltered(term ? filtered : []);
  }, [searchTerm]);

  const handleSelect = (category: Category) => {
    router.push(`/customer/Services?type=services&subcategory=${category.id}`);
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      <input
        type="text"
        value={searchTerm}
        placeholder="Search services..."
        onChange={(e) => setSearchTerm(e.target.value)}
        className="w-full px-4 py-2 border rounded-lg"
      />
      {filtered.length > 0 && (
        <ul className="absolute w-full mt-1 bg-white shadow-md rounded-lg z-50">
          {filtered.map((cat) => (
            <li
              key={cat.id}
              className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer text-black"
              onClick={() => handleSelect(cat)}
            >
              {cat.icon_url && <img src={cat.icon_url} className="w-5 h-5" />}
              <span>{cat.label}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBarServices;
