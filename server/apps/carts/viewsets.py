from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404
from django.db import transaction
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
import logging

logger = logging.getLogger(__name__)


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [AllowAny]

    @transaction.atomic
    @transaction.atomic
    def _get_or_create_cart(self):

        user = self.request.user if self.request.user.is_authenticated else None

        if not self.request.session.session_key:
            self.request.session.save()

        session_key = self.request.session.session_key

        logger.info(f"Cart request - User: {user}, Session: {session_key[:8] if session_key else 'None'}...")

        existing_carts = Cart.objects.filter(session_key=session_key, checked_out=False)
        logger.info(
            f"Existing carts for session {session_key[:8] if session_key else 'None'}: {list(existing_carts.values_list('id', flat=True))}")

        try:
            cart, created = Cart.objects.get_or_create_for_request(
                user=user,
                session_key=session_key
            )

            if created:
                logger.info(f"Created new cart {cart.id} for {'user' if user else 'session'}")
            else:
                logger.info(f"Using existing cart {cart.id}")

            logger.info(
                f"Cart {cart.id} - Session: {cart.session_key[:8] if cart.session_key else 'None'}, Items: {cart.item_count}")

            return cart

        except Exception as e:
            logger.error(f"Error getting/creating cart: {e}")
            raise

    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get the current active cart details"""
        try:
            cart = self._get_or_create_cart()

            # Get cart with item availability info
            cart_data = self.get_serializer(cart).data

            # Add availability info for each item
            items_with_availability = []
            for cart_item in cart.items.all():
                item_data = CartItemSerializer(cart_item).data
                item_data['is_available'] = cart_item.is_still_available()
                item_data['has_sufficient_stock'] = cart_item.has_sufficient_stock()
                item_data['price_changed'] = cart_item.has_price_changed()
                if item_data['price_changed']:
                    item_data['current_price'] = cart_item.get_current_price()
                items_with_availability.append(item_data)

            cart_data['items'] = items_with_availability

            # Check if cart needs validation
            checkout_validation = []
            if cart.items.exists():
                validation_errors = cart.validate_for_checkout()
                if validation_errors:
                    checkout_validation = validation_errors
            else:
                checkout_validation = ['Cart is empty']

            response_data = {
                'cart': cart_data,
                'checkout_validation': checkout_validation
            }

            logger.info(f"Returning cart {cart.id} with {cart.item_count} items")
            return Response(response_data)

        except Exception as e:
            logger.error(f"Error getting current cart: {e}")
            return Response(
                {'error': 'Failed to retrieve cart'},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @transaction.atomic
    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Add item to cart"""
        try:
            cart = self._get_or_create_cart()

            item_type = request.data.get('item_type')
            item_id = request.data.get('item_id')
            quantity = int(request.data.get('quantity', 1))
            variant_id = request.data.get('variant_id')
            variant_name = request.data.get('variant_name')
            replace_quantity = request.data.get('replace_quantity', False)

            logger.info(f"Adding item {item_id} (type: {item_type}) to cart {cart.id}, quantity: {quantity}")

            # Validate variant requirements
            if variant_id and not variant_name:
                return Response(
                    {'error': 'variant_name is required when variant_id is provided'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Get the content type and item
            try:
                content_type = ContentType.objects.get(model=item_type.lower())
                item = content_type.get_object_for_this_type(id=item_id)
            except (ContentType.DoesNotExist, content_type.model_class().DoesNotExist):
                return Response(
                    {'error': f'Invalid {item_type} with id {item_id}'},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Add item to cart - only pass variant params if both are provided
            if variant_id and variant_name:
                cart_item = cart.add_item(
                    item=item,
                    quantity=quantity,
                    replace_quantity=replace_quantity,
                    variant_id=variant_id,
                    variant_name=variant_name
                )
            else:
                cart_item = cart.add_item(
                    item=item,
                    quantity=quantity,
                    replace_quantity=replace_quantity
                )

            # IMPORTANT: Refresh cart from database to get updated data
            cart.refresh_from_db()

            logger.info(f"Successfully added item {item_id} to cart {cart.id}. Cart now has {cart.item_count} items")

            response_data = {
                'cart': self.get_serializer(cart).data,
                'added_item': CartItemSerializer(cart_item).data,
                'message': 'Item added to cart successfully'
            }

            return Response(response_data)

        except Exception as e:
            logger.error(f"Error adding item to cart: {e}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @transaction.atomic
    @action(detail=False, methods=['patch'])
    def update_item(self, request):
        """Update cart item quantity"""
        try:
            cart = self._get_or_create_cart()

            cart_item_id = request.data.get('cart_item_id')
            quantity = int(request.data.get('quantity', 1))
            variant_id = request.data.get('variant_id')

            cart_item = get_object_or_404(
                CartItem,
                id=cart_item_id,
                cart=cart
            )

            cart_item.quantity = quantity
            if variant_id:
                cart_item.variant_id = variant_id
            cart_item.save()

            # IMPORTANT: Refresh cart from database
            cart.refresh_from_db()

            return Response({
                'cart': self.get_serializer(cart).data,
                'message': 'Item updated successfully'
            })

        except Exception as e:
            logger.error(f"Error updating cart item: {e}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @transaction.atomic
    @action(detail=False, methods=['delete'])
    def remove_item(self, request):
        """Remove item from cart"""
        try:
            cart = self._get_or_create_cart()

            cart_item_id = request.data.get('cart_item_id')

            cart_item = get_object_or_404(
                CartItem,
                id=cart_item_id,
                cart=cart
            )

            cart_item.delete()

            # IMPORTANT: Refresh cart from database
            cart.refresh_from_db()

            return Response({
                'cart': self.get_serializer(cart).data,
                'message': 'Item removed successfully'
            })

        except Exception as e:
            logger.error(f"Error removing cart item: {e}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @transaction.atomic
    @action(detail=False, methods=['post'])
    def clear(self, request):
        """Clear all items from cart"""
        try:
            cart = self._get_or_create_cart()
            cart.items.all().delete()

            # IMPORTANT: Refresh cart from database
            cart.refresh_from_db()

            return Response({
                'cart': self.get_serializer(cart).data,
                'message': 'Cart cleared successfully'
            })

        except Exception as e:
            logger.error(f"Error clearing cart: {e}")
            return Response(
                {'error': str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )