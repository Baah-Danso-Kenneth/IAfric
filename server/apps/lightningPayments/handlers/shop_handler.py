from .base import BasePaymentHandler
from apps.carts.models import Cart
from apps.orders.models import Order, OrderItem
from django.contrib.contenttypes.models import ContentType
import logging

logger = logging.getLogger(__name__)


class ShopPaymentHandler(BasePaymentHandler):
    def handle_successful_payment(self, payment):
        try:
            cart = Cart.objects.get(id=payment.reference_id, user=payment.user)
            order = Order.objects.create(
                user = payment.user,
                payment=payment,
                total_sats=payment.amount,
                status='completed'
            )

            for cart_item in cart.items.all():
                OrderItem.objects.create(
                    order=order,
                    content_type=ContentType.objects.get_for_model(cart_item.item),
                    quantity=cart_item.quantity,
                    price_sats=cart_item.item.price_in_sats,
                    name=cart_item.item.name
                )

                if cart_item.item.track_inventory:
                    cart_item.item.stock_quantity -= cart_item.quantity
                    cart_item.item.save()
                cart.checked_out=True
                cart.save()

                logger.info(f"Successfully processed shop payment {payment.invoice_id}")

        except Exception as e:
            logger.error(f"Error processsing shop payment {payment.invoice_id}")


    def validate_payment_data(self, payment_data):
        cart_id = payment_data.get('cart_id')
        if not cart_id:
            raise ValueError("Cart ID is required for shop payments")

        try:
            cart = Cart.objects.get(id=cart_id)
            if cart.is_empty:
                raise ValueError("Cart is empty")
            return True
        except Cart.DoesNotExist:
            raise ValueError("Cart not found")