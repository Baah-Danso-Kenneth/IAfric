from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from apps.lightningPayments.models import LightningPayment
import uuid


class Location(models.Model):
    name = models.CharField(max_length=255)

    slug = models.SlugField(max_length=255, unique=True, blank=True)
    address = models.TextField(blank=True)
    city = models.CharField(max_length=100)
    meal_included = models.CharField(max_length=100, blank=True, help_text="e.g. 'Breakfast and Dinner'")
    state_province = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100)
    # Geo coordinates for mapping
    latitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)
    longitude = models.DecimalField(max_digits=9, decimal_places=6, null=True, blank=True)

    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="experiences/locations/", blank=True, null=True)
    region_map = models.ImageField(upload_to='maps/', blank=True, null=True)

    best_time_title = models.CharField(max_length=30, blank=True, null=True)
    best_time_description = models.TextField(blank=True, null=True)
    weather_title = models.CharField(max_length=30, blank=True, null=True)
    weather_description = models.TextField(blank=True, null=True)
    is_reverse_season = models.BooleanField(default=False)
    season_note = models.TextField(blank=True, null=True)

    class Meta:
        ordering = ['country', 'city', 'name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name}, {self.city}, {self.country}"

class TourGuide(models.Model):
    """Tour guides that lead experiences"""
    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    bio = models.TextField()
    image = models.ImageField(upload_to='guides/', blank=True)

    # Contact information
    email = models.EmailField(blank=True)
    phone = models.CharField(max_length=50, blank=True)
    website = models.URLField(blank=True)
    instagram = models.CharField(max_length=100, blank=True)
    location = models.ManyToManyField("Location",
                                 related_name="tour_guides"
                                 )
    # Qualifications and specialties
    languages = models.JSONField(default=list, blank=True)
    specialties = models.JSONField(default=list, blank=True)
    years_experience = models.PositiveIntegerField(default=0)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class LocationDetails(models.Model):
    """Additional location details (from first code)"""
    experience = models.OneToOneField('apps_experiences.Experience', on_delete=models.CASCADE, related_name='location_details')
    map_image = models.ImageField(upload_to='locations/')
    best_time_to_visit = models.TextField()
    weather_info = models.TextField()

    def __str__(self):
        return f"Location Details for {self.experience.place_name or self.experience.name}"