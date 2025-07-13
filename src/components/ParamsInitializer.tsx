'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

const ParamsInitializer = ({
  onInit,
}: {
  onInit: (type: string, subcategory: string, location?: string) => void;
}) => {
  const searchParams = useSearchParams();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;

    const type = searchParams.get('type');
    const subcategory = searchParams.get('subcategory');
    const location = searchParams.get('location');

    if (type && subcategory) {
      onInit(type, subcategory, location || '');
      setInitialized(true); // ✅ Prevent future re-runs
    }
  }, [searchParams, initialized, onInit]);

  return null;
};

export default ParamsInitializer;
