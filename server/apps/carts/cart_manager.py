from django.db import models
from django.db.models import Q


class CartManager(models.Manager):
    def get_or_create_for_request(self, user=None, session_key=None):
        """Get or create cart for the current request"""
        if user and user.is_authenticated:
            # For authenticated users, ignore session_key
            cart, created = self.get_or_create(
                user=user,
                checked_out=False,
                defaults={'session_key': None}
            )
        else:
            # For anonymous users, use session_key
            if not session_key:
                raise ValueError("Session key required for anonymous users")

            cart, created = self.get_or_create(
                session_key=session_key,
                user=None,
                checked_out=False
            )

        return cart, created

    def active_carts(self):
        """Get all active (non-checked-out) carts"""
        return self.filter(checked_out=False)

    def for_user(self, user):
        """Get carts for a specific user"""
        return self.filter(user=user)

    def for_session(self, session_key):
        """Get carts for a specific session"""
        return self.filter(session_key=session_key)