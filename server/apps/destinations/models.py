from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from django.utils import timezone
from django.conf import settings


class TourGuide(models.Model):
    name = models.CharField(max_length=100)
    bio = models.TextField()
    image = models.ImageField(upload_to='guides/', blank=True)

    def __str__(self):
        return self.name


class Destination(models.Model):
    title = models.CharField(max_length=200)
    place_name = models.CharField(max_length=200, null=True, blank=True)
    main_image = models.ImageField(upload_to='destinations/', null=True, blank=True)
    description = models.TextField()
    guide = models.ForeignKey(TourGuide, on_delete=models.SET_NULL, null=True, related_name='destinations')
    duration_days = models.PositiveIntegerField(null=True, blank=True)
    duration_nights = models.PositiveIntegerField(null=True, blank=True)
    base_price_per_person = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)
    is_reverse_season = models.BooleanField(default=False)
    season_note = models.TextField(blank=True, null=True)

    # Integrating location details
    region_map = models.ImageField(upload_to='maps/', blank=True, null=True)
    best_time_title = models.CharField(max_length=30, blank=True, null=True)
    best_time_description = models.TextField(blank=True, null=True)
    weather_title = models.CharField(max_length=30, blank=True, null=True)
    weather_description = models.TextField(blank=True, null=True)

    # For purchasable items
    is_purchasable = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.title}"

    def register_user(self, user):
        """Register a user for this destination after purchase"""
        # Implementation depends on your business logic
        pass


class DestinationDetail(models.Model):
    """Model to store all additional details related to an destination"""
    destination = models.OneToOneField(Destination, on_delete=models.CASCADE, related_name='details')

    # Inclusions and exclusions (JSON field)
    included_items = models.JSONField(default=list)  # Store as a list of strings
    not_included_items = models.JSONField(default=list)  # Store as a list of strings

    # Historical information
    historical_content = models.TextField(blank=True, null=True)

    # Recommendations (JSON field)
    recommendations = models.JSONField(default=list)  # List of dicts with 'name' and 'message'

    # Accommodations (JSON field)
    accommodations = models.JSONField(default=list)  # List of dicts with accommodation details

    def __str__(self):
        return f"Details for {self.destination.title}"


class Itinerary(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='itineraries')
    day_number = models.PositiveIntegerField()
    title = models.CharField(max_length=200, blank=True)
    description = models.TextField()
    image = models.ImageField(upload_to='itineraries/', null=True, blank=True)
    meal_included = models.BooleanField(default=False)
    meal_description = models.CharField(max_length=255, blank=True)

    class Meta:
        ordering = ['day_number']

    def __str__(self):
        return f"Day {self.day_number} - {self.title}"


class TripBatch(models.Model):
    destination = models.ForeignKey(Destination, on_delete=models.CASCADE, related_name='trip_batches')
    start_date = models.DateField()
    end_date = models.DateField()
    price_per_person = models.DecimalField(max_digits=10, decimal_places=2)
    total_rooms = models.PositiveIntegerField()
    rooms_booked = models.PositiveIntegerField(default=0)

    @property
    def rooms_available(self):
        return self.total_rooms - self.rooms_booked

    @property
    def is_sold_out(self):
        return self.rooms_available <= 0

    def __str__(self):
        return f"{self.destination.title} Trip ({self.start_date} to {self.end_date})"