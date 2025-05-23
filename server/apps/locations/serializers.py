from rest_framework import serializers
from .models import (
    Location,
    LocationDetails,
    TourGuide
)
class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = [
            'id', 'name', 'slug', 'address', 'city', 'state_province', 'country',
            'latitude', 'longitude', 'coordinates', 'description', 'image', 'region_map',
            'best_time_title', 'best_time_description', 'weather_title', 'weather_description',
            'is_reverse_season', 'season_note'
        ]
    def get_coordinates(self,obj):
        if obj.latitude and obj.longitude:
            return {
               'latitude': float(obj.latitude),
                'longitude': float(obj.longitude)
            }
        return None


class LocationDetailsSerializer(serializers.ModelSerializer):
    """Serializer for location details"""

    class Meta:
        model = LocationDetails
        fields = ['map_image', 'best_time_to_visit', 'weather_info']


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