'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

type Props = {
  onInit: (type: string, subcategory: string, location: string) => void;
};

const ParamsInitializer = ({ onInit }: Props) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const type = searchParams.get('type') || '';
    const subcategory = searchParams.get('subcategory') || '';
    const location = searchParams.get('location') || '';

    if (type && subcategory) {
      onInit(type, subcategory, location);
    }
  }, [searchParams]); // 🚨 Listen to param changes

  return null;
};

export default ParamsInitializer;
