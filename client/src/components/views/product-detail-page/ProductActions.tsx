// components/product/ProductActions.tsx
import { Heart, Share2, ShoppingCart } from 'lucide-react';

export default function ProductActions() {
  return (
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
  );
}