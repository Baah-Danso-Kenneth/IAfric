import { useState, useCallback } from 'react';
import { ProductProps } from '@/types/product.ds';
import { CreatePaymentRequest } from '@/types/payment.dt';
import { useCreateProductPaymentMutation } from '@/redux/features/payment/paymentApi';

export const usePayment = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<any>(null);

  const [createPayment] = useCreateProductPaymentMutation();

  const handleLightningPayment = useCallback(async (product: ProductProps, quantity: number = 1) => {
    try {
      setIsProcessing(true);
      setError(null);

      console.log('🔍 DEBUGGING: Function called with:', { product, quantity });

      // Validate product data
      if (!product.id || !product.price_in_sats || !product.name) {
        throw new Error('Invalid product data. Missing required fields.');
      }

      // Calculate total amount
      const totalSats = product.price_in_sats * quantity;
      
      // Extract fiat amount from price_in_fiat string
      const unitFiatPrice = parseFloat(product.price_in_fiat.replace(/[^0-9.]/g, ''));
      const totalFiatAmount = unitFiatPrice * quantity;

      // Create payment request object step by step
      console.log('🔍 Creating payment request object...');
      
      const paymentRequest = {
        amount_sats: totalSats,
        payment_type: 'shop' as const,
        description: `Purchase: ${product.name}${quantity > 1 ? ` (x${quantity})` : ''}`,
        reference_id: product.id.toString(),
        fiat_amount: totalFiatAmount,
        fiat_currency: 'USD',
        expiry_minutes: 60,
        metadata: {
          product_id: product.id,
          product_name: product.name,
          unit_price_sats: product.price_in_sats,
          unit_price_fiat: unitFiatPrice,
          quantity: quantity
        },
      };

      console.log('🔍 Payment request created:', paymentRequest);
      console.log('🔍 Payment request keys:', Object.keys(paymentRequest));
      console.log('🔍 Has quantity property?', 'quantity' in paymentRequest);
      console.log('🔍 Payment request JSON:', JSON.stringify(paymentRequest, null, 2));

      // Double check - create a completely new object
      const safePaymentRequest = {
        amount_sats: paymentRequest.amount_sats,
        payment_type: paymentRequest.payment_type,
        description: paymentRequest.description,
        reference_id: paymentRequest.reference_id,
        fiat_amount: paymentRequest.fiat_amount,
        fiat_currency: paymentRequest.fiat_currency,
        expiry_minutes: paymentRequest.expiry_minutes,
        metadata: paymentRequest.metadata,
      };

      console.log('🔍 Safe payment request:', safePaymentRequest);
      console.log('🔍 Safe payment request keys:', Object.keys(safePaymentRequest));
      console.log('🔍 Safe has quantity property?', 'quantity' in safePaymentRequest);
      console.log('🔍 Safe payment request JSON:', JSON.stringify(safePaymentRequest, null, 2));

      // Create the payment
      console.log('🔍 About to call createPayment with:', safePaymentRequest);
      const result = await createPayment(safePaymentRequest).unwrap();
      
      console.log('Payment created successfully:', result);
      setPaymentData(result);

      // Here you would typically:
      // 1. Show the Lightning invoice QR code
      // 2. Start polling for payment status
      // 3. Handle successful payment
      
      // For now, let's just log the invoice
      if (result.bolt11) {
        console.log('Lightning Invoice:', result.bolt11);
        // You could show a modal with the QR code here
        alert(`Payment created! Invoice ID: ${result.invoice_id}\n\nLightning Invoice:\n${result.bolt11}`);
      }

    } catch (err: any) {
      console.error('Payment creation failed:', err);
      
      // Handle different types of errors
      if (err.data?.error) {
        setError(err.data.error);
      } else if (err.message) {
        setError(err.message);
      } else {
        setError('Failed to create payment. Please try again.');
      }
    } finally {
      setIsProcessing(false);
    }
  }, [createPayment]);

  const resetPayment = useCallback(() => {
    setError(null);
    setPaymentData(null);
    setIsProcessing(false);
  }, []);

  return {
    handleLightningPayment,
    resetPayment,
    isProcessing,
    error,
    paymentData
  };
};