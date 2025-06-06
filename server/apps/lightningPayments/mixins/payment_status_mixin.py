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


class PaymentStatusMixin:
    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        payment = get_object_or_404(LightningPayment, invoice_id=pk, user=request.user)
        old_status = payment.status
        new_status = self.payment_service.check_payment_status(payment)

        return Response({
            'invoice_id':payment.invoice_id,
            'status': new_status,
            'status_changed': new_status != old_status,
            'paid_at': payment.paid_at,
            'expires_at': payment.expires_at,
            'is_expired': payment.is_expired,
            'amount': payment.amount,
            'bolt11': payment.bolt11 if payment.status == 'pending' else None
        })