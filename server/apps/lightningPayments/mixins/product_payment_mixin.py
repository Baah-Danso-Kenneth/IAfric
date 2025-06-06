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


class ProductPaymentMixin:
    @action(detail=False, methods=['post'])
    def create_product_payment(self, request):

        serializer = PaymentCreateSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        product_id = serializer.validated_data.get('product_id')
        quantity = serializer.validated_data.get('quantity', 1)
        expiry_minutes = serializer.validated_data.get('expiry_minutes', 60)

        product = get_object_or_404(Product, id=product_id, is_active=True)

        if product.track_inventory and product.stock_quantity < quantity:
            return Response(
                {'error': 'Insufficient stock'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Calculate amounts
        total_sats = product.price_in_sats * quantity
        fiat_amount = product.price_in_fiat * quantity if product.price_in_fiat else None
        description = f"Purchase: {product.name} (x{quantity})"

        try:

            payment = self.payment_service.create_payment(
                user=request.user,
                amount_sats=total_sats,
                payment_type='shop',
                description=description,
                reference_id=str(product.id),
                fiat_amount=fiat_amount,
                fiat_currency="USD",
                expiry_minutes=expiry_minutes,
                metadata={
                    'product_id': product.id,
                    'product_name': product.name,
                    'quantity': quantity,
                    'price_per_item': product.price_in_sats
                }
            )

            serializer = ProductPaymentSerializer(payment)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        except LNDbitsError as e:
            logger.error(f"Payment creation failed: {e}")
            return Response(
                {'error': 'Payment service unavailable'},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
