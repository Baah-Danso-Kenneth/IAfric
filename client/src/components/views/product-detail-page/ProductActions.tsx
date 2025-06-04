import { usePayment } from '@/hooks/usePayment';
import { ProductProps } from '@/types/product.ds';
import { Heart, Minus, Plus, Share2, ShoppingCart } from 'lucide-react';
import { useState } from 'react';
import { FaBolt } from 'react-icons/fa6';

interface ProductActionProps {
  product: ProductProps;
}

export default function ProductActions({ product }: ProductActionProps) {
  const [quantity, setQuantity] = useState(1);

  const {
    handleLightningPayment,
    resetPayment,
    isProcessing,
    error
  } = usePayment();

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const onBuyWithLightning = () => {
    // Validate product data before proceeding
    if (!product.id || !product.name || !product.price_in_sats) {
      console.error('Invalid product data:', product);
      return;
    }

    handleLightningPayment(product, quantity);
  };


  const totalSats = product.price_in_sats * quantity;
  

  const unitPrice = parseFloat(product.price_in_fiat.replace(/[^0-9.]/g, '')) || 0;
  const totalFiat = unitPrice * quantity;

  return (
    <>
      <div className="mt-2 space-y-4 bg-white pt-4 border-t border-gray-200 lg:border-none lg:bg-transparent lg:pt-0">
        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* Quantity Selector */}
        <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
          <span className="font-medium text-gray-700">Quantity:</span>
          <div className="flex items-center space-x-3">
            <button
              onClick={decreaseQuantity}
              className="p-2 rounded-lg border border-gray-300 hover:bg-white transition-colors"
              disabled={isProcessing}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-w-[60px] text-center font-semibold">
              {quantity}
            </span>
            <button
              onClick={increaseQuantity}
              className="p-2 rounded-lg border border-gray-300 hover:bg-white transition-colors"
              disabled={isProcessing}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Price Summary */}
        <div className="bg-gray-50 p-4 rounded-xl">
          <div className="flex justify-between items-center mb-2">
            <span className="text-gray-600">Unit Price:</span>
            <div className="text-right">
              <div className="font-semibold">{product.price_in_fiat}</div>
              <div className="text-sm text-gray-500">{product.price_in_sats.toLocaleString()} sats</div>
            </div>
          </div>
          <div className="flex justify-between items-center text-lg font-bold border-t border-gray-200 pt-2">
            <span>Total:</span>
            <div className="text-right">
              <div className="text-electricPurple">${totalFiat.toFixed(2)}</div>
              <div className="text-sm text-green-600">{totalSats.toLocaleString()} sats</div>
            </div>
          </div>
        </div>

        <button 
          className="w-full bg-electricPurple text-white py-4 px-6 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2"
          disabled={isProcessing}
        >
          <ShoppingCart size={20} />
          Add to Cart
        </button>
        
        <button 
          onClick={onBuyWithLightning}
          disabled={isProcessing || !product.id}
          className="w-full flex items-center justify-center gap-2 bg-green-600 text-white py-4 px-6 rounded-xl font-semibold text-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isProcessing ? 'Processing...' : 'Buy Now with Lightning'}
          <FaBolt className='text-yellow-400'/>
        </button>
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <button 
            className="py-3 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            disabled={isProcessing}
          >
            <Heart size={18} />
            Save
          </button>
          <button 
            className="py-3 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
            disabled={isProcessing}
          >
            <Share2 size={18} />
            Share
          </button>
        </div>
      </div>
    </>
  );
}