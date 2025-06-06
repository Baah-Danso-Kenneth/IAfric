from rest_framework import serializers
from apps.lightningPayments.models import LightningPayment
from apps.carts.serializers import CartSerializer


class ProductPaymentSerializer(serializers.ModelSerializer):

    is_expired = serializers.ReadOnlyField()
    lightning_uri = serializers.SerializerMethodField()
    qr_data = serializers.SerializerMethodField()
    time_remaining = serializers.SerializerMethodField()

    # Related objects (optional, based on what frontend needs)
    paid_item_details = serializers.SerializerMethodField()
    cart_details = serializers.SerializerMethodField()

    class Meta:
        model = LightningPayment
        fields = [
            'invoice_id',
            'amount',
            'fiat_amount',
            'fiat_currency',
            'payment_hash',
            'bolt11',
            'status',
            'created_at',
            'paid_at',
            'expires_at',
            'is_expired',
            'lightning_uri',
            'qr_data',
            'time_remaining',
            'paid_item_details',
            'cart_details',
            'error_message'
        ]
        read_only_fields = [
            'invoice_id',
            'payment_hash',
            'bolt11',
            'status',
            'created_at',
            'paid_at',
            'error_message'
        ]

    def get_lightning_uri(self, obj):
        """Get Lightning payment URI"""
        return obj.get_satoshi_uri()

    def get_qr_data(self, obj):
        """Get QR code data"""
        return obj.get_qr_code_data()

    def get_time_remaining(self, obj):
        """Get remaining time in seconds"""
        if obj.is_expired:
            return 0

        from django.utils import timezone
        remaining = obj.expires_at - timezone.now()
        return max(0, int(remaining.total_seconds()))

    def get_paid_item_details(self, obj):
        """Get details of the paid item if it's a single product"""
        if obj.paid_item and hasattr(obj.paid_item, 'name'):
            return {
                'id': obj.paid_item.id,
                'name': obj.paid_item.name,
                'price_in_sats': getattr(obj.paid_item, 'price_in_sats', 0),
                'image': getattr(obj.paid_item, 'image', None)
            }
        return None

    def get_cart_details(self, obj):
        """Get cart summary if this is a cart payment"""
        if obj.cart:
            return {
                'item_count': obj.cart.item_count,
                'total_sats': obj.cart.total_sats,
                'items': [
                    {
                        'name': str(item.item),
                        'quantity': item.quantity,
                        'price_per_item': item.price_in_sats,
                        'total_price': item.total_price
                    }
                    for item in obj.cart.items.all()
                ]
            }
        return None


class PaymentCreateSerializer(serializers.Serializer):
    amount_sats = serializers.IntegerField()
    payment_type = serializers.CharField()
    description = serializers.CharField()
    reference_id = serializers.CharField()
    fiat_amount = serializers.DecimalField(max_digits=10, decimal_places=2)
    fiat_currency = serializers.CharField(default='USD')
    expiry_minutes = serializers.IntegerField(default=60, min_value=5, max_value=1440)
    metadata = serializers.JSONField(required=False)

    def create(self, validated_data):
        """Create payment using PaymentService"""
        from apps.lightningPayments.services import PaymentService

        # Remove any extra fields that PaymentService doesn't expect
        payment_data = validated_data.copy()

        # Call PaymentService.create_payment with the validated data
        payment = PaymentService.create_payment(**payment_data)
        return payment


class PaymentStatusSerializer(serializers.Serializer):

    invoice_id = serializers.CharField()
    status = serializers.CharField()
    status_changed = serializers.BooleanField()
    paid_at = serializers.DateTimeField(allow_null=True)
    expires_at = serializers.DateTimeField()
    is_expired = serializers.BooleanField()
    amount = serializers.IntegerField()
    bolt11 = serializers.CharField(allow_null=True)
    time_remaining = serializers.IntegerField()