from rest_framework import serializers
from .models import Cart, CartItem
from apps.shops.serializers import ProductSerializer


class CartItemSerializer(serializers.ModelSerializer):
    item_name = serializers.CharField(source='item.__str__', read_only=True)
    product = serializers.SerializerMethodField()
    item = serializers.SerializerMethodField()
    price = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            'id',
            'item',
            'item_name',
            'price_in_sats',
            'price',
            'quantity',
            'total_price',
            'product',
            'variant_id',
            'variant_name',
            'date_added',
        ]
        read_only_fields = ['total_price', 'item_name', 'date_added']

    def get_item(self, obj):
        """Return item info in a JSON serializable format"""
        if obj.item:
            return {
                'id': obj.item.id,
                'name': str(obj.item),
                'type': obj.content_type.model
            }
        return None

    def get_product(self, obj):
        """Get product data if the item is a Product"""
        if obj.content_type.model == 'product' and obj.item:
            return ProductSerializer(obj.item).data
        return None

    def get_price(self, obj):
        """Return price_in_sats as price for frontend compatibility"""
        return obj.price_in_sats


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)
    total_sats = serializers.IntegerField(read_only=True)
    item_count = serializers.IntegerField(read_only=True)
    unique_item_count = serializers.IntegerField(read_only=True)
    is_empty = serializers.BooleanField(read_only=True)

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
            'unique_item_count',
            'is_empty',
        ]
        read_only_fields = [
            'created', 'updated', 'total_sats', 'item_count',
            'unique_item_count', 'is_empty', 'checkout_date',
        ]