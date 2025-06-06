// components/product/ProductDetailsInfo.tsx
import { ProductProps } from '@/types/product.ds';

interface ProductDetailsInfoProps {
  product: ProductProps;
}

export default function ProductDetailsInfo({ product }: ProductDetailsInfoProps) {
  return (
    <div className="flex-1 space-y-6">
  
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

          <div className="flex justify-between py-2 border-b border-gray-100">

            <div className='flex items-center gap-2'>
            <h1 className="text-gray-600 font-medium">Product ID:</h1>
            <h1 className="text-gray-900">{product.id}</h1>
            </div>

     

          <div className='flex items-center gap-2'>
            <h1 className="text-gray-600 font-medium">Availability:</h1>
            <h1 className="text-green-600 font-medium">In Stock</h1>
         </div>

          </div>


        </div>
      </div>
    </div>
  );
}