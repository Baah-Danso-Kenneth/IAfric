# apps/lightningPayments/models.py (Updated)
from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from django.conf import settings
from apps.carts.models import Cart
from apps.lightningPayments.services.lnbit_service import (
    LNDbitsService,
    LNDbitsError
)
from apps.lightningPayments.utils import  generate_invoice_id
import time




class LightningPayment(models.Model):

    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('expired', 'Expired'),
        ('failed', 'Failed')
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    invoice_id = models.CharField(max_length=255, unique=True)
    amount = models.PositiveIntegerField(help_text="Amount in satoshis")

    fiat_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    fiat_currency = models.CharField(max_length=3, default="USD")

    payment_hash = models.CharField(max_length=255, blank=True)
    payment_preimage = models.CharField(max_length=255, blank=True)
    bolt11 = models.TextField(blank=True)
    checking_id = models.CharField(max_length=255, blank=True)

    # Status and timestamps
    status = models.CharField(max_length=10, choices=PAYMENT_STATUS, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField()

    description = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    error_message = models.TextField(blank=True)

    payment_type = models.CharField(max_length=50,default="shop")
    reference_id = models.CharField(max_length=255, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['status', 'expires_at']),
            models.Index(fields=['user', 'status']),
            models.Index(fields=['invoice_id']),
            models.Index(fields=['payment_hash']),
            models.Index(fields=['payment_type', 'reference_id']),
        ]

    def __str__(self):
        return f"Payment {self.invoice_id} - {self.get_status_display()}"

    def save(self, *args, **kwargs):
        if not self.invoice_id:
            self.invoice_id = generate_invoice_id()
        super().save(*args, **kwargs)

    @property
    def is_expired(self):
        return timezone.now() > self.expires_at

    def get_lightning_uri(self):
        return f"lightning:{self.bolt11}" if self.bolt11 else None