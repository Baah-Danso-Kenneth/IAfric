from django.shortcuts import render
from .models import (
    ProductImage, Product, ProductCategory)

from rest_framework.generics import ListAPIView

from .serializers import ProductSerializer, ProductCategorySerializer


class ShopProductListView(ListAPIView):
    serializer_class = ProductSerializer

    def get_queryset(self):
        queryset = Product.objects.filter(is_active=True,
                                     stock_quantity__gt=0
                                     ).prefetch_related("images", "category")
        category_slug = self.request.query_params.get('category')

        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)

        return queryset

class ProductCategoryListView(ListAPIView):
    queryset = ProductCategory.objects.all()
    serializer_class = ProductCategorySerializer