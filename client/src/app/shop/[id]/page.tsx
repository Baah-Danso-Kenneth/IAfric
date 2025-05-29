'use client';

import Image from 'next/image';
import { useParams } from 'next/navigation';
import { ProductProps } from '@/types/product.ds';
import { ArrowLeft, Heart, Share2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useGetProductsQuery } from '@/redux/features/list-products/list-products';

export default function ProductDetailPage() {
  const params = useParams();
  const productId = params.id as string;
  
  // Fetch all products and find the specific one
  const { data: products, isLoading, error } = useGetProductsQuery();
  
  // Find the specific product by ID
  const product: ProductProps | undefined = products?.find(
    (p: ProductProps) => p.id.toString() === productId
  );

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="aspect-square bg-gray-200 rounded-xl"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h1>
          <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
          <Link 
            href="/shop" 
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft size={20} />
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const frontImg = product.images?.[0]?.front_image;
  const backImg = product.images?.[0]?.back_image;

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 lg:py-10">
      {/* Back Navigation */}
      <div className="mb-6">
        <Link 
          href="/shop" 
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Shop
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 group">
            {frontImg && (
              <>
                <Image
                  src={frontImg}
                  alt={product.name}
                  fill
                  className="object-cover transition-opacity duration-500 ease-in-out"
                  priority
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
          
          {/* Thumbnail Gallery */}
          {backImg && (
            <div className="grid grid-cols-2 gap-4">
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer border-2 border-blue-500">
                <Image
                  src={frontImg}
                  alt={`${product.name} front`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="relative aspect-square overflow-hidden rounded-lg bg-gray-100 cursor-pointer border-2 border-transparent hover:border-gray-300 transition-colors">
                <Image
                  src={backImg}
                  alt={`${product.name} back`}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          )}
        </div>

        {/* Product Details */}
        <div className="flex flex-col">
          <div className="flex-1 space-y-6">
            {/* Product Header */}
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
                {product.name}
              </h1>
              <p className="text-base lg:text-lg text-gray-600 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Price */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl lg:text-4xl font-bold text-green-600">
                  {product.price_in_sats.toLocaleString()}
                </span>
                <span className="text-lg text-gray-500">sats</span>
              </div>
            </div>

            {/* Product Specifications */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Product Details</h3>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="text-gray-600 font-medium">Product ID:</dt>
                  <dd className="text-gray-900">{product.id}</dd>
                </div>
                <div className="flex justify-between py-2 border-b border-gray-100">
                  <dt className="text-gray-600 font-medium">Availability:</dt>
                  <dd className="text-green-600 font-medium">In Stock</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* Action Buttons - Sticky at bottom on mobile */}
          <div className="mt-8 space-y-4 sticky bottom-0 bg-white pt-4 border-t border-gray-200 lg:border-none lg:bg-transparent lg:pt-0">
            <button className="w-full bg-blue-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              <ShoppingCart size={20} />
              Add to Cart
            </button>
            
            <button className="w-full bg-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-green-700 transition-colors">
              Buy Now with Lightning
            </button>
            
            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-4">
              <button className="py-3 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Heart size={18} />
                Save
              </button>
              <button className="py-3 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
                <Share2 size={18} />
                Share
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Section Placeholder */}
      <div className="mt-16 border-t border-gray-200 pt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
        <div className="text-center text-gray-500 py-8">
          Related products will be displayed here
        </div>
      </div>
    </div>
  );
}