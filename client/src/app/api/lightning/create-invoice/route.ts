import { NextResponse } from 'next/server';
import axios from 'axios';

export async function POST(request: Request) {
  try {

    const body = await request.json();
    const { productId, quantity, amountInSats } = body;

    if (!productId || !quantity || !amountInSats) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/create-order-invoice/`,
      {
        product_id: productId,
        quantity: quantity,
        total_amount_sats: amountInSats,
        payment: {
          amount_in_sats: amountInSats,
          payment_type: 'lightning'
        }
      },
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    const data = response.data;
    console.log('Backend Respond',data)

    
    return NextResponse.json({
      id: data.order_id,
      paymentRequest: data.payment_request,
      amountInSats: amountInSats,
      expiresAt: new Date(Date.now() + 900000).toISOString(), 
    });
  } catch (error: any) {
    console.error('Error generating Lightning invoice:', error.response?.data || error.message);
    
    return NextResponse.json(
      { error: error.response?.data?.error || 'Failed to generate invoice' },
      { status: 500 }
    );
  }
}