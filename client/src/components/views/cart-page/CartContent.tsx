'use client'

import { Button } from '@/components/ui/button'
import Image from 'next/image'
import React, { useState, useCallback, useEffect } from 'react'
import { Minus, Plus, X, Edit3, ShoppingBag, Loader2 } from 'lucide-react'
import { useCart } from '@/hooks/useCart'; // Updated import
import { CartItem } from '@/types/cart.dt'

function CartContent() {
  // Use the custom hook instead of RTK Query
  const { 
    cart, 
    loading: isLoading, 
    error, 
    fetchCart, 
    updateItem, 
    removeItem, 
    clearCartItems 
  } = useCart();
  
  // Track which items are being updated individually
  const [updatingItems, setUpdatingItems] = useState<Set<number>>(new Set());
  const [removingItems, setRemovingItems] = useState<Set<number>>(new Set());
  const [isClearing, setIsClearing] = useState(false);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleQuantityChange = useCallback(async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdatingItems(prev => new Set(prev).add(cartItemId));
    
    try {
      await updateItem({
        cart_item_id: cartItemId,
        quantity: newQuantity
      });
      
      console.log('Item updated successfully');
    } catch (error: any) {
      console.error('Failed to update item:', error);
      // You might want to show a toast notification here
    } finally {
      setUpdatingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  }, [updateItem]);

  const handleRemoveItem = useCallback(async (cartItemId: number) => {
    setRemovingItems(prev => new Set(prev).add(cartItemId));
    
    try {
      await removeItem({
        cart_item_id: cartItemId
      });
      
      console.log('Item removed successfully');
    } catch (error: any) {
      console.error('Failed to remove item:', error);
    } finally {
      setRemovingItems(prev => {
        const newSet = new Set(prev);
        newSet.delete(cartItemId);
        return newSet;
      });
    }
  }, [removeItem]);

  const handleClearCart = useCallback(async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      setIsClearing(true);
      try {
        await clearCartItems();
        console.log('Cart cleared successfully');
      } catch (error: any) {
        console.error('Failed to clear cart:', error);
      } finally {
        setIsClearing(false);
      }
    }
  }, [clearCartItems]);

  const handleRetry = useCallback(() => {
    fetchCart();
  }, [fetchCart]);

  // Loading state
  if (isLoading) {
    return (
      <div className='py-10 lg:py-20 bg-limeGreen bg-texture'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='flex flex-col items-center gap-4'>
              <Loader2 className='w-8 h-8 animate-spin text-electricPurple' />
              <p className='text-gray-600'>Loading your cart...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className='py-10 lg:py-20 bg-limeGreen bg-texture'>
        <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex items-center justify-center min-h-[400px]'>
            <div className='text-center'>
              <div className='w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4'>
                <X className='w-8 h-8 text-red-500' />
              </div>
              <h2 className='text-xl font-semibold text-gray-900 mb-2'>Error loading cart</h2>
              <p className='text-gray-600 mb-4'>
                {typeof error === 'string' ? error : 'Something went wrong. Please try again.'}
              </p>
              <Button 
                onClick={handleRetry}
                className='bg-electricPurple hover:bg-electricPurple/90'
              >
                Try Again
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if cart is empty or undefined
  const isEmpty = !cart?.items?.length;

  return (
    <div className='py-10 lg:py-20 bg-limeGreen bg-texture'>
      <div className='max-w-6xl mx-auto px-4 sm:px-6 lg:px-8'>
        
        {/* Page Header */}
        <div className='mb-8 lg:mb-12 flex items-center justify-between'>
          <h1 className='text-lg md:text-2xl lg:text-3xl uppercase text-electricPurple font-poppins'>
            Shopping Cart {cart?.item_count ? `(${cart.item_count})` : ''}
          </h1>
          
          {!isEmpty && (
            <Button
              onClick={handleClearCart}
              disabled={isClearing}
              variant="outline"
              className='text-red-600 border-red-600 hover:bg-red-50 disabled:opacity-50'
            >
              {isClearing ? (
                <>
                  <Loader2 className='w-4 h-4 mr-2 animate-spin' />
                  Clearing...
                </>
              ) : (
                'Clear Cart'
              )}
            </Button>
          )}
        </div>

        {/* Empty Cart State */}
        {isEmpty ? (
          <div className='text-center py-16 lg:py-24'>
            <div className='w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6'>
              <ShoppingBag className='w-12 h-12 text-gray-400' />
            </div>
            <h2 className='text-2xl lg:text-3xl font-semibold text-gray-900 mb-4'>Your cart is empty</h2>
            <p className='text-gray-600 mb-8 max-w-md mx-auto'>
              Looks like you haven't added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Button className='bg-electricPurple hover:bg-electricPurple/90 text-white px-8 py-3'>
              Start Shopping
            </Button>
          </div>
        ) : (
          /* Cart Items Container */
          <div className='bg-white rounded-lg shadow-sm overflow-hidden mb-6 lg:mb-8'>
            
            {/* Cart Items */}
            {cart!.items.map((item: CartItem, index: number) => {
              const isItemUpdating = updatingItems.has(item.id);
              const isItemRemoving = removingItems.has(item.id);
              
              return (
                <div key={`${item.id}-${item.product?.id}`} className={`p-6 lg:p-8 ${index < cart!.items.length - 1 ? 'border-b-2 border-gray-100' : ''} ${isItemRemoving ? 'opacity-50' : ''}`}>
                  <div className='flex flex-col lg:flex-row gap-6 lg:gap-8'>
                    
                    {/* Product Info Section */}
                    <div className='flex flex-col lg:flex-row gap-4 lg:gap-6 flex-1'>
                      {/* Product Image */}
                      <div className='flex-shrink-0'>
                        <div className='relative w-20 h-20 sm:w-24 sm:h-24 lg:w-32 lg:h-32 rounded-lg overflow-hidden bg-gray-100'>
                          <Image 
                            src={item.product?.image || "/images/hero-img.jpg"} 
                            alt={item.product?.name || 'Product'} 
                            fill
                            className='object-cover hover:scale-105 transition-transform duration-300'
                            sizes="(max-width: 640px) 80px, (max-width: 1024px) 96px, 128px"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.src = "/images/hero-img.jpg";
                            }}
                          />
                        </div>
                      </div>

                      {/* Product Details */}
                      <div className='flex-1 space-y-2 lg:space-y-3'>
                        <h2 className='text-xl lg:text-2xl text-gray-900 capitalize font-medium'>
                          {item.product?.name || 'Unknown Product'}
                        </h2>
                        {item.product?.description && (
                          <p className='text-sm lg:text-base text-gray-600 leading-relaxed line-clamp-2'>
                            {item.product.description}
                          </p>
                        )}
                        <button 
                          className='inline-flex items-center gap-2 text-electricPurple hover:text-electricPurple/80 text-sm lg:text-base font-medium transition-colors duration-200 disabled:opacity-50'
                          disabled={isItemUpdating || isItemRemoving}
                        >
                          <Edit3 size={16} />
                          Edit Details
                        </button>
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className='flex lg:flex-col min-w-[100px] items-center lg:items-center justify-center gap-3 lg:gap-2 lg:min-w-[120px]'>
                      <span className='text-sm lg:text-base font-medium text-gray-700 lg:mb-2'>Quantity</span>
                      <div className='flex items-center gap-3 bg-gray-50 rounded-xl p-2'>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                          className='w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-white shadow-md hover:shadow-lg flex items-center justify-center text-gray-600 hover:text-electricPurple transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                          disabled={item.quantity <= 1 || isItemUpdating || isItemRemoving}
                          aria-label="Decrease quantity"
                        >
                          {isItemUpdating ? <Loader2 size={16} className="animate-spin" /> : <Minus size={16} />}
                        </button>
                        <span className='w-12 text-center font-bold text-lg lg:text-xl text-gray-900'>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                          className='w-8 h-8 lg:w-10 lg:h-10 rounded-lg bg-white shadow-md hover:shadow-lg flex items-center justify-center text-gray-600 hover:text-electricPurple transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                          disabled={isItemUpdating || isItemRemoving}
                          aria-label="Increase quantity"
                        >
                          {isItemUpdating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
                        </button>
                      </div>
                    </div>

                    {/* Price and Remove */}
                    <div className='flex lg:flex-col items-center lg:items-end justify-between lg:justify-center gap-4 lg:gap-3 min-w-[140px]'>
                      <div className='text-right'>
                        <div className='text-xl lg:text-2xl font-bold text-gray-900'>
                          {((item.price || 0) * item.quantity).toLocaleString()} sats
                        </div>
                        <div className='text-sm text-gray-500'>
                          {(item.price || 0).toLocaleString()} sats each
                        </div>
                      </div>
                      <button 
                        onClick={() => handleRemoveItem(item.id)}
                        disabled={isItemRemoving || isItemUpdating}
                        className='w-10 h-10 rounded-full bg-red-50 hover:bg-red-100 flex items-center justify-center text-red-500 hover:text-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
                        aria-label="Remove item from cart"
                      >
                        {isItemRemoving ? (
                          <Loader2 className='w-5 h-5 animate-spin' />
                        ) : (
                          <X size={20} />
                        )}
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}

            {/* Cart Summary */}
            <div className='p-6 lg:p-8 bg-gray-50'>
              <div className='flex flex-col items-end justify-end gap-6'>
                
                {/* Item Count */}
                <div className='flex items-center gap-4 text-base lg:text-lg'>
                  <span className='font-medium text-gray-700'>
                    Items: {cart!.item_count || cart!.items.length}
                  </span>
                </div>

                {/* Subtotal */}
                <div className='flex items-center gap-4 text-lg lg:text-xl'>
                  <span className='font-medium text-gray-700'>Total:</span>
                  <span className='font-bold text-gray-900'>
                    {(cart!.total_sats || 0).toLocaleString()} sats
                  </span>
                </div>

                {/* Checkout Button */}
                <Button 
                  className='bg-electricPurple hover:bg-electricPurple/90 text-white py-3 lg:py-4 px-8 lg:px-10 text-lg lg:text-xl uppercase rounded-sm transition-all duration-300 hover:scale-[1.02] shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed'
                  disabled={isClearing || updatingItems.size > 0 || removingItems.size > 0}
                >
                  {isClearing ? 'Processing...' : 'Checkout'}
                </Button>

              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  )
}

export default CartContent