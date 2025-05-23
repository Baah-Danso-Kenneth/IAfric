from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from apps.lightningPayments.models import LightningPayment
from apps.locations.models import Location, TourGuide
import uuid


class ExperienceCategory(models.Model):
    """Categories for tourism experiences (e.g., Adventure, Cultural, Food Tours)"""
    name = models.CharField(max_length=255, unique=True)
    slug = models.SlugField(max_length=255, unique=True, blank=True)
    description = models.TextField(blank=True)
    image = models.ImageField(upload_to="experiences/categories/", blank=True, null=True)

    # For filtering and display ordering
    order = models.PositiveIntegerField(default=0)
    is_featured = models.BooleanField(default=False)

    # SEO fields
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name_plural = "Experience Categories"
        ordering = ['order', 'name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if not self.meta_title:
            self.meta_title = self.name
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class Experience(models.Model):
    """Tourism experience/activity that can be booked"""
    DIFFICULTY_CHOICES = [
        ('easy', 'Easy - Suitable for all'),
        ('moderate', 'Moderate - Some physical activity'),
        ('challenging', 'Challenging - Requires good fitness'),
        ('expert', 'Expert - Advanced skills required')
    ]

    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, blank=True)

    # Basic details
    short_description = models.TextField(help_text="Brief summary for listings")
    description = models.TextField()
    category = models.ForeignKey(ExperienceCategory, on_delete=models.PROTECT,default=1)
    location = models.ManyToManyField(Location)
    place_name = models.CharField(max_length=200, null=True, blank=True)  

    # Key experience attributes
    duration_minutes = models.PositiveIntegerField(help_text="Duration in minutes")
    # Keep original duration fields for backward compatibility
    duration_days = models.PositiveIntegerField(null=True, blank=True)  # From first code
    duration_nights = models.PositiveIntegerField(null=True, blank=True)  # From first code

    max_participants = models.PositiveIntegerField(default=10)
    min_participants = models.PositiveIntegerField(default=1)
    difficulty = models.CharField(max_length=12, choices=DIFFICULTY_CHOICES, default='easy')

    # From first code: these are now handled by IncludedItem and NotIncludedItem models
    # included_items = models.TextField(blank=True, help_text="What's included in the experience")
    what_to_bring = models.TextField(blank=True, help_text="What participants should bring")

    # Requirements and restrictions
    min_age = models.PositiveIntegerField(default=0, help_text="Minimum age requirement (0 for no restriction)")
    accessibility_notes = models.TextField(blank=True, help_text="Accessibility information")
    requirements = models.TextField(blank=True, help_text="Special requirements for participants")

    # Pricing (support for both satoshis and traditional currency)
    price_in_sats = models.PositiveIntegerField(validators=[MinValueValidator(1)])
    price_in_currency = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    base_price_per_person = models.DecimalField(max_digits=10, decimal_places=2, default=0.00)  # From first code
    currency = models.CharField(max_length=3, default="USD")

    # Status fields
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    is_purchasable = models.BooleanField(default=True)
    is_reverse_season = models.BooleanField(default=False)  # From first code
    season_note = models.TextField(blank=True, null=True)  # From first code

    # Main image
    main_image = models.ImageField(upload_to='experiences/backdrop/', null=True, blank=True)  # From first code

    # Historical/cultural information
    historical_content = models.TextField(blank=True, null=True)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # SEO
    meta_title = models.CharField(max_length=255, blank=True)
    meta_description = models.TextField(blank=True)

    class Meta:
        ordering = ['-is_featured', 'name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_active', 'price_in_sats']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        if not self.meta_title:
            self.meta_title = self.name
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    @property
    def duration_display(self):
        """Format duration in human-readable format (e.g., '2 hours 30 minutes')"""
        hours, minutes = divmod(self.duration_minutes, 60)
        if hours and minutes:
            return f"{hours} hour{'s' if hours != 1 else ''} {minutes} minute{'s' if minutes != 1 else ''}"
        elif hours:
            return f"{hours} hour{'s' if hours != 1 else ''}"
        else:
            return f"{minutes} minute{'s' if minutes != 1 else ''}"

    @property
    def available_guides(self):
        return TourGuide.objects.filter(location__in=self.location.all()).distinct()

    def available_dates(self, start_date=None, days_ahead=30):
        """Get available dates for this experience"""
        if not start_date:
            start_date = timezone.now().date()

        # Get all scheduled sessions in date range
        end_date = start_date + timezone.timedelta(days=days_ahead)
        scheduled_sessions = self.sessions.filter(
            date__gte=start_date,
            date__lte=end_date,
            is_active=True
        )

        # Return sessions with availability
        return scheduled_sessions.filter(
            models.Q(max_bookings__isnull=True) |
            models.Q(bookings_count__lt=models.F('max_bookings'))
        )

class ExperienceImage(models.Model):
    """Images for experiences"""
    experience = models.ForeignKey(Experience,  on_delete=models.CASCADE)
    image = models.ImageField(upload_to="experiences/images/")
    alt_text = models.CharField(max_length=255, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_primary = models.BooleanField(default=False)

    class Meta:
        ordering = ['order']
        constraints = [
            models.UniqueConstraint(
                fields=['experience'],
                condition=models.Q(is_primary=True),
                name='unique_primary_experience_image'
            )
        ]

    def __str__(self):
        return f"Image {self.order} for {self.experience.name}"

    def save(self, *args, **kwargs):
        # If this is marked as primary, unmark others
        if self.is_primary:
            ExperienceImage.objects.filter(
                experience=self.experience,
                is_primary=True
            ).exclude(pk=self.pk).update(is_primary=False)
        super().save(*args, **kwargs)



class ExperienceSession(models.Model):
    """Sessions for experiences (e.g., specific dates/times)"""
    experience = models.ForeignKey(Experience, on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField(null=True, blank=True)

    # Tour guide assignment (optional override)
    guide = models.ForeignKey(TourGuide, on_delete=models.SET_NULL, null=True, blank=True)

    # Override experience defaults if needed
    max_bookings = models.PositiveIntegerField(null=True, blank=True,
                                               help_text="Leave blank to use experience default")
    price_override_sats = models.PositiveIntegerField(null=True, blank=True,
                                                      help_text="Special price for this session in satoshis")
    price_override_currency = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True,
                                                  help_text="Special price for this session in currency")

    # Session status
    is_active = models.BooleanField(default=True)
    is_fully_booked = models.BooleanField(default=False)
    bookings_count = models.PositiveIntegerField(default=0,
                                                 help_text="Number of current bookings")

    # Weather info (can be updated closer to date)
    weather_notes = models.CharField(max_length=255, blank=True)

    notes = models.TextField(blank=True, help_text="Special notes for this session")

    class Meta:
        ordering = ['date', 'start_time']
        indexes = [
            models.Index(fields=['experience', 'date']),
            models.Index(fields=['is_active', 'is_fully_booked']),
        ]

    def __str__(self):
        return f"{self.experience.name} - {self.date} at {self.start_time}"

    def save(self, *args, **kwargs):
        # If end_time is not set, calculate based on experience duration
        if not self.end_time and self.experience:
            duration = timezone.timedelta(minutes=self.experience.duration_minutes)
            datetime_start = timezone.datetime.combine(
                timezone.datetime.today(), self.start_time
            )
            datetime_end = datetime_start + duration
            self.end_time = datetime_end.time()

        # Calculate if fully booked
        if self.max_bookings is not None:
            self.is_fully_booked = self.bookings_count >= self.max_bookings
        elif self.experience and self.experience.max_participants:
            self.is_fully_booked = self.bookings_count >= self.experience.max_participants

        super().save(*args, **kwargs)

    @property
    def max_participants(self):
        """Get maximum participants for this session"""
        if self.max_bookings is not None:
            return self.max_bookings
        return self.experience.max_participants if self.experience else 0

    @property
    def spots_left(self):
        """Calculate remaining spots"""
        max_spots = self.max_participants
        if max_spots:
            return max(0, max_spots - self.bookings_count)
        return None  # Unlimited

    @property
    def price_in_sats(self):
        """Get satoshi price for this session"""
        if self.price_override_sats is not None:
            return self.price_override_sats
        return self.experience.price_in_sats if self.experience else 0

    @property
    def price_in_currency(self):
        """Get currency price for this session"""
        if self.price_override_currency is not None:
            return self.price_override_currency
        return self.experience.price_in_currency if self.experience else 0