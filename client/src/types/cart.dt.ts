import { ProductImageProps, ProductProps } from "./product.ds";

export interface CartItemDetails {
  id: number;
  name: string;
  type: string;
}

export interface CartItem {
  id: number;
  item_name: string;
  item_type: string;
  item_details: CartItemDetails | null;
  price_in_sats: number;
  quantity: number;
  total_price: number;
  current_price: number;
  price_changed: boolean;
  is_available: boolean;
  has_sufficient_stock: boolean;
  images: ProductImageProps[]; // ✅ Images are directly on CartItem
  date_added: string;
  
  // Legacy/deprecated fields for backward compatibility
  product?: ProductProps | null; 
  variant_id?: number;
  variant_name?: string;
}

export interface Cart {
  id: number;
  user?: number;
  created: string;
  updated: string;
  checked_out: boolean;
  checkout_date?: string;
  is_saved_for_later?: boolean;
  session_key?: string;
  items: CartItem[];
  total_sats: number;
  item_count: number;
  unique_item_count: number;
  is_empty: boolean;
}

// Backend response wrapper types
export interface CartResponse {
  cart: Cart;
  validation_errors?: string[];
  is_valid_for_checkout?: boolean;
}

export interface AddItemResponse {
  cart: Cart;
  added_item: CartItem;
  message: string;
}

export interface UpdateItemResponse {
  cart: Cart;
  message: string;
}

export interface RemoveItemResponse {
  cart: Cart;
  message: string;
}

export interface ClearCartResponse {
  cart: Cart;
  message: string;
}

// Request types
export interface AddItemRequest {
  item_type: string;
  item_id: number;
  quantity: number;
  variant_name?: string;
  replace_quantity?: boolean;
}

export interface UpdateItemRequest {
  cart_item_id: number;
  quantity: number;
}

export interface RemoveItemRequest {
  cart_item_id: number;
}