from rest_framework.generics import RetrieveAPIView
from .models import Experience
from .serializers import ExperienceAllInOneSerializer

class ExperienceDetailView(RetrieveAPIView):
    queryset = Experience.objects.prefetch_related(
        'categories', 'experienceimage_set', 'experiencesession_set', 'location', 'guide'
    )
    serializer_class = ExperienceAllInOneSerializer
    lookup_field = 'slug'

