from django.db import models, transaction
import logging

logger = logging.getLogger(__name__)


class CartManager(models.Manager):
    @transaction.atomic
    def get_or_create_for_request(self, user=None, session_key=None):
        """
        FIXED: Proper cart creation/retrieval with atomic transactions
        """
        if user and user.is_authenticated:
            # For authenticated users, always use user-based cart
            cart, created = self.get_or_create(
                user=user,
                checked_out=False,
                defaults={'session_key': None}
            )

            # If user logs in and has a session cart, merge them
            if session_key and not created:
                self._merge_session_cart_if_exists(cart, session_key, user)

        else:
            # For guest users, use session-based cart
            if not session_key:
                raise ValueError("Session key required for guest carts")

            # CRITICAL FIX: Use get_or_create to handle race conditions
            cart, created = self.get_or_create(
                session_key=session_key,
                checked_out=False,
                defaults={
                    'user': None,
                    'session_key': session_key
                }
            )

            if created:
                logger.info(f"Created new session cart {cart.id} for session {session_key[:8]}...")
            else:
                logger.info(f"Found existing session cart {cart.id} for session {session_key[:8]}...")

        return cart, created

    @transaction.atomic
    def _merge_session_cart_if_exists(self, user_cart, session_key, user):
        """
        Merge session cart into user cart when user logs in
        """
        try:
            session_cart = self.get(
                session_key=session_key,
                checked_out=False,
                user=None
            )

            # Merge items from session cart to user cart
            merged_count = 0
            for item in session_cart.items.all():
                try:
                    user_cart.add_item(
                        item.item,
                        quantity=item.quantity,
                        replace_quantity=False,
                        variant_id=item.variant_id,
                        variant_name=item.variant_name
                    )
                    merged_count += 1
                except Exception as e:
                    logger.warning(f"Failed to merge cart item {item.id}: {e}")

            # Delete the session cart after successful merge
            session_cart.delete()
            logger.info(f"Merged {merged_count} items from session cart into user cart for user {user.id}")

        except self.model.DoesNotExist:
            pass  # No session cart to merge

    def cleanup_old_carts(self, days=30):
        """
        Clean up old unchecked carts
        """
        from django.utils import timezone

        cutoff_date = timezone.now() - timezone.timedelta(days=days)
        old_carts = self.filter(
            updated__lt=cutoff_date,
            checked_out=False
        )
        count = old_carts.count()
        old_carts.delete()
        logger.info(f"Cleaned up {count} old carts")
        return count