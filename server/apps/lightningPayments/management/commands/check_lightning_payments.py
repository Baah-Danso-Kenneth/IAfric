from django.core.management.base import BaseCommand
from django.utils import timezone
from apps.lightningPayments.models import LightningPayment
import logging

logger = logging.getLogger(__name__)


class Command(BaseCommand):
    help = 'Check pending Lightning payments and update their status'

    def add_arguments(self, parser):
        parser.add_argument(
            '--limit',
            type=int,
            default=100,
            help='Maximum number of payments to check (default: 100)'
        )
        parser.add_argument(
            '--max-age-hours',
            type=int,
            default=24,
            help='Maximum age of payments to check in hours (default: 24)'
        )

    def handle(self, *args, **options):
        limit = options['limit']
        max_age_hours = options['max_age_hours']

        cutoff_time = timezone.now() - timezone.timedelta(hours=max_age_hours)

        pending_payments = LightningPayment.objects.filter(
            status='pending',
            created_at__gte=cutoff_time
        ).order_by('-created_at')[:limit]

        self.stdout.write(f"Checking {pending_payments.count()} pending payments...")

        updated_count = 0
        paid_count = 0
        expired_count = 0

        for payment in pending_payments:
            try:
                old_status = payment.status
                payment.check_status()

                if payment.status != old_status:
                    updated_count += 1
                    if payment.status == 'paid':
                        paid_count += 1
                        self.stdout.write(
                            self.style.SUCCESS(
                                f"Payment {payment.invoice_id} marked as PAID"
                            )
                        )
                    elif payment.status == 'expired':
                        expired_count += 1
                        self.stdout.write(
                            self.style.WARNING(
                                f"Payment {payment.invoice_id} marked as EXPIRED"
                            )
                        )

            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(
                        f"Error checking payment {payment.invoice_id}: {str(e)}"
                    )
                )
                logger.error(f"Error checking payment {payment.invoice_id}: {str(e)}")

        self.stdout.write(
            self.style.SUCCESS(
                f"Completed: {updated_count} payments updated "
                f"({paid_count} paid, {expired_count} expired)"
            )
        )
