# models.py
from django.db import models, transaction
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.conf import settings
from django.utils import timezone
from django.core.validators import MinValueValidator
from django.core.exceptions import ValidationError
from django.db.models import Sum, F, Q
import logging
from .cart_manager import CartManager

logger = logging.getLogger(__name__)


class Cart(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='carts',
        null=True,
        blank=True
    )
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    checked_out = models.BooleanField(default=False)
    checkout_date = models.DateTimeField(null=True, blank=True)
    is_saved_for_later = models.BooleanField(default=False)
    session_key = models.CharField(max_length=255, null=True, blank=True)

    # Add cart metadata
    notes = models.TextField(blank=True, help_text="Optional notes for this cart")

    objects = CartManager()

    class Meta:
        indexes = [
            models.Index(fields=['user', 'checked_out']),
            models.Index(fields=['session_key', 'checked_out']),
            models.Index(fields=['updated']),
        ]
        constraints = [
            # Ensure only one active cart per user
            models.UniqueConstraint(
                fields=['user'],
                condition=Q(checked_out=False, user__isnull=False),
                name='unique_active_user_cart'
            ),
            # FIXED: Updated constraint to work with get_or_create
            models.UniqueConstraint(
                fields=['session_key'],
                condition=Q(checked_out=False, session_key__isnull=False, user__isnull=True),
                name='unique_active_session_cart'
            )
        ]

    def clean(self):
        """Model validation"""
        if not self.user and not self.session_key:
            raise ValidationError("Cart must have either a user or session_key")

    @transaction.atomic
    def add_item(self, item, quantity=1, replace_quantity=False):
        """
        Add an item to the cart with proper concurrency handling
        """
        if quantity <= 0:
            raise ValueError("Quantity must be positive")

        if self.checked_out:
            raise ValueError("Cannot add items to a checked-out cart")

        # Check stock if the item supports it
        if hasattr(item, 'check_stock') and not item.check_stock(quantity):
            raise ValueError(f"Insufficient stock. Available: {getattr(item, 'stock', 0)}")

        content_type = ContentType.objects.get_for_model(item)

        # Use select_for_update to prevent race conditions
        existing_item = CartItem.objects.select_for_update().filter(
            cart=self,
            content_type=content_type,
            object_id=item.id,
        ).first()

        if existing_item:
            if replace_quantity:
                existing_item.quantity = quantity
            else:
                existing_item.quantity += quantity
            existing_item.save(update_fields=['quantity'])
            cart_item = existing_item
        else:
            cart_item = CartItem.objects.create(
                cart=self,
                content_type=content_type,
                object_id=item.id,
                quantity=quantity,
                price_in_sats=self._get_item_price(item)
            )
            
        self.save(update_fields=['updated'])

        logger.info(f"Added item {item.id} to cart {self.id}, quantity: {quantity}")
        return cart_item

    @transaction.atomic
    def update_item_quantity(self, item_id, quantity):
        """Update the quantity of an item in the cart"""
        if quantity < 0:
            raise ValueError("Quantity cannot be negative")

        if quantity == 0:
            return self.remove_item_by_id(item_id)

        try:
            cart_item = CartItem.objects.select_for_update().get(
                cart=self,
                id=item_id,
            )

            # Check stock if applicable
            if hasattr(cart_item.item, 'check_stock') and not cart_item.item.check_stock(quantity):
                raise ValueError(f"Insufficient stock. Available: {getattr(cart_item.item, 'stock', 0)}")

            cart_item.quantity = quantity
            cart_item.save(update_fields=['quantity'])

            # FIXED: Update cart timestamp
            self.save(update_fields=['updated'])

            return cart_item
        except CartItem.DoesNotExist:
            raise ValueError("Cart item not found")

    @transaction.atomic
    def remove_item_by_id(self, item_id):
        """Remove an item from the cart by CartItem ID"""
        try:
            cart_item = CartItem.objects.get(
                cart=self,
                id=item_id
            )
            cart_item.delete()

            # FIXED: Update cart timestamp
            self.save(update_fields=['updated'])

            return True
        except CartItem.DoesNotExist:
            return False

    def _get_item_price(self, item):
        """Get the price for different types of items in satoshis"""
        if hasattr(item, 'price_in_sats') and item.price_in_sats is not None:
            return item.price_in_sats
        elif hasattr(item, 'price') and item.price is not None:
            if isinstance(item.price, int):
                return item.price
            return int(item.price)
        return 0

    @property
    def total_sats(self):
        """Calculate total price in satoshis using database aggregation"""
        result = self.items.aggregate(
            total=Sum(F('price_in_sats') * F('quantity'))
        )
        return result['total'] or 0

    @property
    def item_count(self):
        """Get the total number of items in the cart using database aggregation"""
        result = self.items.aggregate(total_items=Sum('quantity'))
        return result['total_items'] or 0

    @property
    def unique_item_count(self):
        return self.items.count()

    @property
    def is_empty(self):
        """Check if the cart is empty"""
        return not self.items.exists()

    def get_items_with_availability(self):
        """Get all cart items with their availability status"""
        items = []
        for cart_item in self.items.select_related('content_type').all():
            item_data = {
                'cart_item': cart_item,
                'is_available': cart_item.is_still_available(),
                'has_sufficient_stock': cart_item.has_sufficient_stock()
            }
            items.append(item_data)
        return items

    @transaction.atomic
    def clear(self):
        """Clear all items from the cart"""
        deleted_count = self.items.all().delete()[0]
        # FIXED: Update timestamp when clearing
        self.save(update_fields=['updated'])

        logger.info(f"Cleared {deleted_count} items from cart {self.id}")
        return deleted_count

    def mark_checked_out(self):
        """Mark the cart as checked out"""
        self.checked_out = True
        self.checkout_date = timezone.now()
        self.save(update_fields=['checked_out', 'checkout_date'])

    def validate_for_checkout(self):
        """Validate that all items in cart are available for checkout"""
        errors = []

        if self.is_empty:
            errors.append("Cart is empty")
            return errors

        for cart_item in self.items.all():
            if not cart_item.is_still_available():
                errors.append(f"Item '{cart_item.item}' is no longer available")
            elif not cart_item.has_sufficient_stock():
                available_stock = getattr(cart_item.item, 'stock', 0)
                errors.append(
                    f"Insufficient stock for '{cart_item.item}'. "
                    f"Requested: {cart_item.quantity}, Available: {available_stock}"
                )

        return errors

    def __str__(self):
        if self.user:
            identifier = f"User: {self.user.username}"
        else:
            identifier = f"Session: {self.session_key[:8]}..." if self.session_key else "No Session"

        status = "Checked Out" if self.checked_out else "Active"
        return f"Cart {self.id} - {identifier} ({status})"


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        related_name='items',
        on_delete=models.CASCADE
    )
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    item = GenericForeignKey('content_type', 'object_id')

    price_in_sats = models.PositiveIntegerField(
        help_text="Price in satoshis at time of adding to cart"
    )
    quantity = models.PositiveIntegerField(
        default=1,
        validators=[MinValueValidator(1)]
    )
    date_added = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date_added']
        indexes = [
            models.Index(fields=['cart', 'content_type', 'object_id']),
            models.Index(fields=['cart']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['cart', 'content_type', 'object_id'],
                name='unique_cart_item_variant'
            )
        ]

    def clean(self):
        """Model validation"""
        if self.quantity <= 0:
            raise ValidationError("Quantity must be positive")

    @property
    def total_price(self):
        """Calculate total price for this item"""
        return self.price_in_sats * self.quantity

    def is_still_available(self):
        """Check if the item is still available"""
        if not self.item:
            return False

        # Check if item has availability method
        if hasattr(self.item, 'is_available'):
            return self.item.is_available()
        elif hasattr(self.item, 'is_active'):
            return self.item.is_active
        elif hasattr(self.item, 'status'):
            return self.item.status == 'active'

        return True  # Default to available if no status field

    def has_sufficient_stock(self):
        """Check if there's sufficient stock for the requested quantity"""
        if not self.item:
            return False

        if hasattr(self.item, 'check_stock'):
            return self.item.check_stock(self.quantity)
        elif hasattr(self.item, 'stock'):
            return self.item.stock >= self.quantity

        return True  # Default to sufficient if no stock tracking

    def get_current_price(self):
        """Get the current price of the item (may differ from cart price)"""
        if not self.item:
            return self.price_in_sats

        if hasattr(self.item, 'price_in_sats'):
            return self.item.price_in_sats
        elif hasattr(self.item, 'price'):
            return int(self.item.price) if self.item.price else self.price_in_sats

        return self.price_in_sats

    def has_price_changed(self):
        """Check if the item price has changed since adding to cart"""
        return self.get_current_price() != self.price_in_sats

    def __str__(self):
        if not self.item:
            item_name = f"Deleted Item ({self.object_id})"
        else:
            item_name = str(self.item)

        variant_info = f" - {self.variant_name}" if self.variant_name else ""
        return f"{self.quantity}x {item_name}{variant_info}"