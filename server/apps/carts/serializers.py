from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import Cart, CartItem


class CartItemSerializer(serializers.ModelSerializer):
    # Optimized fields
    item_name = serializers.SerializerMethodField()
    item_type = serializers.SerializerMethodField()
    item_details = serializers.SerializerMethodField()
    current_price = serializers.SerializerMethodField()
    price_changed = serializers.SerializerMethodField()
    is_available = serializers.SerializerMethodField()
    has_sufficient_stock = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            'id', 'quantity', 'price_in_sats', 'total_price',
            'variant_id', 'variant_name', 'date_added',
            'item_name', 'item_type', 'item_details',
            'current_price', 'price_changed', 'is_available', 'has_sufficient_stock'
        ]
        read_only_fields = ['total_price', 'date_added']

    def get_item_name(self, obj):
        return str(obj.item) if obj.item else "Deleted Item"

    def get_item_type(self, obj):
        return obj.content_type.model

    def get_item_details(self, obj):
        if not obj.item:
            return None

        return {
            'id': obj.item.id,
            'name': str(obj.item),
            'type': obj.content_type.model
        }

    def get_current_price(self, obj):
        return obj.get_current_price()

    def get_price_changed(self, obj):
        return obj.has_price_changed()

    def get_is_available(self, obj):
        return obj.is_still_available()

    def get_has_sufficient_stock(self, obj):
        return obj.has_sufficient_stock()


class CartSerializer(serializers.ModelSerializer):
    items = CartItemSerializer(many=True, read_only=True)

    class Meta:
        model = Cart
        fields = [
            'id', 'created', 'updated', 'checked_out',
            'total_sats', 'item_count', 'unique_item_count', 'is_empty',
            'items'
        ]
        read_only_fields = [
            'created', 'updated', 'total_sats', 'item_count',
            'unique_item_count', 'is_empty'
        ]