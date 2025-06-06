from rest_framework import routers
from django.urls import path

from apps.carts.viewsets import CartViewSet
from apps.experiences.views import (
    ExperienceDetailView
)
from apps.lightningPayments.viewsets import CurrencyUtilsViewSet
from apps.lightningPayments.viewsets.product_payment_viewset import ProductPaymentViewSet

from apps.shops.views import (
    ShopProductListView, ProductCategoryListView
)


router = routers.SimpleRouter()
router.register(r'payments', ProductPaymentViewSet, basename="payments")
router.register(r'converts', CurrencyUtilsViewSet, basename="currency")
router.register(r'cart', CartViewSet, basename="cart")

urlpatterns=[
    *router.urls,
    path('all-experience/<slug:slug>/',  ExperienceDetailView.as_view(), name='experience-data'),
    path('products/', ShopProductListView.as_view(), name='list-product'),
    path('categories/', ProductCategoryListView.as_view(), name='category-list'),
]