from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from django.conf import settings
from apps.carts.models import Cart

class LightningPayment(models.Model):
    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('paid', 'Paid'),
        ('expired', 'Expired'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
    ]

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name='lightning_payments'
    )
    # Use IntegerField for satoshis to avoid decimal issues
    amount = models.PositiveIntegerField(help_text="Amount in satoshis")
    fiat_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Optional fiat equivalent"
    )
    fiat_currency = models.CharField(max_length=3, default="USD", help_text="Currency code (e.g., USD)")

    # Lightning payment details
    invoice_id = models.CharField(max_length=255, unique=True)
    payment_hash = models.CharField(max_length=255, blank=True)
    payment_preimage = models.CharField(max_length=255, blank=True)
    bolt11 = models.TextField(blank=True, help_text="Complete BOLT11 invoice")

    # Status tracking
    status = models.CharField(max_length=10, choices=PAYMENT_STATUS, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField()

    # For tracking failed payments
    error_message = models.TextField(blank=True)

    # Generic relation to purchased item
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, null=True, blank=True)
    object_id = models.PositiveIntegerField(null=True, blank=True)
    paid_item = GenericForeignKey('content_type', 'object_id')

    # For cart payments
    cart = models.ForeignKey(Cart, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['status', 'expires_at']),
            models.Index(fields=['user', 'status']),
            models.Index(fields=['invoice_id']),
        ]

    def __str__(self):
        return f"Payment {self.invoice_id} - {self.get_status_display()}"

    def mark_as_paid(self, payment_hash, payment_preimage=None):
        """Mark payment as paid with validation"""
        if self.status != 'pending':
            # Don't allow changing from any other status
            return False

        self.status = 'paid'
        self.payment_hash = payment_hash
        if payment_preimage:
            self.payment_preimage = payment_preimage
        self.paid_at = timezone.now()
        self.save()

        # Process the purchase based on type
        if self.cart:
            return self._process_cart_purchase()
        elif self.paid_item:
            return self._process_single_item_purchase()

        return True

    def mark_as_refunded(self):
        """Mark a payment as refunded"""
        if self.status != 'paid':
            return False

        self.status = 'refunded'
        self.save()
        # You might want to handle inventory updates here
        return True

    def _process_cart_purchase(self):
        """Process payment for all items in the cart"""
        if not self.cart:
            return False

        from apps.carts.models import CartItem

        # Create order history
        order = self._create_order()

        # Process each item in the cart
        for cart_item in self.cart.items.all():
            product = cart_item.item

            # Decrease stock if inventory is tracked
            if hasattr(product, 'stock_quantity') and hasattr(product, 'track_inventory'):
                if product.track_inventory:
                    product.stock_quantity = max(0, product.stock_quantity - cart_item.quantity)
                    product.save()

            self._add_item_to_order(order, product, cart_item.quantity)

            # Activate product if it's a special type (membership, etc.)
            self._activate_purchased_item(product, quantity=cart_item.quantity)

        self.cart.checked_out = True
        self.cart.save()

        return True

    def _process_single_item_purchase(self):
        """Process payment for a single item"""
        if not self.paid_item:
            return False

        # Create order for single item
        order = self._create_order()
        self._add_item_to_order(order, self.paid_item, 1)

        if hasattr(self.paid_item, 'stock_quantity') and hasattr(self.paid_item, 'track_inventory'):
            if self.paid_item.track_inventory:
                self.paid_item.stock_quantity = max(0, self.paid_item.stock_quantity - 1)
                self.paid_item.save()

        # Activate the purchased item
        self._activate_purchased_item(self.paid_item)

        return True

    def _create_order(self):
        """Create an order record for this payment"""
        # This would be implemented when you have an Order model
        from apps.orders.models import Order
        return Order.objects.create(
            user=self.user,
            payment=self,
            total_sats=self.amount,
            status='completed'
        )
        pass

    def _add_item_to_order(self, order, item, quantity=1):
        """Add an item to the order with specified quantity"""
        # This would be implemented when you have an OrderItem model
        from apps.orders.models import OrderItem
        return OrderItem.objects.create(
            order=order,
            content_type=ContentType.objects.get_for_model(item),
            object_id=item.id,
            quantity=quantity,
            price_sats=item.price_in_sats,
            name=item.name
        )
        pass

    def _activate_purchased_item(self, item, quantity=1):
        """Activate the purchased item based on its type"""
        # We'll use lazy imports to avoid circular dependencies
        try:
            # Handle MembershipPlan purchases
            if 'memberships.models' in str(type(item)):
                from apps.memberships.models import Membership

                # Create or update membership
                membership, created = Membership.objects.get_or_create(
                    user=self.user,
                    defaults={'plan': item}
                )

                if created:
                    # New membership
                    membership.activate(payment=self)
                else:
                    # Existing membership - extend it
                    membership.plan = item
                    membership.extend(payment=self)

            # Handle other types based on their module path
            elif hasattr(item, 'register_user'):
                # For experience-type products
                item.register_user(self.user)
            elif hasattr(item, 'fulfill_purchase'):
                # Generic method for products that know how to fulfill themselves
                item.fulfill_purchase(user=self.user, payment=self, quantity=quantity)
        except ImportError:
            # Log that we couldn't import the necessary module
            pass

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    def check_status(self):
        """Check if a pending payment has expired"""
        if self.status == 'pending' and self.is_expired:
            self.status = 'expired'
            self.save()
            return 'expired'
        return self.status

    def get_satoshi_uri(self):
        """Generate a Lightning payment URI based on the bolt11 invoice"""
        if self.bolt11:
            return f"lightning:{self.bolt11}"
        return None


