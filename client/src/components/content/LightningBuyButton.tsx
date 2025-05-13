'use client';

import { checkpayment, createInvoice, submitOrder } from "@/lib/lightning";
import { LightningBuyButtonProps } from "@/types/regular";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { useRouter } from 'next/navigation';
import DialogScanBox from './dialogScanBox';

function LightningBuyButton({ productId, quantity, amountInSats }: LightningBuyButtonProps) {
  const [paymentRequest, setPaymentRequest] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null);
  const [invoiceId, setInvoiceId] = useState<string | null>(null);
  const [_, setIsPaid] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (!invoiceId) return;

    const interval = setInterval(async () => {
      try {
        const status = await checkpayment(invoiceId);
        if (status.paid) {
          setIsPaid(true);
          clearInterval(interval);
          await submitOrder({ productId, quantity, invoiceId });
          router.push('/success');
        }
      } catch (error: any) {
        console.error("Payment check failed", error);
      }
    }, 4000);

    return () => clearInterval(interval);
  }, [invoiceId]);

  const handleClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const invoice = await createInvoice({
        productId,
        quantity,
        amountInSats,
      });

      setPaymentRequest(invoice.paymentRequest);
      setInvoiceId(invoice.id);
      setIsDialogOpen(true)
    } catch (error: any) {
      setError(error.message || "Failed to create invoice");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Button onClick={handleClick} className='w-[50%] py-4 text-lg uppercase rounded-none bg-green-700'>
        {loading ? "Creating invoice..." : "Buy"}
      </Button>

      {error && <p className="text-red-600 mt-2">{error}</p>}

      {paymentRequest && (
        <DialogScanBox 
        paymentRequest={paymentRequest}
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
         />
      )}
    </div>
  );
}

export default LightningBuyButton;
