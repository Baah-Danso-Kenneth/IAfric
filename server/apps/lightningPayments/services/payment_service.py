from django.db import transaction
from django.utils import timezone
from datetime import timedelta
from apps.lightningPayments.models import LightningPayment
from apps.lightningPayments.services.lnbit_service import LNDbitsService, LNDbitsError
import logging

logger = logging.getLogger(__name__)


class PaymentService:
    """Service for handling Lightning payments"""

    def __init__(self):
        self.lndbits = LNDbitsService()

    def create_payment(self, user, amount_sats, payment_type, description="",
                       reference_id="", fiat_amount=None, fiat_currency="USD",
                       expiry_minutes=60, metadata=None):
        """
        Create a new Lightning payment

        Args:
            user: User making the payment
            amount_sats: Amount in satoshis
            payment_type: Type of payment ('shop', 'booking', 'tip', etc.)
            description: Payment description
            reference_id: External reference (cart_id, booking_id, etc.)
            fiat_amount: Optional fiat equivalent
            fiat_currency: Fiat currency code
            expiry_minutes: Minutes until expiry
            metadata: Additional payment data

        Returns:
            LightningPayment: Created payment object
        """
        expires_at = timezone.now() + timedelta(minutes=expiry_minutes)

        try:
            with transaction.atomic():
                # Create payment record
                payment = LightningPayment.objects.create(
                    user=user,
                    amount=amount_sats,
                    fiat_amount=fiat_amount,
                    fiat_currency=fiat_currency,
                    payment_type=payment_type,
                    reference_id=reference_id,
                    description=description,
                    expires_at=expires_at,
                    metadata=metadata or {}
                )

                # Create Lightning invoice
                invoice_data = self.lndbits.create_payment_request(
                    amount_sats=amount_sats,
                    description=f"{description} - Invoice: {payment.invoice_id}",
                    expiry_minutes=expiry_minutes
                )

                # Update payment with Lightning data
                payment.payment_hash = invoice_data['payment_hash']
                payment.bolt11 = invoice_data['bolt11']
                payment.checking_id = invoice_data.get('checking_id', '')
                payment.save()

                logger.info(f"Created payment {payment.invoice_id} for {amount_sats} sats")
                return payment

        except LNDbitsError as e:
            logger.error(f"Failed to create payment: {e}")
            if 'payment' in locals():
                payment.status = 'failed'
                payment.error_message = str(e)
                payment.save()
            raise e

    def check_payment_status(self, payment):
        """Check and update payment status"""
        if payment.status != 'pending' or not payment.payment_hash:
            return payment.status

        try:
            is_paid, payment_data = self.lndbits.verify_payment(payment.payment_hash)

            if is_paid:
                payment.status = 'completed'
                payment.paid_at = timezone.now()
                payment.payment_preimage = payment_data.get('preimage', '')
                payment.save()

                # Trigger post-payment processing
                self._handle_successful_payment(payment)

            elif payment.is_expired:
                payment.status = 'expired'
                payment.save()

        except LNDbitsError as e:
            logger.error(f"Error checking payment status: {e}")

        return payment.status

    def _handle_successful_payment(self, payment):
        """Trigger appropriate handler for successful payment"""
        from apps.lightningPayments.handlers import get_payment_handler

        try:
            handler = get_payment_handler(payment.payment_type)
            if handler:
                handler.handle_successful_payment(payment)
        except Exception as e:
            logger.error(f"Error handling successful payment {payment.invoice_id}: {e}")


