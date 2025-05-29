from rest_framework import serializers

from apps.shops.models import (
    ProductImage, Product,
    ProductCategory
)


class ProductCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductCategory
        fields = ['id','name','slug']

class ProductImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductImage
        fields = [
            "id", "front_image",
            "is_primary","back_image",
            "order", "alt_text"
        ]

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    category = ProductCategorySerializer(read_only=True)

    class Meta:
        model = Product
        fields = [
            "id", "name", "slug", "price_in_sats",
            "price_in_fiat", "description", "short_description",
            "is_featured", "is_active","images",
            "category",
        ]