from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from .models import LightningPayment
from .services import LNDbitsService, LNDbitsError
from apps.carts.models import Cart
import logging

logger = logging.getLogger(__name__)


class LightningPaymentViewSet(viewsets.ModelViewSet):
    queryset = LightningPayment.objects.all()

    @action(detail=False, methods=['post'])
    def create_invoice(self, request):
        """Create a Lightning invoice"""
        data = request.data
        amount_sats = int(data.get('amount_sats', 0))

        if amount_sats <= 0:
            return Response({'error': 'Invalid amount'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            cart, paid_item = self._get_payment_target(data)

            payment = LightningPayment.create_invoice(
                user=None,  # No user authentication
                amount_sats=amount_sats,
                description=data.get('description', ''),
                cart=cart,
                paid_item=paid_item,
                fiat_amount=data.get('fiat_amount'),
                fiat_currency=data.get('fiat_currency', 'USD')
            )

            return Response({
                'payment_id': payment.id,
                'invoice_id': payment.invoice_id,
                'bolt11': payment.bolt11,
                'payment_hash': payment.payment_hash,
                'amount_sats': payment.amount,
                'expires_at': payment.expires_at.isoformat(),
                'qr_data': payment.get_qr_code_data(),
                'lightning_uri': payment.get_satoshi_uri()
            })

        except LNDbitsError as e:
            logger.error(f"LNDbits error: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        except Exception as e:
            logger.error(f"Invoice creation error: {e}")
            return Response({'error': 'Failed to create invoice'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    @action(detail=True, methods=['get'])
    def status(self, request, pk=None):
        """Check payment status"""
        payment = get_object_or_404(LightningPayment, id=pk)
        payment.check_status()

        return Response({
            'payment_id': payment.id,
            'status': payment.status,
            'amount_sats': payment.amount,
            'created_at': payment.created_at.isoformat(),
            'expires_at': payment.expires_at.isoformat() if payment.expires_at else None
        })

    def _get_payment_target(self, data):
        """Helper to get cart or item for payment"""
        cart_id = data.get('cart_id')
        item_type = data.get('item_type')
        item_id = data.get('item_id')

        cart = paid_item = None

        if cart_id:
            cart = get_object_or_404(Cart, id=cart_id, checked_out=False)
            if cart.is_empty:
                raise ValueError('Cart is empty')
        elif item_type and item_id:
            from django.contrib.contenttypes.models import ContentType
            content_type = ContentType.objects.get(model=item_type.lower())
            paid_item = content_type.get_object_for_this_type(id=item_id)
        else:
            raise ValueError('Either cart_id or item details required')

        return cart, paid_item