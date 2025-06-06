from .base import BasePaymentHandler
import logging


class TipPaymentHandler(BasePaymentHandler):

    def handle_successful_payment(self, payment):
        try:
            # Get recipient from metadata
            recipient_id = payment.metadata.get('recipient_id')
            if recipient_id:
                self._credit_tip_recipient(recipient_id, payment.amount)

            logger.info(f"Successfully processed tip payment {payment.invoice_id}")

        except Exception as e:
            logger.error(f"Error processing tip payment {payment.invoice_id}: {e}")

    def validate_payment_data(self, payment_data):
        """Validate tip payment data"""
        recipient_id = payment_data.get('recipient_id')
        if not recipient_id:
            raise ValueError("Recipient ID is required for tips")
        return True

    def _credit_tip_recipient(self, recipient_id, amount_sats):
        pass