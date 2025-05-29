from django.shortcuts import render
from .models import ProductImage, Product
from rest_framework.generics import ListAPIView

from .serializers import ProductSerializer


class ShopProductListView(ListAPIView):
    queryset = Product.objects.filter(is_active=True,
                                     stock_quantity__gt=0
                                     ).prefetch_related("images")
    serializer_class = ProductSerializer
