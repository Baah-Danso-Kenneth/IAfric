from rest_framework.generics import RetrieveAPIView
from .models import Experience
from .serializers import ExperienceAllInOneSerializer

class ExperienceDetailView(RetrieveAPIView):
    queryset = Experience.objects.select_related('category').prefetch_related(
        'experienceimage_set',
        'experiencesession_set',
        'location',
        'kind_words',
    )
    serializer_class = ExperienceAllInOneSerializer
    lookup_field = 'slug'


