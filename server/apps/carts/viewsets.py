from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer



class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer

    def get_queryset(self):
        return Cart.objects.filter(
            user=self.request.user,
            checked_out=False
        ).prefetch_related('items')

    def get_or_create_cart(self):
        cart, created = Cart.objects.get_or_create(
            user=self.request.user,
            checked_out=False,
            defaults={'session_key': None}
        )
        return cart

    @action(detail=False, methods=['get'])
    def current(self, request):
        cart = self.get_or_create_cart()
        serializer = self.get_serializer(cart)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def add_item(self, request):
        cart = self.get_or_create_cart()
        item_type = request.data.get('item_type')
        item_id = request.data.get('item_id')
        quantity= int(request.data.get('quantity'))
        variant_id = request.data.get('variant_id')
        replace_quantity = request.data.get('replace_quantity')

        try:
            content_type = ContentType.objects.get(model=item_type.lower())
            ItemModel = content_type.model_class()
            item = get_object_or_404(ItemModel, id=item_id)

            existing_item = CartItem.objects.filter(
                cart=cart,
                content_type=content_type,
                object_id=item_id,
                variant_id=variant_id
            ).first()

            if existing_item:
                if replace_quantity:
                    existing_item.quantity=quantity
                else:
                    existing_item.quantity += quantity
                existing_item.save()
                cart_item = existing_item

            else:
                cart_item = CartItem.objects.create(
                    cart=cart,
                    content_type=content_type,
                    object_id=item_id,
                    quantity=quantity,
                    price_in_sats= cart._get_item_price(item),
                    variant_id=variant_id,
                    variant_name= variant_name
                )
            cart.save(update_fields=['updated'])

            cart_serializer = self.get_serializer(cart)
            return Response({
                'cart': cart_serializer.data,
                'added_item': CartItemSerializer(cart_item).data,
                'message': 'Item added to cart successfully'
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['patch'])
    def update_item(self, request):
        cart = self.get_or_create_cart()
        item_id = request.data.get('cart_item_id')
        quantity = int(request.data.get('quantity'))

        try:
            cart = get_object_or_404(CartItem, id=item_id, cart=cart)
            if quantity <=0:
                cart_item.delete()
                message = 'Item removed from cart'
            else:
                cart_item.quantity = quantity
                cart_item.save()
                message = 'Item quantity updated'
            cart.save(update_fields=['updated'])

            cart_serializer = self.get_serializer(cart)
            return Response({
               'cart': cart_serializer.data,
                'message': message,
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                'error':str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'])
    def remove_item(self, request):
        cart = self.get_or_create_cart()
        cart_item_id = request.data.get('cart_item_id')

        try:
            cart_item = get_object_or_404(CartItem, id=cart_item_id, cart=cart)
            cart_item.delete()

            cart.save(update_fields=['updated'])
            cart_serializer = self.get_serializer(cart)
            return Response({
                'cart': cart_serializer.data,
                'message': 'Item removed from cart'
            },status=status.HTTP_200_OK)

        except Exception as e:
            return Response({
                "error": str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'])
    def clear(self, request):
        cart = self.get_or_create_cart()
        cart.clear()
        cart_serializer = self.get_serializer(cart)
        return Response({
            'cart': cart_serializer.data,
            'message': 'Cart cleared successfully'
        }, status=status.HTTP_200_OK)

