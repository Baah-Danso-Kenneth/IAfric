'use client';

import React from 'react';
import { ConsumeProductProps } from '@/types/product.ds';
import ProductCard from '@/components/content/cards/ProductCard';


function ShopContainer({ data }: ConsumeProductProps) {
  return (
    <div className="max-w-7xl mx-auto px-4 py-10 mt-10 border-t border-[#585555]">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-10">
        {data?.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

export default ShopContainer;
