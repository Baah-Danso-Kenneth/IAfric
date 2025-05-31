# apps/lightningPayments/models.py (Updated)
from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from django.conf import settings
from apps.carts.models import Cart
from .services import LNDbitsService, LNDbitsError
from apps.lightningPayments.utils import  generate_invoice_id
import logging

logger = logging.getLogger(__name__)


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

    amount = models.PositiveIntegerField(help_text="Amount in satoshis")
    fiat_amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Optional fiat equivalent"
    )
    fiat_currency = models.CharField(max_length=3, default="USD", help_text="Currency code (e.g., USD)")


    invoice_id = models.CharField(max_length=255, unique=True)
    payment_hash = models.CharField(max_length=255, blank=True)
    payment_preimage = models.CharField(max_length=255, blank=True)
    bolt11 = models.TextField(blank=True, help_text="Complete BOLT11 invoice")

    # LNDbits specific fields
    checking_id = models.CharField(max_length=255, blank=True, help_text="LNDbits checking ID")

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
            models.Index(fields=['payment_hash']),
            models.Index(fields=['checking_id']),
        ]

    def __str__(self):
        return f"Payment {self.invoice_id} - {self.get_status_display()}"

    def save(self, *args, **kwargs):
        if not self.invoice_id:
            self.invoice_id = generate_invoice_id()
        super().save(*args, **kwargs)

    @classmethod
    def create_invoice(cls, user, amount_sats, description="", cart=None, paid_item=None, fiat_amount=None,
                       fiat_currency="USD", expiry_minutes=None):
        """
        Create a new Lightning invoice using LNDbits

        Args:
            user: User making the payment
            amount_sats (int): Amount in satoshis
            description (str): Payment description
            cart: Optional cart object
            paid_item: Optional single item being purchased
            fiat_amount: Optional fiat equivalent amount
            fiat_currency (str): Fiat currency code
            expiry_minutes (int): Minutes until invoice expires

        Returns:
            LightningPayment: Created payment object
        """
        if expiry_minutes is None:
            expiry_minutes = getattr(settings, 'LIGHTNING_INVOICE_EXPIRY_MINUTES', 60)

        # Create the payment object first
        payment = cls(
            user=user,
            amount=amount_sats,
            fiat_amount=fiat_amount,
            fiat_currency=fiat_currency,
            cart=cart,
            expires_at=timezone.now() + timezone.timedelta(minutes=expiry_minutes)
        )

        # Set the generic foreign key if paid_item is provided
        if paid_item:
            payment.content_type = ContentType.objects.get_for_model(paid_item)
            payment.object_id = paid_item.id

        payment.save()  # Save to get an ID and generate invoice_id

        try:

            lndbits = LNDbitsService()
            invoice_data = lndbits.create_payment_request(
                amount_sats=amount_sats,
                description=f"{description} - Invoice: {payment.invoice_id}",
                expiry_minutes=expiry_minutes
            )


            payment.payment_hash = invoice_data['payment_hash']
            payment.bolt11 = invoice_data['bolt11']
            payment.checking_id = invoice_data.get('checking_id', '')
            payment.save()

            logger.info(f"Created Lightning invoice {payment.invoice_id} for {amount_sats} sats")
            return payment

        except LNDbitsError as e:
            logger.error(f"Failed to create LNDbits invoice: {str(e)}")
            payment.status = 'failed'
            payment.error_message = str(e)
            payment.save()
            raise e

    def check_payment_status(self):
        """
        Check payment status with LNDbits

        Returns:
            bool: True if status changed, False otherwise
        """
        if self.status != 'pending' or not self.payment_hash:
            return False

        try:
            lndbits = LNDbitsService()
            is_paid, payment_data = lndbits.verify_payment(self.payment_hash)

            if is_paid:
                self.mark_as_paid(
                    payment_hash=self.payment_hash,
                    payment_preimage=payment_data.get('preimage', '')
                )
                return True
            elif self.is_expired:
                self.status = 'expired'
                self.save()
                return True

        except LNDbitsError as e:
            logger.error(f"Failed to check payment status: {str(e)}")

        return False

    def mark_as_paid(self, payment_hash, payment_preimage=None):
        """Mark payment as paid with validation"""
        if self.status != 'pending':
            return False

        self.status = 'paid'
        self.payment_hash = payment_hash
        if payment_preimage:
            self.payment_preimage = payment_preimage
        self.paid_at = timezone.now()
        self.save()

        logger.info(f"Payment {self.invoice_id} marked as paid")

        # Process the purchase based on type
        try:
            if self.cart:
                success = self._process_cart_purchase()
            elif self.paid_item:
                success = self._process_single_item_purchase()
            else:
                success = True

            if success:
                logger.info(f"Successfully processed purchase for payment {self.invoice_id}")
            else:
                logger.error(f"Failed to process purchase for payment {self.invoice_id}")

            return success

        except Exception as e:
            logger.error(f"Error processing purchase for payment {self.invoice_id}: {str(e)}")
            return False

    def mark_as_refunded(self):
        """Mark a payment as refunded"""
        if self.status != 'paid':
            return False

        self.status = 'refunded'
        self.save()
        logger.info(f"Payment {self.invoice_id} marked as refunded")
        return True

    def _process_cart_purchase(self):
        """Process payment for all items in the cart"""
        if not self.cart:
            return False

        try:
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
                self._activate_purchased_item(product, quantity=cart_item.quantity)

            self.cart.checked_out = True
            self.cart.save()
            return True

        except Exception as e:
            logger.error(f"Error processing cart purchase: {str(e)}")
            return False

    def _process_single_item_purchase(self):
        """Process payment for a single item"""
        if not self.paid_item:
            return False

        try:
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

        except Exception as e:
            logger.error(f"Error processing single item purchase: {str(e)}")
            return False

    def _create_order(self):
        """Create an order record for this payment"""
        try:
            from apps.orders.models import Order
            return Order.objects.create(
                user=self.user,
                payment=self,
                total_sats=self.amount,
                status='completed'
            )
        except ImportError:
            logger.warning("Order model not available")
            return None

    def _add_item_to_order(self, order, item, quantity=1):
        """Add an item to the order with specified quantity"""
        if not order:
            return None

        try:
            from apps.orders.models import OrderItem
            return OrderItem.objects.create(
                order=order,
                content_type=ContentType.objects.get_for_model(item),
                object_id=item.id,
                quantity=quantity,
                price_sats=getattr(item, 'price_in_sats', 0),
                name=getattr(item, 'name', str(item))
            )
        except ImportError:
            logger.warning("OrderItem model not available")
            return None

    def _activate_purchased_item(self, item, quantity=1):
        """Activate the purchased item based on its type"""
        try:
            # Handle MembershipPlan purchases
            if 'memberships.models' in str(type(item)):
                from apps.memberships.models import Membership

                membership, created = Membership.objects.get_or_create(
                    user=self.user,
                    defaults={'plan': item}
                )

                if created:
                    membership.activate(payment=self)
                else:
                    membership.plan = item
                    membership.extend(payment=self)

            # Handle other types based on their capabilities
            elif hasattr(item, 'register_user'):
                item.register_user(self.user)
            elif hasattr(item, 'fulfill_purchase'):
                item.fulfill_purchase(user=self.user, payment=self, quantity=quantity)

        except ImportError as e:
            logger.warning(f"Could not import required module for item activation: {str(e)}")
        except Exception as e:
            logger.error(f"Error activating purchased item: {str(e)}")

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    def check_status(self):
        """Check if a pending payment has expired or been paid"""
        if self.status == 'pending':
            # First check with LNDbits
            if self.check_payment_status():
                return self.status

            # If not paid and expired, mark as expired
            if self.is_expired:
                self.status = 'expired'
                self.save()

        return self.status

    def get_satoshi_uri(self):
        """Generate a Lightning payment URI based on the bolt11 invoice"""
        if self.bolt11:
            return f"lightning:{self.bolt11}"
        return None

    def get_qr_code_data(self):
        """Get data for QR code generation"""
        return self.bolt11 if self.bolt11 else None