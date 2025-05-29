from django.db import models
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from django.conf import settings
from django.utils.text import slugify
from django.core.validators import MinValueValidator
from decimal import Decimal
import uuid


class ProductCategory(models.Model):
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True)
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Product Categories"
        ordering = ['name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if not self.meta_title:
            self.meta_title = self.name
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Product(models.Model):
    category = models.ForeignKey(
        ProductCategory,
        on_delete=models.CASCADE,
        related_name='products'
    )
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField()
    short_description = models.TextField(blank=True, help_text="Brief product summary for listings")

    price_in_sats = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    price_in_fiat = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text="Optional fiat price equivalent"
    )

    stock_quantity = models.PositiveIntegerField(default=3)
    sku = models.CharField(max_length=100, unique=True, blank=True, null=True)
    track_inventory = models.BooleanField(default=True)
    low_stock_threshold = models.PositiveIntegerField(default=5)

    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)

    # SEO optimization
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_active', 'price_in_sats']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)

        # Auto-generate SKU if not provided
        if not self.sku:
            prefix = ''.join(word[0] for word in self.name.split()[:3]).upper()
            self.sku = f"{prefix}-{uuid.uuid4().hex[:6].upper()}"

        if not self.meta_title:
            self.meta_title = self.name

        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    def is_in_stock(self):
        return self.stock_quantity > 0 if self.track_inventory else True

    def is_low_stock(self):
        return self.stock_quantity <= self.low_stock_threshold if self.track_inventory else False


class ProductImage(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='images'
    )
    front_image = models.ImageField(upload_to="shop/products/", blank=True)
    back_image = models.ImageField(upload_to="shop/products/", blank=True)
    alt_text = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_primary = models.BooleanField(default=False)

    class Meta:
        ordering = ['order']
        constraints = [
            models.UniqueConstraint(
                fields=['product'],
                condition=models.Q(is_primary=True),
                name='unique_primary_image'
            )
        ]

    def __str__(self):
        return f"Image {self.order} for {self.product.name}"

    def save(self, *args, **kwargs):
        # If this is marked as primary, unmark others
        if self.is_primary:
            ProductImage.objects.filter(
                product=self.product,
                is_primary=True
            ).exclude(pk=self.pk).update(is_primary=False)
        super().save(*args, **kwargs)


class ProductVariant(models.Model):
    product = models.ForeignKey(
        Product,
        on_delete=models.CASCADE,
        related_name='variants'
    )
    name = models.CharField(max_length=255, help_text="E.g., 'Small', 'Red', etc.")
    sku = models.CharField(max_length=100, unique=True)
    price_adjustment = models.IntegerField(
        default=0,
        help_text="Additional satoshis to add/subtract from base product price"
    )
    stock_quantity = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.product.name} - {self.name}"

    def get_price(self):
        return self.product.price_in_sats + self.price_adjustment