import logging
from rest_framework import status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from apps.shops.models import Product
from apps.carts.models import Cart
from apps.lightningPayments.models import LightningPayment
from apps.lightningPayments.serializers.product_payment_serializer import (
    ProductPaymentSerializer, PaymentCreateSerializer
)
from apps.lightningPayments.services.lnbit_service import LNDbitsError


class CartPaymentMixin:
    """Mixin for cart payment operations"""

    def _determine_payment_type(self, cart):
        item_types = set()

        for cart_item in cart.items.all():
            if hasattr(cart_item, 'item_type'):
                item_types.add(cart_item.item.item_type)
            elif hasattr(cart_item.item, '__class__'):
                model_name = cart_item.item.__class__.__name__.lower()
                if 'book' in model_name:
                    item_types.add('book')
                elif 'experience' in model_name:
                    item_types.add('experience')
                else:
                    item_types.add('shop')
        if len(item_types) == 1:
            return item_types.pop()
        else:
            return 'mixed'


    @action(detail=False, methods=['post'])
    def create_cart_payment(self, request):
        """Create payment for entire cart"""
        cart = get_object_or_404(Cart, user=request.user, checked_out=False)

        if cart.is_empty:
            return Response(
                {'error': 'Cart is empty'},
                status=status.HTTP_400_BAD_REQUEST
            )


        unavailable_items = []
        for cart_item in cart.items.all():
            if not cart_item.is_still_available():
                unavailable_items.append(cart_item.item.name)

        if unavailable_items:
            return Response({
                'error': 'Some items not available',
                'unavailable_items': unavailable_items
            }, status=status.HTTP_400_BAD_REQUEST)

        description = f"Cart Purchase - {cart.item_count} items"
        payment_type = self._determine_payment_type(cart)

        try:
            payment = self.payment_service.create_payment(
                user=request.user,
                amount_sats=cart.total_sats,
                payment_type=payment_type,
                description=description,
                reference_id=str(cart.id),
                expiry_minutes=30,
                metadata={
                    'cart_id': cart.id,
                    'item_count': cart.item_count,
                    'items': [
                        {
                            'product_id': item.item.id,
                            'name': item.item.name,
                            'quantity': item.quantity,
                            'price': item.price_in_sats
                        }
                        for item in cart.items.all()
                    ]
                }
            )

            serializer = ProductPaymentSerializer(payment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except LNDbitsError as e:
            logger.error(f"Cart payment creation failed: {e}")
            return Response(
                {'error': 'Payment service unavailable'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )

    @action(detail=True, methods=['post'])
    def retry(self, request, pk=None):
        """Retry failed/expired payment"""

        old_payment = get_object_or_404(
            LightningPayment,
            invoice_id=pk,
            user=request.user,
            status__in=['failed', 'expired']
        )

        try:
            if 'cart_id' in old_payment.metadata:
                # Retry cart payment
                cart_id = old_payment.metadata['cart_id']
                cart = get_object_or_404(Cart, id=cart_id, user=request.user)

                if cart.checked_out:
                    return Response(
                        {'error': 'Cart already checked out'},
                        status=status.HTTP_400_BAD_REQUEST
                    )

                payment_type = self._determine_payment_type(cart)

                new_payment = self.payment_service.create_payment(
                    user=request.user,
                    amount_sats=cart.total_sats,
                    payment_type=payment_type,
                    description=f"Cart Purchase - {cart.item_count} items (Retry)",
                    reference_id=str(cart.id),
                    expiry_minutes=30
                )
            else:
                # Retry single product payment - handle any payment type
                if old_payment.payment_type == 'shop':
                    product_id = old_payment.metadata.get('product_id')
                    product = get_object_or_404(Product, id=product_id, is_active=True)

                    if product.track_inventory and product.stock_quantity < 1:
                        return Response(
                            {'error': 'Item no longer available'},
                            status=status.HTTP_400_BAD_REQUEST
                        )
                # Add similar checks for other payment types (book, experience, etc.)

                new_payment = self.payment_service.create_payment(
                    user=request.user,
                    amount_sats=old_payment.amount,
                    payment_type=old_payment.payment_type,
                    description=f"Purchase: {old_payment.description} (Retry)",
                    reference_id=old_payment.reference_id,
                    fiat_amount=old_payment.fiat_amount,
                    expiry_minutes=60,
                    metadata=old_payment.metadata
                )

            serializer = ProductPaymentSerializer(new_payment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except LNDbitsError as e:
            logger.error(f"Payment retry failed: {e}")
            return Response(
                {'error': 'Payment service unavailable'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
