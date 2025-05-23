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

    category = ExperienceCategorySerializer( read_only=True)
    location = LocationSerializer(many=True)

    class Meta:
        model = Experience
        fields = [
            "id",
            "slug",
            "name",
            "place_name",
            "description",
            "short_description",
            "category",
            "location"
        ]

