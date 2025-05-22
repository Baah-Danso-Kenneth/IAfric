from django.db import models
from django.utils.text import slugify
from django.core.validators import MinValueValidator
from django.conf import settings
from django.utils import timezone
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
from apps.lightningPayments.models import LightningPayment
from apps.experiences.models import ExperienceSession
import uuid



class Booking(models.Model):
    """Bookings for experience sessions or trip batches"""
    BOOKING_STATUS = [
        ('pending', 'Pending Payment'),
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
        ('completed', 'Completed'),
        ('no_show', 'No Show'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name='bookings',
                             on_delete=models.CASCADE)

    # Link to either a session or trip batch (but not both)
    session = models.ForeignKey(ExperienceSession, related_name='bookings',
                                on_delete=models.PROTECT, null=True, blank=True)
    trip_batch = models.ForeignKey('apps_reviews.TripBatch', related_name='bookings',
                                   on_delete=models.PROTECT, null=True, blank=True)

    # Booking details
    num_participants = models.PositiveIntegerField(default=1)
    booking_number = models.CharField(max_length=20, unique=True)
    status = models.CharField(max_length=10, choices=BOOKING_STATUS, default='pending')

    # Customer details
    contact_name = models.CharField(max_length=255)
    contact_email = models.EmailField()
    contact_phone = models.CharField(max_length=50, blank=True)
    special_requests = models.TextField(blank=True)

    # Payment details
    price_paid_sats = models.PositiveIntegerField(null=True, blank=True)
    price_paid_currency = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=3, default="USD")

    # Payment relationship
    payment = models.ForeignKey(LightningPayment, on_delete=models.SET_NULL,
                                null=True, blank=True,
                                related_name='bookings')

    # Other payment types as needed
    payment_method = models.CharField(max_length=50, blank=True,
                                      help_text="Type of payment (lightning, card, etc)")

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    cancelled_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['session', 'status']),
            models.Index(fields=['trip_batch', 'status']),
            models.Index(fields=['booking_number']),
        ]
        constraints = [
            models.CheckConstraint(
                check=(
                        models.Q(session__isnull=False, trip_batch__isnull=True) |
                        models.Q(session__isnull=True, trip_batch__isnull=False)
                ),
                name='booking_session_or_trip_batch'
            )
        ]

    def save(self, *args, **kwargs):
        # Generate booking number if not exists
        if not self.booking_number:
            today = timezone.now()
            prefix = f"BK{today.strftime('%y%m%d')}"
            random_suffix = uuid.uuid4().hex[:6].upper()
            self.booking_number = f"{prefix}-{random_suffix}"

        # If this is a new booking and status is changing to confirmed,
        # update session or trip batch booking count
        if self.pk is None and self.status == 'confirmed':
            if self.session:
                session = self.session
                session.bookings_count = models.F('bookings_count') + self.num_participants
                session.save(update_fields=['bookings_count'])
            elif self.trip_batch:
                batch = self.trip_batch
                batch.slots_booked = models.F('slots_booked') + self.num_participants
                # Assuming each booking gets one room in a trip
                batch.rooms_booked = models.F('rooms_booked') + 1
                batch.save(update_fields=['slots_booked', 'rooms_booked'])

        super().save(*args, **kwargs)

    def __str__(self):
        return f"Booking {self.booking_number} - {self.contact_name}"

    def confirm_payment(self, payment):
        """Confirm a booking based on a successful payment"""
        if self.status != 'pending':
            return False

        # Update payment details
        self.status = 'confirmed'
        self.payment = payment

        if isinstance(payment, LightningPayment):
            self.price_paid_sats = payment.amount
            self.price_paid_currency = payment.fiat_amount
            self.currency = payment.fiat_currency
            self.payment_method = 'lightning'

        self.save()

        # Update session or trip batch booking count
        if self.session:
            session = self.session
            session.bookings_count = models.F('bookings_count') + self.num_participants
            session.save(update_fields=['bookings_count'])
        elif self.trip_batch:
            batch = self.trip_batch
            batch.slots_booked = models.F('slots_booked') + self.num_participants
            batch.rooms_booked = models.F('rooms_booked') + 1
            batch.save(update_fields=['slots_booked', 'rooms_booked'])

        return True

    def cancel(self, by_user=False):
        """Cancel this booking"""
        if self.status not in ('pending', 'confirmed'):
            return False

        old_status = self.status
        self.status = 'cancelled'
        self.cancelled_at = timezone.now()
        self.save(update_fields=['status', 'cancelled_at'])

        # If it was confirmed, decrease booking count
        if old_status == 'confirmed':
            if self.session:
                session = self.session
                session.bookings_count = models.F('bookings_count') - self.num_participants
                session.save(update_fields=['bookings_count'])
            elif self.trip_batch:
                batch = self.trip_batch
                batch.slots_booked = models.F('slots_booked') - self.num_participants
                batch.rooms_booked = models.F('rooms_booked') - 1
                batch.save(update_fields=['slots_booked', 'rooms_booked'])

        # Trigger refund process for lightning payments
        if by_user and self.payment and isinstance(self.payment, LightningPayment) and self.payment.status == 'paid':
            self.payment.mark_as_refunded()

        return True

    def create_lightning_invoice(self, expiry_minutes=60):
        """Create a lightning invoice for this booking"""
        # First, ensure we don't already have a pending payment
        if self.payment and self.payment.status == 'pending':
            return self.payment

        # Calculate amount in satoshis
        amount_sats = self.total_price_sats
        if not amount_sats:
            return None

        # Expiry time
        expires_at = timezone.now() + timezone.timedelta(minutes=expiry_minutes)

        # Create payment record
        payment = LightningPayment.objects.create(
            user=self.user,
            amount=amount_sats,
            fiat_amount=self.total_price_currency,
            fiat_currency=self.currency,
            expires_at=expires_at,
            # Other fields will be populated by payment processor
            invoice_id=f"booking_{self.booking_number}_{uuid.uuid4().hex[:8]}"
        )

        # Link payment to booking
        self.payment = payment
        self.save(update_fields=['payment'])

        # Here you would integrate with your Lightning payment processor
        # to generate the actual invoice and update the payment record

        return payment


@property
def booked_item(self):
    """Return the session or trip batch that was booked"""
    return self.session or self.trip_batch


@property
def experience(self):
    """Return the experience related to this booking"""
    if self.session:
        return self.session.experience
    elif self.trip_batch:
        return self.trip_batch.experience
    return None