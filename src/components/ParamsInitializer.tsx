'use client';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

const ParamsInitializer = ({ onInit }: { onInit: (type: string, subcategory: string, location: string) => void }) => {
  const params = useSearchParams();
  const type = params.get('type');
  const subcategory = params.get('subcategory');
  const location = params.get('location') || '';

  useEffect(() => {
    if (type && subcategory) {
      onInit(type, subcategory, location);
    }
  }, [type, subcategory, location]);

  return null;
};

export default ParamsInitializer;
