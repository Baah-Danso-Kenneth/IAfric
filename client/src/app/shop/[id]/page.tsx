// app/shop/[id]/page.tsx
'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProductProps } from '@/types/product.ds';
import { useGetProductsQuery } from '@/redux/features/list-products/list-products';
import ProductLoadingSkeleton from '@/components/views/product-detail-page/ProductSkeleton';
import ProductImageGallery from '@/components/views/product-detail-page/ProductGallery';
import ProductDetailsInfo from '@/components/views/product-detail-page/ProductDetailsInfo';
import ProductActions from '@/components/views/product-detail-page/ProductActions';
import Footer from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';



export default function Page() {
  const params = useParams();
  const productId = params.id as string;
  
  const { data: products, isLoading, error } = useGetProductsQuery();
  
  const product: ProductProps | undefined = products?.find(
    (p: ProductProps) => p.id.toString() === productId
  );

  if (isLoading) {
    return <ProductLoadingSkeleton />;
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
    <section>
      <Header/>
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
        <ProductImageGallery 
          frontImg={frontImg}
          backImg={backImg}
          productName={product.name}
        />

        <div className="flex flex-col">
          <ProductDetailsInfo product={product} />
          <ProductActions product={product}/>
        </div>
      </div>

      {/* Related Products Section */}
      <div className="mt-16 border-t border-gray-200 pt-10">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">You might also like</h2>
        <div className="text-center text-gray-500 py-8">
          Related products will be displayed here
        </div>
      </div>
    </div>
      <Footer/>
    </section>
  );
}