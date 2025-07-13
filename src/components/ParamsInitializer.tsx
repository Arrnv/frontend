'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

const ParamsInitializer = ({ onInit }: { onInit: (type: string, subcategory: string) => void }) => {
  const searchParams = useSearchParams();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (initialized) return;

    const type = searchParams.get('type');
    const subcategory = searchParams.get('subcategory');

    if (type && subcategory) {
      onInit(type, subcategory);
      setInitialized(true);
    }
  }, [searchParams, initialized, onInit]);

  return null;
};

export default ParamsInitializer;
