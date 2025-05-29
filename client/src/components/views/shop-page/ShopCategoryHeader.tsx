'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { ShopCategoryHeaderProps } from '@/types/product.ds';



function ShopCategoryHeader({ selected, setSelected, categories }: ShopCategoryHeaderProps) {
  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      <Button
        onClick={() => setSelected(undefined)}
        className={`border border-black  px-4 py-2 text-sm rounded-lg uppercase hover:bg-electricPurple hover:text-white ${!selected ? 'bg-electricPurple text-white' : 'bg-transparent text-black'}`}
      >
        All
      </Button>

      {categories.map((cat) => (
        <Button
          key={cat.slug}
          onClick={() => setSelected(cat.slug)}
          className={`border border-black px-4 py-2 text-sm rounded-lg uppercase hover:bg-electricPurple hover:text-white ${
            selected === cat.slug ? 'bg-electricPurple text-white' : 'bg-transparent text-black'
          }`}
        >
          {cat.name}
        </Button>
      ))}
    </div>
  );
}

export default ShopCategoryHeader;
