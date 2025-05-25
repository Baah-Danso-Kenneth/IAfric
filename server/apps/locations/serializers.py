from rest_framework import serializers
from .models import (
    Location,
    LocationDetails,
    TourGuide
)

class TourGuideSerializer(serializers.ModelSerializer):
    class Meta:
        model = TourGuide
        fields = [
            'id', 'name', 'slug', 'bio', 'image', 'email', 'phone',
            'website', 'instagram', 'languages', 'specialties','location',
            'years_experience',  'created_at', 'updated_at'
        ]



class LocationSerializer(serializers.ModelSerializer):
    tour_guides = TourGuideSerializer(many=True, read_only=True)
    class Meta:
        model = Location
        fields = [
            'id', 'name', 'slug', 'description', 'city', 'country', 'meal_included',
            'latitude', 'longitude', 'image', 'tour_guides'
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


