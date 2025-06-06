import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart'; // Updated import
import { ProductProps } from '@/types/product.ds';
import { Heart, Minus, Plus, Share2 } from 'lucide-react';
import { useState } from 'react';
import { IoIosCart } from "react-icons/io";

interface ProductActionProps {
  product: ProductProps;
}

export default function ProductActions({ product }: ProductActionProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  
  // Use the custom cart hook
  const { addItem } = useCart();

  const increaseQuantity = () => setQuantity(prev => prev + 1);
  const decreaseQuantity = () => setQuantity(prev => Math.max(1, prev - 1));

  const totalSats = product.price_in_sats * quantity;
  const unitPrice = parseFloat(product.price_in_fiat?.replace(/[^0-9.]/g, '') || '0');
  const totalFiat = unitPrice * quantity;

  const handleAddToCart = async () => {
    if (!product.id) {
      console.error('Product ID is missing');
      return;
    }

    console.log('Starting add to cart for product:', product.id);
    setIsAddingToCart(true);
    
    try {
      await addItem({
        item_type: 'product',
        item_id: product.id,
        quantity: quantity,
      });
      
      console.log('Add to cart success');
      
      // Optional: Show success message to user
      // toast.success('Item added to cart!');
      
      // Optional: Reset quantity after successful add
      setQuantity(1);
      
    } catch (error: any) {
      console.error('Error adding to cart:', error);
      
      // Optional: Show error message to user
      // toast.error(error?.message || 'Failed to add item to cart');
    } finally {
      setIsAddingToCart(false);
    }
  };

  return (
    <div className="mt-2 space-y-4 bg-white pt-4 border-t border-gray-200 lg:border-none lg:bg-transparent lg:pt-0">
      {/* Quantity Selector */}
      <div className="flex items-center justify-between bg-gray-50 p-4 rounded-xl">
        <span className="font-medium text-gray-700">Quantity:</span>
        <div className="flex items-center space-x-3">
          <button
            onClick={decreaseQuantity}
            className="p-2 rounded-lg border border-gray-300 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isAddingToCart || quantity <= 1}
          >
            <Minus className="h-4 w-4" />
          </button>
          <span className="px-4 py-2 bg-white border border-gray-300 rounded-lg min-w-[60px] text-center font-semibold">
            {quantity}
          </span>
          <button
            onClick={increaseQuantity}
            className="p-2 rounded-lg border border-gray-300 hover:bg-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isAddingToCart}
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

      <Button 
        onClick={handleAddToCart}
        disabled={isAddingToCart || !product.id}
        className="w-full bg-electricPurple text-white py-6 px-6 rounded-xl font-semibold text-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-electricPurple/90"
      >
        {isAddingToCart ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Adding to Cart...
          </>
        ) : (
          <>
            <IoIosCart className='text-3xl'/>
            Add to Cart
          </>
        )}
      </Button>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          className="py-3 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isAddingToCart}
        >
          <Heart size={18} />
          Save
        </button>
        <button 
          className="py-3 px-4 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isAddingToCart}
        >
          <Share2 size={18} />
          Share
        </button>
      </div>
    </div>
  );
}