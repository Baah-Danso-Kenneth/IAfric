'use client';

import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentCart, selectCart, selectCartLoading } from '@/redux/features/carts/cartSlice';
import { AppDispatch } from '@/redux/store';

export default function CartInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector(selectCart);
  const loading = useSelector(selectCartLoading);
  const mounted = useRef(false);

  useEffect(() => {
    mounted.current = true;

    const initializeCart = async () => {
      if (!mounted.current) return;
      
      try {
        // Only fetch if we don't have cart data or if it's empty
        if (!cart || cart.is_empty) {
          console.log('Initializing cart...');
          await dispatch(getCurrentCart());
        } else {
          console.log('Cart already initialized:', cart);
        }
      } catch (error) {
        console.error('Failed to initialize cart:', error);
      }
    };

    initializeCart();

    return () => {
      mounted.current = false;
    };
  }, [dispatch, cart]); // Add cart as dependency to check its state

  return null;
}
