from django.db import models
from datetime import timedelta
from django.utils import timezone
from django.conf import settings

class MembershipPlan(models.Model):
    PLAN_CHOICES = [
        ('standard', 'Standard'),
        ('premium', 'Premium'),
    ]

    name = models.CharField(max_length=50, choices=PLAN_CHOICES, unique=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    description = models.TextField(blank=True)

    def __str__(self):
        return f"{self.name.title()} - ${self.price}"


class Membership(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='membership')
    plan = models.ForeignKey(MembershipPlan, on_delete=models.SET_NULL, null=True)
    is_active = models.BooleanField(default=False)
    start_date = models.DateTimeField(default=timezone.now)
    end_date = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return  f"{self.user.email} - {self.plan.name} - {'Active' if self.is_active else 'Inactive'}"

    def activate(self):
        self.is_active = True
        self.start_date = timezone.now()
        self.end_date = self.start_date + timedelta(days=365)
        self.save()

        self.user.is_member = True
        self.user.save(update_fields=['is_member'])

    def deactivate(self):
        self.is_active = False
        self.user.is_member = False
        self.user.save(update_fields=['is_member'])
        self.save()

    def extend(self, payment=None):
        self.is_active = True
        if self.is_expired:
            self.start_date = timezone.now()
            self.end_date = self.start_date + timedelta(days=365)
        else:
            self.end_date = self.end_date + timedelta(days=365)
        self.save()

        self.user.is_member = True
        self.user.save(update_fields=['is_member'])

    @property
    def is_expired(self):
        return timezone.now() > self.end_date