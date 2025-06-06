from .base import BasePaymentHandler
import logging

logger = logging.getLogger(__name__)

class BookingPaymentHandler(BasePaymentHandler):
    def handle_successful_payment(self, payment):
        try:
            from apps.bookings.models import Booking

            booking = Booking.objects.get(id=payment.reference_id)
            booking.status = 'confirmed'
            booking.payment = payment
            booking.save()

            self._send_booking_confirmation(booking)

            logger.info(f"Successfully booking payment {payment.invoice_id}")

        except Exception as e:
            logger.error(f"Error processing booking {payment.invoice_id}:{e}")

    def validate_payment_data(self, payment_data):
        booking_id = payment_data.get('booking_id')
        if not booking_id:
            raise ValueError("Booking ID is required")
        return True

    def _send_booking_confirmation(self, booking):
        pass