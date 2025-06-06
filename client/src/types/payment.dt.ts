export type PaymentType = 'shop' | 'booking' | 'experience' | 'membership' | 'order' ;

export type TagTypes = 'Payment' | 'Product' | 'Booking' | 'Experience' | 'Membership' | 'Order';


export interface CreatePaymentRequest {
  amount_sats: number;
  payment_type: PaymentType;
  reference_id: string;
  description: string;
  fiat_amount?: number;
  fiat_currency?: string;
  expiry_minutes?: number;
  metadata?: Record<string, any>;
}





export interface PaymentResponse {
  id: string;
  invoice_id: string;
  bolt11: string;
  payment_hash: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'expired';
  payment_type: PaymentType;
  reference_id: string;
  expires_at: string;
  checking_id?: string;
  paid_at?: string;
  payment_preimage?: string;
  error_message?: string;
}


