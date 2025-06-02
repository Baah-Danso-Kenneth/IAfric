'use client';

import Image from 'next/image';
import { Heart, Share2 } from 'lucide-react';

interface ProductImageGalleryProps {
  frontImg?: string;
  backImg?: string;
  productName: string;
}

export default function ProductImageGallery({ 
  frontImg, 
  backImg, 
  productName 
}: ProductImageGalleryProps) {
  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 group">
        {frontImg && (
          <>
            <Image
              src={frontImg}
              alt={productName}
              fill
              className="object-cover transition-opacity duration-500 ease-in-out"
              priority
            />
            {backImg && (
              <Image
                src={backImg}
                alt={`${productName} Back`}
                fill
                className="object-cover absolute top-0 left-0 opacity-0 group-hover:opacity-100 transition-all duration-700 ease-in-out"
              />
            )}
          </>
        )}
        
        {/* Action Buttons Overlay */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
            <Heart size={20} className="text-gray-600" />
          </button>
          <button className="p-2 bg-white/90 backdrop-blur-sm rounded-full shadow-sm hover:bg-white transition-colors">
            <Share2 size={20} className="text-gray-600" />
          </button>
        </div>
      </div>
      

      {backImg && (
        <div className="grid grid-cols-2 gap-4">
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer border-2 border-blue-500">
            <Image
              src={frontImg || ''}
              alt={`${productName} front`}
              fill
              className="object-cover"
            />
          </div>
          <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer border-2 border-transparent hover:border-gray-300 transition-colors">
            <Image
              src={backImg}
              alt={`${productName} back`}
              fill
              className="object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
}