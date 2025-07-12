// components/ParamsInitializer.tsx
'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const ParamsInitializer = ({ onInit }: { onInit: (type: string, subcategory: string) => void }) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const type = searchParams.get('type');
    const subcategory = searchParams.get('subcategory');
    if (type && subcategory) {
      onInit(type, subcategory);
    }
  }, [searchParams]);

  return null;
};

export default ParamsInitializer;
