from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from django.conf import settings
from apps.lightningPayments.models import LightningPayment
from apps.experiences.models import Experience
from apps.locations.models import TourGuide

class Order(models.Model):
    ORDER_STATUS = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
        ('refunded', 'Refunded'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    payment = models.OneToOneField(LightningPayment, on_delete=models.PROTECT)
    order_number = models.CharField(max_length=20, unique=True)
    total_sats = models.PositiveIntegerField()
    status = models.CharField(max_length=10, choices=ORDER_STATUS, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.order_number:
            # Generate order number: ORDER-{year}{month}{day}-{random_chars}
            today = timezone.now()
            prefix = f"ORDER-{today.strftime('%Y%m%d')}"
            random_suffix = uuid.uuid4().hex[:6].upper()
            self.order_number = f"{prefix}-{random_suffix}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Order {self.order_number}"


class OrderItem(models.Model):
    """Individual items within an order"""
    order = models.ForeignKey(Order, related_name='items', on_delete=models.CASCADE)
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE)
    object_id = models.PositiveIntegerField()
    item = GenericForeignKey('content_type', 'object_id')


    name = models.CharField(max_length=255)
    price_sats = models.PositiveIntegerField()
    quantity = models.PositiveIntegerField(default=1)

    def __str__(self):
        return f"{self.quantity}x {self.name}"

    @property
    def total_price(self):
        return self.price_sats * self.quantity


