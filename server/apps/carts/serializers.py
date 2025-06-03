from rest_framework import serializers
from .models import Cart, CartItem



class CartItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.__str__', read_only=True)

    class Meta:
        model = CartItem
        fields = [
            'id',
            'item',
            'item_name',
            'price_in_sats',
            'quantity',
            'total_price',
            'variant_id',
            'variant_name',
        ]
        read_only_fields = ['total_price', 'item_name']



class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_sats = serializers.IntegerField(read_only=True)
    item_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = Cart
        fields = [
            'id',
            'user',
            'created',
            'updated',
            'checked_out',
            'checkout_date',
            'is_saved_for_later',
            'session_key',
            'items',
            'total_sats',
            'item_count',
        ]
        read_only_fields = [
            'created', 'updated', 'total_sats', 'item_count', 'checkout_date',
        ]
