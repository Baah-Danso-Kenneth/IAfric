'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCurrentCart, selectCart } from '@/redux/features/carts/cartSlice';
import { AppDispatch } from '@/redux/store';

export default function CartInitializer() {
  const dispatch = useDispatch<AppDispatch>();
  const cart = useSelector(selectCart);

  useEffect(() => {
    if (!cart) {
      dispatch(getCurrentCart());
    }
  }, [dispatch, cart]);

  return null; 
}
