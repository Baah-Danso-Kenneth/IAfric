'use client';

import Image from 'next/image';
import React from 'react';
import { ProductProps } from '@/types/product.ds';

interface ProductCardProps {
  product: ProductProps;
}

function ProductCard({ product }: ProductCardProps) {
  const frontImg = product.images?.[0]?.front_image;
  const backImg = product.images?.[0]?.back_image;

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Product Images */}
      <div className="relative group aspect-[4/3] overflow-hidden">
        {frontImg && (
          <>
            <Image
              src={frontImg}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-500 ease-in-out"
            />
            {backImg && (
              <Image
                src={backImg}
                alt={`${product.name} Back`}
                fill
                className="object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"
              />
            )}
          </>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3">
        <h2 className="text-sm font-semibold text-gray-900 mb-1">{product.name}</h2>
        <p className="text-xs text-gray-600 line-clamp-2">{product.description}</p>
        <p className="mt-2 text-sm font-medium text-green-600">
          {product.price_in_sats.toLocaleString()} sats
        </p>
      </div>
    </div>
  );
}

export default ProductCard;
