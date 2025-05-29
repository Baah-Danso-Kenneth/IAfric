'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ShopCategoryHeaderProps } from '@/types/product.ds';



function ShopCategoryHeader({ selected, setSelected, categories }: ShopCategoryHeaderProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      <Button
        onClick={() => setSelected(undefined)}
        className={`border px-4 py-2 rounded-lg uppercase ${!selected ? 'bg-black text-white' : 'bg-white text-black'}`}
      >
        All
      </Button>

      {categories.map((cat) => (
        <Button
          key={cat.slug}
          onClick={() => setSelected(cat.slug)}
          className={`border px-4 py-2 rounded-lg uppercase ${
            selected === cat.slug ? 'bg-black text-white' : 'bg-white text-black'
          }`}
        >
          {cat.name}
        </Button>
      ))}
    </div>
  );
}

export default ShopCategoryHeader;
