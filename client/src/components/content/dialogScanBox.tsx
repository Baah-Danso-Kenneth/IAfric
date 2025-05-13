'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import QRCode from "react-qr-code";
import { toast } from "sonner"; 
import { DialogScanBoxProps } from "@/types/regular";



function DialogScanBox({ paymentRequest, open, onOpenChange }: DialogScanBoxProps) {
  const handleCopy = () => {
    navigator.clipboard.writeText(paymentRequest);
    toast.success("Payment request copied!"); 
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Scan to Pay</DialogTitle>
          <DialogDescription>
            Use your Lightning Wallet to complete the payment
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col items-center gap-4">
          <QRCode value={paymentRequest} />
          <p className="break-all text-sm mt-2 bg-gray-100 p-2 rounded max-w-full">
            {paymentRequest}
          </p>
          <Button onClick={handleCopy}>Copy</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default DialogScanBox;
