from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from decimal import Decimal
from apps.lightningPayments.utils import (
    btc_to_sats, sats_to_btc, btc_to_usd, usd_to_btc,
    sats_to_usd, usd_to_sats, format_currency, BTC_TO_USD_RATE
)


class CurrencyUtilsViewSet(viewsets.ViewSet):

    @action(detail=False, methods=['post'])
    def convert(self, request):
        """Convert between different currencies (BTC, SATS, USD)"""
        serializer = CurrencyConvertSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        validated_data = serializer.validated_data
        from_currency = validated_data['from']
        to_currency = validated_data['to']
        amount = validated_data['amount']

        # Conversion mapping - now we know data is clean
        conversions = {
            ('btc', 'sats'): lambda x: btc_to_sats(x),
            ('sats', 'btc'): lambda x: str(sats_to_btc(int(x))),
            ('btc', 'usd'): lambda x: str(btc_to_usd(x)),
            ('usd', 'btc'): lambda x: str(usd_to_btc(x)),
            ('sats', 'usd'): lambda x: str(sats_to_usd(int(x))),
            ('usd', 'sats'): lambda x: usd_to_sats(x),
        }

        converter = conversions[(from_currency, to_currency)]
        result = converter(amount)

        response_data = {
            'from': from_currency,
            'to': to_currency,
            'original_amount': str(amount),
            'converted_amount': result
        }

        return Response(response_data)

    @action(detail=False, methods=['post'])
    def format(self, request):
        """Format satoshis in different display modes"""
        serializer = CurrencyFormatSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(
                serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        validated_data = serializer.validated_data
        satoshis = validated_data['satoshis']
        mode = validated_data['mode']

        formatted = format_currency(satoshis, mode)

        return Response({
            'satoshis': satoshis,
            'mode': mode,
            'formatted': formatted
        })

    @action(detail=False, methods=['get'])
    def rates(self, request):
        """Get current exchange rates"""
        return Response({
            'btc_to_usd': str(BTC_TO_USD_RATE),
            'updated_at': timezone.now().isoformat()
        })
