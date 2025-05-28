// components/PageTransitionLoader.jsx
'use client';

import { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

import Loader from '../shared/Loader';

export default function PageTransitionLoader() {
  const [loading, setLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {

    setLoading(true);
    
  
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000); 

    return () => clearTimeout(timer);
  }, [pathname, searchParams]); 

  return loading ? <Loader /> : null;
}