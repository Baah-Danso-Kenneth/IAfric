from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.conf import settings
from django.utils import timezone


class Cart(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='carts'
    )
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)
    checked_out = models.BooleanField(default=False)
    checkout_date = models.DateTimeField(null=True, blank=True)

    # Cart can be saved for later
    is_saved_for_later = models.BooleanField(default=False)

    # For session-based carts (guest users)
    session_key = models.CharField(max_length=255, null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['user', 'checked_out']),
            models.Index(fields=['session_key']),
        ]

    def add_item(self, item, quantity=1, replace_quantity=False):
        """
        Add an item to the cart

        Parameters:
        - item: The product or item to add
        - quantity: How many to add
        - replace_quantity: If True, replaces the quantity instead of adding to it
        """
        if self.checked_out:
            raise ValueError("Cannot add items to a checked-out cart")

        # Get content type
        content_type = ContentType.objects.get_for_model(item)

        # Check if item is already in cart
        cart_item, created = CartItem.objects.get_or_create(
            cart=self,
            content_type=content_type,
            object_id=item.id,
            defaults={
                'quantity': quantity,
                'price_in_sats': self._get_item_price(item)
            }
        )

        if not created:
            if replace_quantity:
                cart_item.quantity = quantity
            else:
                cart_item.quantity += quantity
            cart_item.save()

        # Update cart timestamp
        self.updated = timezone.now()
        self.save(update_fields=['updated'])

        return cart_item

    def update_item_quantity(self, item, quantity):
        """Update the quantity of an item in the cart"""
        if quantity <= 0:
            return self.remove_item(item)

        content_type = ContentType.objects.get_for_model(item)
        try:
            cart_item = CartItem.objects.get(
                cart=self,
                content_type=content_type,
                object_id=item.id
            )
            cart_item.quantity = quantity
            cart_item.save()

            # Update cart timestamp
            self.updated = timezone.now()
            self.save(update_fields=['updated'])

            return cart_item
        except CartItem.DoesNotExist:
            return None

    def remove_item(self, item):
        """Remove an item from the cart"""
        content_type = ContentType.objects.get_for_model(item)
        result = CartItem.objects.filter(
            cart=self,
            content_type=content_type,
            object_id=item.id
        ).delete()

        # Update cart timestamp
        self.updated = timezone.now()
        self.save(update_fields=['updated'])

        return result[0] > 0  # Return True if items were deleted

    def _get_item_price(self, item):
        """Get the price for different types of items in satoshis"""
        # First check for price_in_sats from the improved Product model
        if hasattr(item, 'price_in_sats'):
            return item.price_in_sats
        # Fallback to price attribute if exists
        elif hasattr(item, 'price'):
            # Check if it's already an integer value
            if isinstance(item.price, int):
                return item.price
            return int(item.price)  # Convert to int if it's a Decimal or float
        # Handle other item types or use default value
        return 0

    @property
    def total_sats(self):
        """Calculate total price in satoshis"""
        return sum(item.price_in_sats * item.quantity for item in self.items.all())

    @property
    def item_count(self):
        """Get the total number of items in the cart"""
        return sum(item.quantity for item in self.items.all())

    @property
    def is_empty(self):
        """Check if the cart is empty"""
        return self.items.count() == 0

    def clear(self):
        """Clear all items from the cart"""
        self.items.all().delete()

        # Update cart timestamp
        self.updated = timezone.now()
        self.save(update_fields=['updated'])

    def mark_checked_out(self):
        """Mark the cart as checked out"""
        self.checked_out = True
        self.checkout_date = timezone.now()
        self.save(update_fields=['checked_out', 'checkout_date'])

    def __str__(self):
        username = self.user.username if self.user else "Guest"
        return f"Cart {self.id} - {username} {'(Checked Out)' if self.checked_out else ''}"


class CartItem(models.Model):
    cart = models.ForeignKey(
        Cart,
        related_name='items',
        on_delete=models.CASCADE
    )
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    item = GenericForeignKey('content_type', 'object_id')

    # Using PositiveIntegerField for satoshis to be consistent with Product model
    price_in_sats = models.PositiveIntegerField(
        help_text="Price in satoshis at time of adding to cart"
    )
    quantity = models.PositiveIntegerField(default=1)
    date_added = models.DateTimeField(auto_now_add=True)

    # For handling product variants
    variant_id = models.PositiveIntegerField(null=True, blank=True)
    variant_name = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['-date_added']
        indexes = [
            models.Index(fields=['cart', 'content_type', 'object_id']),
        ]

    @property
    def total_price(self):
        """Calculate total price for this item"""
        return self.price_in_sats * self.quantity

    def is_still_available(self):
        """Check if the item is still available (in stock)"""
        if not hasattr(self.item, 'is_in_stock'):
            return True  # If it doesn't have stock tracking, assume available
        return self.item.is_in_stock()

    def __str__(self):
        item_name = str(self.item) if self.item else f"Unknown Item ({self.object_id})"
        variant_info = f" - {self.variant_name}" if self.variant_name else ""
        return f"{self.quantity}x {item_name}{variant_info}"