from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from apps.lightningPayments.models import LightningPayment
from apps.experiences.models import Experience
import uuid


class Accommodation(models.Model):
    experience = models.ForeignKey(Experience, on_delete=models.CASCADE, related_name='accommodations')
    name = models.CharField(max_length=200, blank=True, null=True)
    description = models.TextField()
    location = models.CharField(max_length=200, blank=True, null=True)
    image = models.ImageField(upload_to='accommodations/', null=True, blank=True)

    def __str__(self):
        return self.name or f"Accommodation for {self.experience.name}"


class IncludedItem(models.Model):
    experience = models.ForeignKey(Experience, on_delete=models.CASCADE, related_name='included_items')
    text = models.CharField(max_length=255)

    def __str__(self):
        return f"Included: {self.text}"


class NotIncludedItem(models.Model):
    experience = models.ForeignKey(Experience, on_delete=models.CASCADE, related_name='not_included_items')
    text = models.CharField(max_length=255)

    def __str__(self):
        return f"Not Included: {self.text}"


class Recommendation(models.Model):
    experience = models.ForeignKey(Experience, on_delete=models.CASCADE, related_name='recommendations')
    person_name = models.CharField(max_length=100)
    message = models.TextField()

    def __str__(self):
        return f"{self.person_name}'s Recommendation"


class HistoricalInfo(models.Model):
    experience = models.ForeignKey(Experience, on_delete=models.CASCADE, related_name='histories')
    content = models.TextField()

    def __str__(self):
        return f"History of {self.experience.place_name or self.experience.name}"


class MapAndContent(models.Model):

    experience = models.OneToOneField(Experience, on_delete=models.CASCADE, related_name='map_details', null=True)
    region_map = models.ImageField(upload_to='maps/', blank=True, null=True)
    best_time_title = models.CharField(max_length=30, blank=True, null=True)
    best_time_des = models.TextField(blank=True, null=True)
    weather_title = models.CharField(max_length=30, blank=True, null=True)
    weather_time_des = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.best_time_title or self.experience.name}"


class Itinerary(models.Model):
    """Multi-day itinerary for experiences"""
    experience = models.ForeignKey(Experience, on_delete=models.CASCADE, related_name='itineraries')
    day_number = models.PositiveIntegerField()
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    image = models.ImageField(upload_to='itineraries/', null=True, blank=True)
    meal_included = models.BooleanField(default=False)
    meal_description = models.CharField(max_length=255, blank=True)
    accommodation_included = models.BooleanField(default=False)
    accommodation_details = models.TextField(blank=True)

    class Meta:
        ordering = ['day_number']
        verbose_name_plural = "Itineraries"

    def __str__(self):
        return f"{self.experience.name} - Day {self.day_number}: {self.title}"