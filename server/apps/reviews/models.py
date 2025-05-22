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
from apps.experiences.models import Experience
from apps.locations.models import TourGuide

class Review(models.Model):
    booking = models.OneToOneField('apps_bookings.Booking', on_delete=models.CASCADE, related_name='review')
    rating = models.PositiveSmallIntegerField(validators=[MinValueValidator(1)])
    comment = models.TextField()

    guide_rating = models.PositiveSmallIntegerField(null=True, blank=True)
    value_rating = models.PositiveSmallIntegerField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    is_approved = models.BooleanField(default=False)
    is_featured = models.BooleanField(default=False)

    def __str__(self):
        experience = self.booking.experience
        if experience:
            return f"Review for {experience.name} by {self.booking.contact_name}"
        return f"Review by {self.booking.contact_name}"


class TripBatch(models.Model):
    """Batch of trips for multi-day experiences"""
    experience = models.ForeignKey(Experience, on_delete=models.CASCADE, related_name='trip_batches')
    start_date = models.DateField()
    end_date = models.DateField()

    # Price may be different for specific batch
    price_in_sats = models.PositiveIntegerField(null=True, blank=True)
    price_in_currency = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    price_per_person = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)  # From first code

    total_slots = models.PositiveIntegerField(help_text="Total available slots for this trip")
    slots_booked = models.PositiveIntegerField(default=0)

    # For accommodation-based trips
    total_rooms = models.PositiveIntegerField(default=0)
    rooms_booked = models.PositiveIntegerField(default=0)

    # Status
    is_active = models.BooleanField(default=True)
    notes = models.TextField(blank=True)

    guide = models.ForeignKey(TourGuide, on_delete=models.SET_NULL, null=True, blank=True)

    class Meta:
        verbose_name_plural = "Trip Batches"
        ordering = ['start_date']

    @property
    def slots_available(self):
        return self.total_slots - self.slots_booked

    @property
    def rooms_available(self):
        return self.total_rooms - self.rooms_booked

    @property
    def is_sold_out(self):
        return self.slots_available <= 0 or self.rooms_available <= 0

    @property
    def duration_days(self):
        if self.start_date and self.end_date:
            delta = self.end_date - self.start_date
            return delta.days + 1
        return None

    def __str__(self):
        return f"{self.experience.name} ({self.start_date} to {self.end_date})"