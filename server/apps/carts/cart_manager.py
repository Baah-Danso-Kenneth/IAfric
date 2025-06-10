from django.db import models, transaction
import logging

logger = logging.getLogger(__name__)


class CartManager(models.Manager):
    @transaction.atomic
    def get_or_create_session(self, session_key):
        if not session_key:
            raise ValueError('Session is required')
        cart, created = self.get_or_create(
            session_key = session_key,
            defaults = {'session_key': session_key}
        )
        if created:
            logger.info(f"Created new cart {cart.id} for session {session_key[:8]}")
        else:
            logger.info(f"Found exist {cart.id} for session {session_key[:8]}")
        return cart, created