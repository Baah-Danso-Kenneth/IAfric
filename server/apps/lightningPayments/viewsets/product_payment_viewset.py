from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from apps.lightningPayments.mixins import (
    CartPaymentMixin,
    PaymentStatusMixin,
    ProductPaymentMixin)

from apps.shops.models import Product
from apps.carts.models import Cart
from apps.lightningPayments.models import LightningPayment
from apps.lightningPayments.services.payment_service import PaymentService
from apps.lightningPayments.serializers.product_payment_serializer import (
    ProductPaymentSerializer, PaymentCreateSerializer
)
from apps.lightningPayments.services.lnbit_service import LNDbitsError
import logging

logger = logging.getLogger(__name__)


class ProductPaymentViewSet(
    CartPaymentMixin,
    PaymentStatusMixin,
    ProductPaymentMixin,
    viewsets.ViewSet):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.payment_service = PaymentService()

    def create(self, request):
        """Handle POST /payments/ - Create a new payment"""
        serializer = PaymentCreateSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Use mixin logic to determine payment type and handle creation
            payment_data = serializer.validated_data

            # Let mixins handle the specific product payment logic
            if 'product_id' in payment_data:
                # Use ProductPaymentMixin logic
                payment = self.create_product_payment(request.user, payment_data)
            elif 'cart_id' in payment_data:
                # Use CartPaymentMixin logic
                payment = self.create_cart_payment(request.user, payment_data)
            else:
                # Default payment creation
                payment = self.payment_service.create_payment(
                    user=request.user,
                    **payment_data
                )

            # Return the created payment
            response_serializer = ProductPaymentSerializer(payment)
            return Response(
                response_serializer.data,
                status=status.HTTP_201_CREATED
            )

        except LNDbitsError as e:
            logger.error(f"LNDbits error creating payment: {e}")
            return Response(
                {"error": "Payment service unavailable"},
                status=status.HTTP_503_SERVICE_UNAVAILABLE
            )
        except Exception as e:
            logger.error(f"Error creating payment: {e}")
            return Response(
                {"error": "Failed to create payment"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def list(self, request):
        payments = LightningPayment.objects.filter(user=request.user).order_by('-created_at')

        status_filter = request.GET.get('status')
        if status_filter:
            payments = payments.filter(status=status_filter)

        type_filter = request.GET.get('type')
        if type_filter:
            payments = payments.filter(payment_type=type_filter)

        serializer = ProductPaymentSerializer(payments, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        payment = get_object_or_404(LightningPayment, invoice_id=pk, user=request.user)
        serializer = ProductPaymentSerializer(payment)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def create_product_payment(self, request):
        """Custom endpoint for creating product payments"""
        return self.create(request)

    @action(detail=False, methods=['post'])
    def create_cart_payment(self, request):
        """Custom endpoint for creating cart payments"""
        # Use CartPaymentMixin logic here
        try:
            # Assuming your CartPaymentMixin has this method
            payment = self.create_cart_payment_logic(request.user)

            response_serializer = ProductPaymentSerializer(payment)
            return Response(
                response_serializer.data,
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            logger.error(f"Error creating cart payment: {e}")
            return Response(
                {"error": "Failed to create cart payment"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        """Check payment status"""
        payment = get_object_or_404(LightningPayment, invoice_id=pk, user=request.user)

        # Use PaymentStatusMixin logic to check status
        updated_status = self.payment_service.check_payment_status(payment)

        # Refresh from database to get updated data
        payment.refresh_from_db()

        serializer = ProductPaymentSerializer(payment)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def retry(self, request, pk=None):
        """Retry a failed payment"""
        payment = get_object_or_404(LightningPayment, invoice_id=pk, user=request.user)

        if payment.status not in ['failed', 'expired']:
            return Response(
                {"error": "Payment cannot be retried"},
                status=status.HTTP_400_BAD_REQUEST
            )

        try:
            # Create new payment with same data
            new_payment = self.payment_service.create_payment(
                user=request.user,
                amount_sats=payment.amount,
                payment_type=payment.payment_type,
                description=payment.description,
                reference_id=payment.reference_id,
                fiat_amount=payment.fiat_amount,
                fiat_currency=payment.fiat_currency,
                metadata=payment.metadata
            )

            response_serializer = ProductPaymentSerializer(new_payment)
            return Response(
                response_serializer.data,
                status=status.HTTP_201_CREATED
            )

        except Exception as e:
            logger.error(f"Error retrying payment: {e}")
            return Response(
                {"error": "Failed to retry payment"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )