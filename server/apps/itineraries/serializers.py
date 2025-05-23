from rest_framework import serializers

from .models import (
Accommodation, Itinerary, IncludedItem,
NotIncludedItem, Recommendation, HistoricalInfo, MapAndContent
)
from apps.locations.models import TourGuide
from apps.reviews.models import TripBatch

class TourGuideSerializer(serializers.ModelSerializer):
    """Serializer for tour guides"""
    experience_count = serializers.SerializerMethodField()

    class Meta:
        model = TourGuide
        fields = [
            'id', 'name', 'slug', 'bio', 'image', 'email', 'phone',
            'website', 'instagram', 'languages', 'specialties',
            'years_experience', 'experience_count', 'created_at', 'updated_at'
        ]

    def get_experience_count(self, obj):
        return obj.experiences.filter(is_active=True).count()



class AccommodationSerializer(serializers.ModelSerializer):
    """Serializer for accommodations"""

    class Meta:
        model = Accommodation
        fields = ['id', 'name', 'description', 'location', 'image']


class IncludedItemSerializer(serializers.ModelSerializer):
    """Serializer for included items"""

    class Meta:
        model = IncludedItem
        fields = ['id', 'text']


class NotIncludedItemSerializer(serializers.ModelSerializer):
    """Serializer for not included items"""

    class Meta:
        model = NotIncludedItem
        fields = ['id', 'text']


class RecommendationSerializer(serializers.ModelSerializer):
    """Serializer for recommendations"""

    class Meta:
        model = Recommendation
        fields = ['id', 'person_name', 'message']


class HistoricalInfoSerializer(serializers.ModelSerializer):
    """Serializer for historical information"""

    class Meta:
        model = HistoricalInfo
        fields = ['id', 'content']


class MapAndContentSerializer(serializers.ModelSerializer):
    """Serializer for map and content details"""

    class Meta:
        model = MapAndContent
        fields = [
            'region_map', 'best_time_title', 'best_time_des',
            'weather_title', 'weather_time_des'
        ]


class ItinerarySerializer(serializers.ModelSerializer):
    """Serializer for itineraries"""

    class Meta:
        model = Itinerary
        fields = [
            'id', 'day_number', 'title', 'description', 'image',
            'meal_included', 'meal_description', 'accommodation_included',
            'accommodation_details'
        ]


class TripBatchSerializer(serializers.ModelSerializer):
    """Serializer for trip batches"""
    guide_details = TourGuideSerializer(source='guide', read_only=True)
    slots_available = serializers.ReadOnlyField()
    rooms_available = serializers.ReadOnlyField()
    is_sold_out = serializers.ReadOnlyField()
    duration_days = serializers.ReadOnlyField()
    booking_status = serializers.SerializerMethodField()

    class Meta:
        model = TripBatch
        fields = [
            'id', 'start_date', 'end_date', 'price_in_sats', 'price_in_currency',
            'price_per_person', 'total_slots', 'slots_booked', 'slots_available',
            'total_rooms', 'rooms_booked', 'rooms_available', 'is_active',
            'notes', 'guide', 'guide_details', 'is_sold_out', 'duration_days',
            'booking_status'
        ]

    def get_booking_status(self, obj):
        """Get booking status information"""
        if obj.is_sold_out:
            return 'sold_out'
        elif obj.slots_available <= 2:
            return 'almost_full'
        else:
            return 'available'