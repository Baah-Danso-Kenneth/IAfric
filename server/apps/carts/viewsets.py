# Improved views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.core.exceptions import ValidationError
from .models import Cart, CartItem
from .serializers import CartSerializer, CartItemSerializer
import logging

logger = logging.getLogger(__name__)


class CartViewSet(viewsets.ModelViewSet):
    serializer_class = CartSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        # Only return the current user's cart
        cart = self._get_or_create_cart()
        return Cart.objects.filter(id=cart.id)


    def _get_or_create_cart(self):
        """Get or create cart - optimized version"""
        user = self.request.user if self.request.user.is_authenticated else None

        # Ensure session exists
        if not self.request.session.session_key:
            self.request.session.save()

        session_key = self.request.session.session_key

        # ADD THIS DEBUG LOGGING
        logger.info(f"🔍 _get_or_create_cart called:")
        logger.info(f"  - request.user: {self.request.user}")
        logger.info(
            f"  - user.is_authenticated: {self.request.user.is_authenticated if hasattr(self.request.user, 'is_authenticated') else 'N/A'}")
        logger.info(f"  - user (final): {user}")
        logger.info(f"  - session_key: {session_key}")

        try:
            cart, created = Cart.objects.get_or_create_for_request(
                user=user,
                session_key=session_key
            )

            if created:
                logger.info(f"✅ Created NEW cart {cart.id} for {'user' if user else 'session'}")
            else:
                logger.info(f"♻️ REUSED existing cart {cart.id} for {'user' if user else 'session'}")

            return cart

        except Exception as e:
            logger.error(f"❌ Error getting/creating cart: {e}")
            raise

    def _handle_cart_error(self, error_msg, exception=None):
        """Centralized error handling"""
        if exception:
            logger.error(f"{error_msg}: {exception}")
        else:
            logger.error(error_msg)

        return Response(
            {'error': error_msg},
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get current active cart with validation info"""
        try:
            cart = self._get_or_create_cart()

            # Use select_related for better performance
            cart_items = cart.items.select_related('content_type').all()

            # Serialize cart data
            cart_data = self.get_serializer(cart).data

            # Add validation info
            validation_errors = cart.validate_for_checkout()

            return Response({
                'cart': cart_data,
                'validation_errors': validation_errors,
                'is_valid_for_checkout': len(validation_errors) == 0
            })

        except Exception as e:
            return self._handle_cart_error("Failed to retrieve cart", e)

    @transaction.atomic
    @action(detail=False, methods=['post'])
    def add_item(self, request):
        """Add item to cart with proper validation"""
        try:
            cart = self._get_or_create_cart()

            # Extract and validate data
            serializer_data = {
                'item_type': request.data.get('item_type'),
                'item_id': request.data.get('item_id'),
                'quantity': request.data.get('quantity', 1),
                'variant_name': request.data.get('variant_name'),
                'replace_quantity': request.data.get('replace_quantity', False)
            }

            # Validate required fields
            if not serializer_data['item_type'] or not serializer_data['item_id']:
                return self._handle_cart_error("item_type and item_id are required")

            try:
                quantity = int(serializer_data['quantity'])
                if quantity <= 0:
                    return self._handle_cart_error("Quantity must be positive")
            except (ValueError, TypeError):
                return self._handle_cart_error("Invalid quantity")

            # Get content type and item
            try:
                content_type = ContentType.objects.get(model=serializer_data['item_type'].lower())
                item = content_type.get_object_for_this_type(id=serializer_data['item_id'])
            except (ContentType.DoesNotExist, content_type.model_class().DoesNotExist):
                return self._handle_cart_error(
                    f"Invalid {serializer_data['item_type']} with id {serializer_data['item_id']}")

            # Add item to cart
            cart_item = cart.add_item(
                item=item,
                quantity=quantity,
                replace_quantity=serializer_data['replace_quantity']
            )

            return Response({
                'cart': self.get_serializer(cart).data,
                'added_item': CartItemSerializer(cart_item).data,
                'message': 'Item added successfully'
            })

        except ValueError as e:
            return self._handle_cart_error(str(e))
        except Exception as e:
            return self._handle_cart_error("Failed to add item", e)

    @transaction.atomic
    @action(detail=False, methods=['patch'])
    def update_item(self, request):
        """Update cart item quantity"""
        try:
            cart = self._get_or_create_cart()

            cart_item_id = request.data.get('cart_item_id')
            quantity = request.data.get('quantity')

            if not cart_item_id:
                return self._handle_cart_error("cart_item_id is required")

            try:
                quantity = int(quantity)
                if quantity < 0:
                    return self._handle_cart_error("Quantity cannot be negative")
            except (ValueError, TypeError):
                return self._handle_cart_error("Invalid quantity")

            # Use cart's update method instead of direct CartItem manipulation
            if quantity == 0:
                cart.remove_item_by_id(cart_item_id)
                message = "Item removed successfully"
            else:
                cart.update_item_quantity(cart_item_id, quantity)
                message = "Item updated successfully"

            return Response({
                'cart': self.get_serializer(cart).data,
                'message': message
            })

        except ValueError as e:
            return self._handle_cart_error(str(e))
        except Exception as e:
            return self._handle_cart_error("Failed to update item", e)

    @transaction.atomic
    @action(detail=False, methods=['delete'])
    def remove_item(self, request):
        """Remove item from cart"""
        try:
            cart = self._get_or_create_cart()
            cart_item_id = request.data.get('cart_item_id')

            if not cart_item_id:
                return self._handle_cart_error("cart_item_id is required")

            success = cart.remove_item_by_id(cart_item_id)

            if not success:
                return self._handle_cart_error("Cart item not found")

            return Response({
                'cart': self.get_serializer(cart).data,
                'message': 'Item removed successfully'
            })

        except Exception as e:
            return self._handle_cart_error("Failed to remove item", e)

    @transaction.atomic
    @action(detail=False, methods=['post'])
    def clear(self, request):
        try:
            cart = self._get_or_create_cart()
            deleted_count = cart.clear()

            return Response({
                'cart': self.get_serializer(cart).data,
                'message': f'Cart cleared - {deleted_count} items removed'
            })

        except Exception as e:
            return self._handle_cart_error("Failed to clear cart", e)