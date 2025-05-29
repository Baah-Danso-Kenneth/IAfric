from rest_framework import routers
from django.urls import path
from apps.experiences.views import (
    ExperienceDetailView
)
from apps.shops.views import ShopProductListView


router = routers.SimpleRouter()


urlpatterns=[
    *router.urls,
    path('all-experience/<slug:slug>/',  ExperienceDetailView.as_view(), name='experience-data'),
    path('products/', ShopProductListView.as_view(), name='list-product'),
]