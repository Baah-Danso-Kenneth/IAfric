from rest_framework import serializers
from django.contrib.contenttypes.models import ContentType
from .models import Cart, CartItem
from ..shops.serializers import ProductImageSerializer


class CartItemSerializer(serializers.ModelSerializer):
    item_name = serializers.SerializerMethodField()
    item_type = serializers.SerializerMethodField()
    item_details = serializers.SerializerMethodField()
    current_price = serializers.SerializerMethodField()
    price_changed = serializers.SerializerMethodField()
    is_available = serializers.SerializerMethodField()
    has_sufficient_stock = serializers.SerializerMethodField()
    images = serializers.SerializerMethodField()

    class Meta:
        model = CartItem
        fields = [
            'id', 'quantity', 'price_in_sats',
            'total_price', 'date_added', 'images',
            'item_name', 'item_type', 'item_details',
            'current_price', 'price_changed',
            'is_available', 'has_sufficient_stock'
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

    def get_images(self, obj):
        """Enhanced image getter with debugging"""
        print(f"🔍 Getting images for CartItem {obj.id}")
        print(f"   - Item: {obj.item}")
        print(f"   - Content type: {obj.content_type.model}")

        if not obj.item:
            print("   ❌ No item found")
            return []

        # For products specifically
        if obj.content_type.model == 'product':
            print(f"   🎯 Processing product: {obj.item}")

            # Check if the item has images attribute
            if hasattr(obj.item, 'images'):
                images = obj.item.images.all()
                print(f"   📸 Found {images.count()} images")

                # Debug each image
                for img in images:
                    print(f"      - Image {img.id}: front={img.front_image}, back={img.back_image}")

                serialized_images = ProductImageSerializer(images, many=True).data
                print(f"   ✅ Serialized images: {serialized_images}")
                return serialized_images
            else:
                print("   ❌ Product has no 'images' attribute")

                # Check what attributes the product actually has
                print(f"   🔍 Product attributes: {dir(obj.item)}")

                # Try alternative image field names
                if hasattr(obj.item, 'image') and obj.item.image:
                    print("   📸 Found single 'image' field")
                    return [{
                        'id': None,
                        'front_image': obj.item.image.url if hasattr(obj.item.image, 'url') else str(obj.item.image),
                        'back_image': None,
                        'is_primary': True,
                        'order': 0,
                        'alt_text': str(obj.item)
                    }]

        # For other item types, check if they have image fields
        elif hasattr(obj.item, 'image') and obj.item.image:
            print(f"   📸 Found single image field for {obj.content_type.model}")
            return [{
                'id': None,
                'front_image': obj.item.image.url if hasattr(obj.item.image, 'url') else str(obj.item.image),
                'back_image': None,
                'is_primary': True,
                'order': 0,
                'alt_text': str(obj.item)
            }]


        elif hasattr(obj.item, 'photo') and obj.item.photo:
            print(f"   📸 Found photo field for {obj.content_type.model}")
            return [{
                'id': None,
                'front_image': obj.item.photo.url if hasattr(obj.item.photo, 'url') else str(obj.item.photo),
                'back_image': None,
                'is_primary': True,
                'order': 0,
                'alt_text': str(obj.item)
            }]

        print(f"   ❌ No images found for {obj.content_type.model}")
        return []


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