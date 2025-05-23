from rest_framework import serializers
from django.utils import timezone
from .models import (
    ExperienceCategory, Experience, ExperienceImage,
    ExperienceSession
)
from apps.locations.models import Location, TourGuide, LocationDetails
from apps.experiences.models import *
from apps.itineraries.serializers import *
from apps.itineraries.serializers import *
from apps.locations.serializers import *


class ExperienceImageSerializer(serializers.ModelSerializer):
    """Serializer for experience images"""

    class Meta:
        model = ExperienceImage
        fields = [
            'id', 'image', 'alt_text', 'order', 'is_primary'
        ]


class ExperienceSessionSerializer(serializers.ModelSerializer):
    """Serializer for experience sessions"""
    guide_details = TourGuideSerializer(source='guide', read_only=True)
    duration_display = serializers.SerializerMethodField()
    spots_left = serializers.ReadOnlyField()
    max_participants = serializers.ReadOnlyField()
    price_in_sats = serializers.ReadOnlyField()
    price_in_currency = serializers.ReadOnlyField()

    class Meta:
        model = ExperienceSession
        fields = [
            'id', 'date', 'start_time', 'end_time', 'guide', 'guide_details',
            'max_bookings', 'price_override_sats', 'price_override_currency',
            'is_active', 'is_fully_booked', 'bookings_count', 'weather_notes',
            'notes', 'duration_display', 'spots_left', 'max_participants',
            'price_in_sats', 'price_in_currency'
        ]
        read_only_fields = ['is_fully_booked', 'bookings_count']

    def get_duration_display(self, obj):
        """Get formatted duration from parent experience"""
        if obj.experience:
            return obj.experience.duration_display
        return ""


class ExperienceCategorySerializer(serializers.ModelSerializer):
    """Serializer for experience categories"""

    class Meta:
        model = ExperienceCategory
        fields = [
            'id', 'name', 'slug', 'description', 'image',
            'order', 'is_featured', 'meta_title', 'meta_description',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['slug', 'created_at', 'updated_at']




class ExperienceAllInOneSerializer(serializers.ModelSerializer):
    """
    Comprehensive serializer that includes everything needed for frontend.
    This serializer provides all related data in a single API call.
    """
    # Category information
    categories = ExperienceCategorySerializer(many=True, read_only=True)
    category_names = serializers.SerializerMethodField()

    # Location information
    location_details = LocationSerializer(source='location', read_only=True)
    location_name = serializers.CharField(source='location.name', read_only=True)
    location_coordinates = serializers.SerializerMethodField()
    additional_location_details = LocationDetailsSerializer(source='location_details', read_only=True)

    # Guide information
    guide_details = TourGuideSerializer(source='guide', read_only=True)
    guide_name = serializers.CharField(source='guide.name', read_only=True)
    guide_avatar = serializers.SerializerMethodField()

    # Images
    all_images = ExperienceImageSerializer(
        source='experienceimage_set',
        many=True,
        read_only=True
    )
    primary_image = serializers.SerializerMethodField()
    image_gallery = serializers.SerializerMethodField()

    # Duration and time information
    duration_display = serializers.ReadOnlyField()
    duration_summary = serializers.SerializerMethodField()

    # Sessions and availability
    all_sessions = ExperienceSessionSerializer(
        source='experiencesession_set',
        many=True,
        read_only=True
    )
    upcoming_sessions = serializers.SerializerMethodField()
    next_available_session = serializers.SerializerMethodField()
    availability_summary = serializers.SerializerMethodField()

    # Trip batches for multi-day experiences
    trip_batches = TripBatchSerializer(many=True, read_only=True)
    upcoming_trip_batches = serializers.SerializerMethodField()
    next_available_batch = serializers.SerializerMethodField()

    # Accommodations
    accommodations = AccommodationSerializer(many=True, read_only=True)

    # Included/Not Included items
    included_items = IncludedItemSerializer(many=True, read_only=True)
    not_included_items = NotIncludedItemSerializer(many=True, read_only=True)
    inclusion_summary = serializers.SerializerMethodField()

    # Recommendations and reviews
    recommendations = RecommendationSerializer(many=True, read_only=True)

    # Historical information
    histories = HistoricalInfoSerializer(many=True, read_only=True)
    historical_summary = serializers.SerializerMethodField()

    # Map and content details
    map_details = MapAndContentSerializer(read_only=True)

    # Itinerary for multi-day experiences
    itineraries = ItinerarySerializer(many=True, read_only=True)
    itinerary_summary = serializers.SerializerMethodField()

    # Pricing information
    pricing_info = serializers.SerializerMethodField()

    # Booking information
    booking_requirements = serializers.SerializerMethodField()

    # SEO and metadata
    seo_data = serializers.SerializerMethodField()

    # Statistics
    stats = serializers.SerializerMethodField()

    # Experience type classification
    experience_type = serializers.SerializerMethodField()

    class Meta:
        model = Experience
        fields = [
            # Basic info
            'id', 'name', 'slug', 'short_description', 'description',

            # Categories
            'categories', 'category_names',

            # Location
            'location', 'location_details', 'location_name', 'location_coordinates',
            'place_name', 'additional_location_details',

            # Guide
            'guide', 'guide_details', 'guide_name', 'guide_avatar',

            # Duration
            'duration_minutes', 'duration_days', 'duration_nights',
            'duration_display', 'duration_summary',

            # Participants
            'max_participants', 'min_participants', 'difficulty',

            # Requirements
            'what_to_bring', 'min_age', 'accessibility_notes', 'requirements',
            'booking_requirements',

            # Pricing
            'price_in_sats', 'price_in_currency', 'base_price_per_person',
            'currency', 'pricing_info',

            # Status
            'is_active', 'is_featured', 'is_purchasable', 'is_reverse_season',
            'season_note',

            # Images
            'main_image', 'all_images', 'primary_image', 'image_gallery',

            # Content
            'historical_content', 'histories', 'historical_summary',

            # Sessions and batches
            'all_sessions', 'upcoming_sessions', 'next_available_session',
            'availability_summary', 'trip_batches', 'upcoming_trip_batches',
            'next_available_batch',

            # Accommodations and inclusions
            'accommodations', 'included_items', 'not_included_items',
            'inclusion_summary',

            # Recommendations
            'recommendations',

            # Map and itinerary
            'map_details', 'itineraries', 'itinerary_summary',

            # Metadata
            'created_at', 'updated_at', 'meta_title', 'meta_description',
            'seo_data',

            # Statistics and classification
            'stats', 'experience_type'
        ]

    def get_category_names(self, obj):
        """Get list of category names"""
        return [cat.name for cat in obj.categories.all()]

    def get_location_coordinates(self, obj):
        """Get location coordinates if available"""
        if obj.location and obj.location.latitude and obj.location.longitude:
            return {
                'latitude': float(obj.location.latitude),
                'longitude': float(obj.location.longitude)
            }
        return None

    def get_guide_avatar(self, obj):
        """Get guide avatar URL"""
        if obj.guide and obj.guide.image:
            return obj.guide.image.url
        return None

    def get_primary_image(self, obj):
        """Get primary image with full details"""
        if obj.main_image:
            return {
                'url': obj.main_image.url,
                'alt_text': f"{obj.name} main image",
                'is_main': True
            }

        primary_img = obj.experienceimage_set.filter(is_primary=True).first()
        if primary_img:
            return ExperienceImageSerializer(primary_img).data

        first_img = obj.experienceimage_set.first()
        if first_img:
            return ExperienceImageSerializer(first_img).data

        return None

    def get_image_gallery(self, obj):
        """Get organized image gallery"""
        images = obj.experienceimage_set.all().order_by('order')
        gallery = []

        # Add main image first if it exists
        if obj.main_image:
            gallery.append({
                'url': obj.main_image.url,
                'alt_text': f"{obj.name} main image",
                'is_main': True,
                'order': -1
            })

        # Add other images
        for img in images:
            gallery.append(ExperienceImageSerializer(img).data)

        return gallery

    def get_duration_summary(self, obj):
        """Get comprehensive duration information"""
        summary = {
            'minutes': obj.duration_minutes,
            'display': obj.duration_display,
            'hours': obj.duration_minutes // 60 if obj.duration_minutes >= 60 else 0,
            'remaining_minutes': obj.duration_minutes % 60
        }

        if obj.duration_days:
            summary['days'] = obj.duration_days
        if obj.duration_nights:
            summary['nights'] = obj.duration_nights

        return summary

    def get_upcoming_sessions(self, obj):
        """Get upcoming sessions (next 30 days)"""
        upcoming = obj.experiencesession_set.filter(
            date__gte=timezone.now().date(),
            date__lte=timezone.now().date() + timezone.timedelta(days=30),
            is_active=True
        ).order_by('date', 'start_time')

        return ExperienceSessionSerializer(upcoming, many=True).data

    def get_next_available_session(self, obj):
        """Get next available session with full details"""
        next_session = obj.experiencesession_set.filter(
            date__gte=timezone.now().date(),
            is_active=True,
            is_fully_booked=False
        ).order_by('date', 'start_time').first()

        if next_session:
            return ExperienceSessionSerializer(next_session).data
        return None

    def get_upcoming_trip_batches(self, obj):
        """Get upcoming trip batches"""
        upcoming = obj.trip_batches.filter(
            start_date__gte=timezone.now().date(),
            is_active=True
        ).order_by('start_date')

        return TripBatchSerializer(upcoming, many=True).data

    def get_next_available_batch(self, obj):
        """Get next available trip batch"""
        next_batch = obj.trip_batches.filter(
            start_date__gte=timezone.now().date(),
            is_active=True
        ).exclude(is_sold_out=True).order_by('start_date').first()

        if next_batch:
            return TripBatchSerializer(next_batch).data
        return None

    def get_availability_summary(self, obj):
        """Get comprehensive availability summary"""
        # Session-based availability
        total_upcoming_sessions = obj.experiencesession_set.filter(
            date__gte=timezone.now().date(),
            is_active=True
        ).count()

        available_sessions = obj.experiencesession_set.filter(
            date__gte=timezone.now().date(),
            is_active=True,
            is_fully_booked=False
        ).count()

        # Batch-based availability
        total_upcoming_batches = obj.trip_batches.filter(
            start_date__gte=timezone.now().date(),
            is_active=True
        ).count()

        available_batches = obj.trip_batches.filter(
            start_date__gte=timezone.now().date(),
            is_active=True
        ).exclude(slots_available__lte=0).count()

        return {
            'total_upcoming_sessions': total_upcoming_sessions,
            'available_sessions': available_sessions,
            'total_upcoming_batches': total_upcoming_batches,
            'available_batches': available_batches,
            'is_bookable': (available_sessions > 0 or available_batches > 0) and obj.is_purchasable,
            'booking_type': self.get_experience_type(obj)['booking_type'],
            'next_available_date': self._get_next_available_date(obj)
        }

    def _get_next_available_date(self, obj):
        """Helper to get next available date across sessions and batches"""
        next_session = self.get_next_available_session(obj)
        next_batch = self.get_next_available_batch(obj)

        dates = []
        if next_session:
            dates.append(next_session['date'])
        if next_batch:
            dates.append(next_batch['start_date'])

        return min(dates) if dates else None

    def get_inclusion_summary(self, obj):
        """Get summary of included and not included items"""
        return {
            'included_count': obj.included_items.count(),
            'not_included_count': obj.not_included_items.count(),
            'included_items': [item.text for item in obj.included_items.all()],
            'not_included_items': [item.text for item in obj.not_included_items.all()]
        }

    def get_historical_summary(self, obj):
        """Get historical information summary"""
        histories = obj.histories.all()
        return {
            'has_historical_content': bool(obj.historical_content or histories.exists()),
            'historical_sections_count': histories.count(),
            'main_historical_content': obj.historical_content
        }

    def get_itinerary_summary(self, obj):
        """Get itinerary summary"""
        itineraries = obj.itineraries.all().order_by('day_number')
        return {
            'total_days': itineraries.count(),
            'has_meals': itineraries.filter(meal_included=True).exists(),
            'has_accommodation': itineraries.filter(accommodation_included=True).exists(),
            'day_titles': [itinerary.title for itinerary in itineraries if itinerary.title]
        }

    def get_pricing_info(self, obj):
        """Get comprehensive pricing information"""
        pricing = {
            'satoshis': obj.price_in_sats,
            'currency_amount': float(obj.price_in_currency) if obj.price_in_currency else None,
            'currency_code': obj.currency,
            'base_price_per_person': float(obj.base_price_per_person),
            'formatted_sats': f"{obj.price_in_sats:,} sats",
            'formatted_currency': f"{obj.currency} {obj.price_in_currency}" if obj.price_in_currency else None
        }

        # Add batch pricing if available
        batches = obj.trip_batches.filter(start_date__gte=timezone.now().date(), is_active=True)
        if batches.exists():
            batch_prices = []
            for batch in batches:
                if batch.price_in_sats or batch.price_in_currency:
                    batch_prices.append({
                        'start_date': batch.start_date,
                        'sats': batch.price_in_sats,
                        'currency': float(batch.price_in_currency) if batch.price_in_currency else None,
                        'per_person': float(batch.price_per_person) if batch.price_per_person else None
                    })
            pricing['batch_pricing'] = batch_prices

        return pricing

    def get_booking_requirements(self, obj):
        """Get all booking requirements in one place"""
        return {
            'min_age': obj.min_age,
            'min_participants': obj.min_participants,
            'max_participants': obj.max_participants,
            'difficulty': obj.difficulty,
            'what_to_bring': obj.what_to_bring,
            'requirements': obj.requirements,
            'accessibility_notes': obj.accessibility_notes,
            'is_purchasable': obj.is_purchasable,
            'has_accommodations': obj.accommodations.exists()
        }

    def get_experience_type(self, obj):
        """Classify experience type based on available data"""
        has_sessions = obj.experiencesession_set.exists()
        has_batches = obj.trip_batches.exists()
        has_itinerary = obj.itineraries.exists()
        has_accommodations = obj.accommodations.exists()
        is_multi_day = obj.duration_days and obj.duration_days > 1

        if has_batches and (is_multi_day or has_itinerary):
            experience_type = 'multi_day_trip'
            booking_type = 'batch'
        elif has_sessions and not is_multi_day:
            experience_type = 'single_day_experience'
            booking_type = 'session'
        elif is_multi_day:
            experience_type = 'multi_day_experience'
            booking_type = 'batch' if has_batches else 'session'
        else:
            experience_type = 'standard_experience'
            booking_type = 'session' if has_sessions else 'direct'

        return {
            'type': experience_type,
            'booking_type': booking_type,
            'is_multi_day': is_multi_day,
            'has_itinerary': has_itinerary,
            'has_accommodations': has_accommodations
        }

    def get_seo_data(self, obj):
        """Get SEO metadata"""
        return {
            'title': obj.meta_title or obj.name,
            'description': obj.meta_description or obj.short_description,
            'slug': obj.slug,
            'canonical_url': f"/experiences/{obj.slug}/",
            'og_image': self.get_primary_image(obj)['url'] if self.get_primary_image(obj) else None
        }

    def get_stats(self, obj):
        """Get experience statistics"""
        total_sessions = obj.experiencesession_set.count()
        active_sessions = obj.experiencesession_set.filter(is_active=True).count()
        total_batches = obj.trip_batches.count()
        active_batches = obj.trip_batches.filter(is_active=True).count()

        return {
            'total_sessions': total_sessions,
            'active_sessions': active_sessions,
            'total_batches': total_batches,
            'active_batches': active_batches,
            'total_images': obj.experienceimage_set.count(),
            'categories_count': obj.categories.count(),
            'accommodations_count': obj.accommodations.count(),
            'included_items_count': obj.included_items.count(),
            'recommendations_count': obj.recommendations.count(),
            'itinerary_days': obj.itineraries.count(),
            'created_days_ago': (timezone.now().date() - obj.created_at.date()).days,
            'last_updated_days_ago': (timezone.now().date() - obj.updated_at.date()).days
        }


    def get_next_available_session(self, obj):
        """Get next available session with full details"""
        next_session = obj.experiencesession_set.filter(
            date__gte=timezone.now().date(),
            is_active=True,
            is_fully_booked=False
        ).order_by('date', 'start_time').first()

        if next_session:
            return ExperienceSessionSerializer(next_session).data
        return None

    def get_availability_summary(self, obj):
        """Get availability summary"""
        total_upcoming = obj.experiencesession_set.filter(
            date__gte=timezone.now().date(),
            is_active=True
        ).count()

        available_upcoming = obj.experiencesession_set.filter(
            date__gte=timezone.now().date(),
            is_active=True,
            is_fully_booked=False
        ).count()

        return {
            'total_upcoming_sessions': total_upcoming,
            'available_sessions': available_upcoming,
            'is_bookable': available_upcoming > 0 and obj.is_purchasable,
            'next_available_date': self.get_next_available_session(obj)['date'] if self.get_next_available_session(
                obj) else None
        }

    def get_pricing_info(self, obj):
        """Get comprehensive pricing information"""
        return {
            'satoshis': obj.price_in_sats,
            'currency_amount': float(obj.price_in_currency) if obj.price_in_currency else None,
            'currency_code': obj.currency,
            'base_price_per_person': float(obj.base_price_per_person),
            'formatted_sats': f"{obj.price_in_sats:,} sats",
            'formatted_currency': f"{obj.currency} {obj.price_in_currency}" if obj.price_in_currency else None
        }

    def get_booking_requirements(self, obj):
        """Get all booking requirements in one place"""
        return {
            'min_age': obj.min_age,
            'min_participants': obj.min_participants,
            'max_participants': obj.max_participants,
            'difficulty': obj.difficulty,
            'what_to_bring': obj.what_to_bring,
            'requirements': obj.requirements,
            'accessibility_notes': obj.accessibility_notes,
            'is_purchasable': obj.is_purchasable
        }

    def get_seo_data(self, obj):
        """Get SEO metadata"""
        return {
            'title': obj.meta_title or obj.name,
            'description': obj.meta_description or obj.short_description,
            'slug': obj.slug,
            'canonical_url': f"/experiences/{obj.slug}/",
            'og_image': self.get_primary_image(obj)['url'] if self.get_primary_image(obj) else None
        }

    def get_stats(self, obj):
        """Get experience statistics"""
        total_sessions = obj.experiencesession_set.count()
        active_sessions = obj.experiencesession_set.filter(is_active=True).count()

        return {
            'total_sessions': total_sessions,
            'active_sessions': active_sessions,
            'total_images': obj.experienceimage_set.count(),
            'categories_count': obj.categories.count(),
            'created_days_ago': (timezone.now().date() - obj.created_at.date()).days,
            'last_updated_days_ago': (timezone.now().date() - obj.updated_at.date()).days
        }