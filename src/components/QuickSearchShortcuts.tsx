'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

type Subcategory = {
  id: string;
  label: string;
  icon_url?: string;
};

const QuickSearchShortcuts = () => {
  const [shortcuts, setShortcuts] = useState<Subcategory[]>([]);
  const router = useRouter();

  useEffect(() => {
    const fetchSpecificSubcategories = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/services`);
        const services = res.data?.data || [];

        const TARGET_LABELS = [
          'Truck Stop',
          'Cross docking',
        ];

        // Filter and flatten based on labels
        const filtered = services.flatMap((service: any) =>
          (service.subcategories || [])
            .filter((sub: any) => TARGET_LABELS.includes(sub.label))
            .map((sub: any) => ({
              id: sub.id,
              label: sub.label,
              icon_url: sub.icon_url || service.icon_url,
            }))
        );

        setShortcuts(filtered);
      } catch (err) {
        console.error('⚠️ Failed to fetch shortcuts:', err);
      }
    };

    fetchSpecificSubcategories();
  }, []);

  const handleClick = (item: Subcategory) => {
    router.push(`/customer/Services?type=services&subcategory=${item.id}`);
  };

  return (
    <div className="w-full overflow-hidden ">
      <div className="flex gap-1 min-w-max bg-white  shadow-sm">
        {shortcuts.map((item) => (
          <button
            key={item.id}
            onClick={() => handleClick(item)}
            className="flex items-center gap-2 px-5 py-5 r bg-[#F5F6FA] hover:bg-[#E6ECF3] text-sm text-[#1D2433] transition whitespace-nowrap "
          >
            {item.icon_url && (
              <img
                src={item.icon_url}
                alt={item.label}
                className="w-7 h-7 object-contain"
              />
            )}
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickSearchShortcuts;
