from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from apps.shops.models import Product
from apps.carts.models import Cart
from apps.lightningPayments.serializers.product_payment_serializer import (
   ProductPaymentSerializer, PaymentCreateSerializer, PaymentStatusSerializer
)
from apps.lightningPayments.services import LNDbitsError
import logging

logger = logging.getLogger(__name__)

class ProductPaymentViewSet(viewsets.ViewSet):

    def list(self, request):
        """User's payment history"""
        payments = LightningPayment.objects.filter(user=request.user).order_by('-created_at')
        status_filter = request.GET.get('status')
        if status_filter:
            payments = payments.filter(status=status_filter)
        serializer = ProductPaymentSerializer(payments, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        payment = get_object_or_404(LightningPayment, invoice_id=pk, user=request.user)
        serializer = ProductPaymentSerializer(payment)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        """Get and update payment status"""
        payment = get_object_or_404(LightningPayment, invoice_id=pk, user=request.user)
        old_status = payment.status
        payment.check_status()
        return Response({
            'invoice_id': payment.invoice_id,
            'status': payment.status,
            'status_changed': payment.status != old_status,
            'paid_at': payment.paid_at,
            'expires_at': payment.expires_at,
            'is_expired': payment.is_expired,
            'amount': payment.amount,
            'bolt11': payment.bolt11 if payment.status == 'pending' else None
        })

    @action(detail=False, methods=['post'])
    def create_product_payment(self, request):
        """Create payment for single product"""
        serializer = PaymentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data.get('product_id')
        quantity = serializer.validated_data.get('quantity', 1)

        product = get_object_or_404(Product, id=product_id, is_active=True)

        if product.track_inventory and product.stock_quantity < quantity:
            return Response({'error': 'Insufficient stock'}, status=status.HTTP_400_BAD_REQUEST)

        total_amount = product.price_in_sats * quantity

        try:
            with transaction.atomic():
                payment = LightningPayment.create_invoice(
                    user=request.user,
                    amount_sats=total_amount,
                    description=f"Purchase: {product.name} (x{quantity})",
                    paid_item=product,
                    fiat_amount=product.price_in_fiat * quantity if product.price_in_fiat else None,
                    fiat_currency="USD",
                    expiry_minutes=60
                )
            response_serializer = ProductPaymentSerializer(payment)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        except LNDbitsError as e:
            logger.error(f"LNDbits error: {e}")
            return Response({'error': 'Payment service unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

    @action(detail=False, methods=['post'])
    def create_cart_payment(self, request):
        """Create payment for entire cart"""
        cart = get_object_or_404(Cart, user=request.user, checked_out=False)
        if cart.is_empty:
            return Response({'error': 'Cart is empty'}, status=status.HTTP_400_BAD_REQUEST)

        unavailable_items = [item.item.name for item in cart.items.all() if not item.is_still_available()]
        if unavailable_items:
            return Response({'error': 'Some items not available', 'unavailable_items': unavailable_items}, status=status.HTTP_400_BAD_REQUEST)

        try:
            with transaction.atomic():
                payment = LightningPayment.create_invoice(
                    user=request.user,
                    amount_sats=cart.total_sats,
                    description=f"Cart Purchase - {cart.item_count} items",
                    cart=cart,
                    expiry_minutes=30
                )
            response_serializer = ProductPaymentSerializer(payment)
            return Response(response_serializer.data, status=status.HTTP_201_CREATED)

        except LNDbitsError as e:
            logger.error(f"LNDbits error: {e}")
            return Response({'error': 'Payment service unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)

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
            if old_payment.cart:
                cart = old_payment.cart
                if cart.checked_out:
                    return Response({'error': 'Cart already checked out'}, status=status.HTTP_400_BAD_REQUEST)
                with transaction.atomic():
                    new_payment = LightningPayment.create_invoice(
                        user=request.user,
                        amount_sats=cart.total_sats,
                        description=f"Cart Purchase - {cart.item_count} items (Retry)",
                        cart=cart,
                        expiry_minutes=30
                    )
            else:
                item = old_payment.paid_item
                if not item or not item.is_in_stock():
                    return Response({'error': 'Item no longer available'}, status=status.HTTP_400_BAD_REQUEST)
                with transaction.atomic():
                    new_payment = LightningPayment.create_invoice(
                        user=request.user,
                        amount_sats=old_payment.amount,
                        description=f"Purchase: {item.name} (Retry)",
                        paid_item=item,
                        fiat_amount=old_payment.fiat_amount,
                        expiry_minutes=60
                    )

            serializer = ProductPaymentSerializer(new_payment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except LNDbitsError as e:
            logger.error(f"LNDbits error retrying payment: {str(e)}")
            return Response({'error': 'Payment service unavailable'}, status=status.HTTP_503_SERVICE_UNAVAILABLE)
