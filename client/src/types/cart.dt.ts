import { ProductProps } from "./product.ds";

export interface CartItemData {
  id: number;
  name: string;
  type: string;
}

export interface CartItem {
  id: number;
  item: CartItemData | null;
  item_name: string;
  price_in_sats: number;
  price: number; 
  quantity: number;
  total_price: number;
  product: ProductProps | null; 
  variant_id?: number;
  variant_name?: string;
  date_added: string;
}

export interface Cart {
  id: number;
  user?: number;
  created: string;
  updated: string;
  checked_out: boolean;
  checkout_date?: string;
  is_saved_for_later: boolean;
  session_key?: string;
  items: CartItem[];
  total_sats: number;
  item_count: number;
  unique_item_count: number;
  is_empty: boolean;
}

// NEW: Backend response wrapper types
export interface CartResponse {
  cart: Cart;
  checkout_validation?: string[];
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
  variant_id?: number;
  variant_name?: string;
  replace_quantity?: boolean;
}

export interface UpdateItemRequest {
  cart_item_id: number;
  quantity: number;
  variant_id?: number;
}

export interface RemoveItemRequest {
  cart_item_id: number;
  variant_id?: number;
}