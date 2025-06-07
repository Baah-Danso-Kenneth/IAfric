import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { 
  AddItemRequest, 
  Cart, 
  CartResponse,
  AddItemResponse,
  UpdateItemResponse,
  RemoveItemResponse,
  ClearCartResponse,
  UpdateItemRequest, 
  RemoveItemRequest 
} from "@/types/cart.dt";
import { fetchWithConfig } from '@/app/api/cartApi';

interface CartState {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  lastUpdated: number | null; // Add timestamp to track updates
}

const initialState: CartState = {
  cart: null,
  loading: false,
  error: null,
  lastUpdated: null,
};

// Helper function to handle async thunk errors
const handleAsyncError = (error: any): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

// Async thunks with better error handling
export const getCurrentCart = createAsyncThunk<CartResponse, void>(
  'cart/getCurrentCart',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Fetching current cart from API...');
      const response = await fetchWithConfig('cart/current/');
      console.log('Cart API Response:', response);
      return response;
    } catch (error) {
      console.error('Failed to fetch cart:', error);
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

export const addItemToCart = createAsyncThunk<AddItemResponse, AddItemRequest>(
  'cart/addItemToCart',
  async (data, { rejectWithValue }) => {
    try {
      console.log('Adding item to cart via API:', data);
      const response = await fetchWithConfig('cart/add_item/', {
        method: 'POST',
        body: JSON.stringify(data),
      });
      console.log('Add item API response:', response);
      return response;
    } catch (error) {
      console.error('Failed to add item:', error);
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

export const updateCartItem = createAsyncThunk<UpdateItemResponse, UpdateItemRequest>(
  'cart/updateCartItem',
  async (data, { rejectWithValue }) => {
    try {
      console.log('Updating cart item via API:', data);
      const response = await fetchWithConfig('cart/update_item/', {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
      console.log('Update item API response:', response);
      return response;
    } catch (error) {
      console.error('Failed to update item:', error);
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

export const removeCartItem = createAsyncThunk<RemoveItemResponse, RemoveItemRequest>(
  'cart/removeCartItem',
  async (data, { rejectWithValue }) => {
    try {
      console.log('Removing cart item via API:', data);
      const response = await fetchWithConfig('cart/remove_item/', {
        method: 'DELETE',
        body: JSON.stringify(data),
      });
      console.log('Remove item API response:', response);
      return response;
    } catch (error) {
      console.error('Failed to remove item:', error);
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

export const clearCart = createAsyncThunk<ClearCartResponse, void>(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      console.log('Clearing cart via API...');
      const response = await fetchWithConfig('cart/clear/', {
        method: 'POST',
      });
      console.log('Clear cart API response:', response);
      return response;
    } catch (error) {
      console.error('Failed to clear cart:', error);
      return rejectWithValue(handleAsyncError(error));
    }
  }
);

export const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetCart: (state) => {
      return { ...initialState };
    },
    // Add a reducer to manually update cart if needed
    setCart: (state, action: PayloadAction<Cart | null>) => {
      state.cart = action.payload;
      state.lastUpdated = Date.now();
    },
  },
  extraReducers: (builder) => {
    builder
      // Get current cart
      .addCase(getCurrentCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getCurrentCart.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure we're getting the cart from the response structure
        state.cart = action.payload.cart || action.payload;
        state.error = null;
        state.lastUpdated = Date.now();
        console.log('Cart state updated with fetched data:', state.cart);
      })
      .addCase(getCurrentCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('Failed to fetch cart:', action.payload);
      })

      // Add item to cart
      .addCase(addItemToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addItemToCart.fulfilled, (state, action) => {
        state.loading = false;
        // Ensure we're getting the cart from the response structure
        state.cart = action.payload.cart || action.payload;
        state.error = null;
        state.lastUpdated = Date.now();
        console.log('Cart state updated after add item:', state.cart);
      })
      .addCase(addItemToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('Failed to add item:', action.payload);
      })

      // Update cart item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart || action.payload;
        state.error = null;
        state.lastUpdated = Date.now();
        console.log('Cart state updated after update item:', state.cart);
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('Failed to update item:', action.payload);
      })

      // Remove cart item
      .addCase(removeCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart || action.payload;
        state.error = null;
        state.lastUpdated = Date.now();
        console.log('Cart state updated after remove item:', state.cart);
      })
      .addCase(removeCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('Failed to remove item:', action.payload);
      })

      // Clear cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload.cart || null;
        state.error = null;
        state.lastUpdated = Date.now();
        console.log('Cart state updated after clear:', state.cart);
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        console.error('Failed to clear cart:', action.payload);
      });
  },
});

export const { clearError, resetCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;

// Enhanced selectors with better error handling
export const selectCart = (state: { cart: CartState }) => state.cart.cart;
export const selectCartLoading = (state: { cart: CartState }) => state.cart.loading;
export const selectCartError = (state: { cart: CartState }) => state.cart.error;
export const selectCartLastUpdated = (state: { cart: CartState }) => state.cart.lastUpdated;

export const selectCartItemCount = (state: { cart: CartState }) => {
  const items = state.cart.cart?.items;
  if (!items || !Array.isArray(items)) {
    return 0;
  }
  return items.reduce((total, item) => {
    const quantity = typeof item.quantity === 'number' ? item.quantity : 0;
    return total + quantity;
  }, 0);
};
