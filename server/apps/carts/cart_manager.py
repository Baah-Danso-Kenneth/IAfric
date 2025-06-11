from django.db import models
from django.db.models import Q


class CartManager(models.Manager):
    def get_or_create_for_request(self, user=None, session_key=None):
        if user and user.is_authenticated:
            cart = self.filter(
                user=user,
                checked_out=False,
            ).order_by('-created').first()
            if cart:
                return cart, False
            else:
                return self.get_or_create(
                    user=user,
                    session_key=None,
                    defaults={'checked_out': False}
                )
        else:
            if not session_key:
                raise ValueError("Session key required for anonymous users")

            cart = self.filter(
                session_key=session_key,
                user=None,
                checked_out=False
            ).order_by('-created').first()
            if cart:
                return cart, False
            else:
                return self.get_or_create(
                    session_key=session_key,
                    user=None,
                    defaults={'checked_out': False}
                )

    def active_carts(self):
        return self.filter(checked_out=False)

    def for_user(self, user):
        return self.filter(user=user)

    def for_session(self, session_key):
        return self.filter(session_key=session_key)