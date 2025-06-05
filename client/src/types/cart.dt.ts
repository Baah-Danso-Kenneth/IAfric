export interface CartItem {
  id: number;
  item: any;
  item_name: string;
  price_in_sats: number;
  quantity: number;
  total_price: number;
  variant_id?: number;
  variant_name?: string;
}

export interface Cart {
  id: number;
  user: number;
  created: string;
  updated: string;
  checked_out: boolean;
  checkout_date?: string;
  is_saved_for_later: boolean;
  session_key?: string;
  items: CartItem[];
  total_sats: number;
  item_count: number;
}

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
}

export interface RemoveItemRequest {
  cart_item_id: number;
}