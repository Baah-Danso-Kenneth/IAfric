import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/redux/store';
import {
  getCurrentCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
  selectCart,
  selectCartLoading,
  selectCartError,
  selectCartItemCount,
  clearError,
  resetCart,
} from '@/redux/features/carts/cartSlice';
import { 
  AddItemRequest, 
  UpdateItemRequest, 
  RemoveItemRequest 
} from "@/types/cart.dt";
import { useCallback, useRef, useEffect } from 'react';

export const useCart = () => {
  const dispatch = useDispatch<AppDispatch>();
  const mounted = useRef(false);
  
  const cart = useSelector(selectCart);
  const loading = useSelector(selectCartLoading);
  const error = useSelector(selectCartError);
  const itemCount = useSelector(selectCartItemCount);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);


  const fetchCart = useCallback(() => {
    if (!mounted.current) return;
    console.log('Fetching cart...');
    return dispatch(getCurrentCart());
  }, [dispatch]);
  
  const addItem = useCallback(async (item: AddItemRequest) => {
    if (!mounted.current) return;
    console.log('Adding item to cart:', item);
    
    try {
      const result = await dispatch(addItemToCart(item));
      
      if (addItemToCart.fulfilled.match(result)) {
        console.log('Item added successfully:', result.payload);
        return result.payload;
      } else {
        const errorMessage = result.payload as string || 'Failed to add item';
        console.error('Add item failed:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error in addItem:', error);
      throw error;
    }
  }, [dispatch]);

  const updateItem = useCallback(async (item: UpdateItemRequest) => {
    if (!mounted.current) return;
    console.log('Updating cart item:', item);
    
    try {
      const result = await dispatch(updateCartItem(item));
      
      if (updateCartItem.fulfilled.match(result)) {
        console.log('Item updated successfully:', result.payload);
        return result.payload;
      } else {
        const errorMessage = result.payload as string || 'Failed to update item';
        console.error('Update item failed:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error in updateItem:', error);
      throw error;
    }
  }, [dispatch]);

  const removeItem = useCallback(async (item: RemoveItemRequest) => {
    if (!mounted.current) return;
    console.log('Removing cart item:', item);
    
    try {
      const result = await dispatch(removeCartItem(item));
      
      if (removeCartItem.fulfilled.match(result)) {
        console.log('Item removed successfully:', result.payload);
        return result.payload;
      } else {
        const errorMessage = result.payload as string || 'Failed to remove item';
        console.error('Remove item failed:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error in removeItem:', error);
      throw error;
    }
  }, [dispatch]);

  const clearCartItems = useCallback(async () => {
    if (!mounted.current) return;
    console.log('Clearing cart...');
    
    try {
      const result = await dispatch(clearCart());
      
      if (clearCart.fulfilled.match(result)) {
        console.log('Cart cleared successfully:', result.payload);
        return result.payload;
      } else {
        const errorMessage = result.payload as string || 'Failed to clear cart';
        console.error('Clear cart failed:', errorMessage);
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Error in clearCartItems:', error);
      throw error;
    }
  }, [dispatch]);

  const clearCartError = useCallback(() => {
    if (!mounted.current) return;
    console.log('Clearing cart error');
    dispatch(clearError());
  }, [dispatch]);
  
  const resetCartState = useCallback(() => {
    if (!mounted.current) return;
    console.log('Resetting cart state');
    dispatch(resetCart());
  }, [dispatch]);

  // Debug logging
  useEffect(() => {
    if (!mounted.current) return;
    // console.log('Cart Hook State:', {
    //   cartExists: !!cart,
    //   itemCount,
    //   loading,
    //   error,
    //   cartItems: cart?.items?.length || 0
    // });
  }, [cart, itemCount, loading, error]);

  return {
    // State
    cart,
    loading,
    error,
    itemCount,
    
    // Actions
    fetchCart,
    addItem,
    updateItem,
    removeItem,
    clearCartItems,
    clearCartError,
    resetCartState,
  };
};