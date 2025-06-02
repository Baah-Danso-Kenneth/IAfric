# apps/lightningPayments/services.py
import requests
import json
import hashlib
import time
from decimal import Decimal
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import logging

logger = logging.getLogger(__name__)


class LNDbitsError(Exception):
    """Custom exception for LNDbits API errors"""
    pass


class LNDbitsService:
    """Service for interacting with LNDbits API"""

    def __init__(self):
        self.base_url = getattr(settings, 'LNDBITS_URL', '').rstrip('/')
        self.admin_key = getattr(settings, 'LNDBITS_ADMIN_KEY', '')
        self.invoice_key = getattr(settings, 'LNDBITS_INVOICE_KEY', '')

        if not all([self.base_url, self.admin_key]):
            raise LNDbitsError("LNDbits URL and Admin Key must be configured in settings")

    def get_headers(self, use_admin=False):
        """Get headers for API requests"""
        key = self.admin_key if use_admin else self.invoice_key
        return {
            'X-Api-Key': key,
            'Content-Type': 'application/json'
        }

    def create_invoice(self, amount_sats, memo="", expiry_seconds=3600):
        """
        Create a Lightning invoice

        Args:
            amount_sats (int): Amount in satoshis
            memo (str): Description for the invoice
            expiry_seconds (int): Invoice expiry time in seconds

        Returns:
            dict: Invoice data from LNDbits
        """
        url = f"{self.base_url}/api/v1/payments"

        payload = {
            "out": False,
            "amount": amount_sats,
            "memo": memo,
            "expiry": expiry_seconds
        }

        try:
            response = requests.post(
                url,
                headers=self.get_headers(use_admin=True),
                json=payload,
                timeout=30
            )
            response.raise_for_status()

            data = response.json()
            logger.info(f"Created invoice for {amount_sats} sats: {data.get('payment_hash', 'unknown')}")
            return data

        except requests.RequestException as e:
            logger.error(f"Failed to create invoice: {str(e)}")
            raise LNDbitsError(f"Failed to create invoice: {str(e)}")

    def check_invoice_status(self, payment_hash):
        """
        Check the status of a Lightning invoice

        Args:
            payment_hash (str): Payment hash to check

        Returns:
            dict: Payment status data
        """
        url = f"{self.base_url}/api/v1/payments/{payment_hash}"

        try:
            response = requests.get(
                url,
                headers=self.get_headers(use_admin=True),
                timeout=30
            )
            response.raise_for_status()

            data = response.json()
            return data

        except requests.RequestException as e:
            logger.error(f"Failed to check invoice status: {str(e)}")
            raise LNDbitsError(f"Failed to check invoice status: {str(e)}")

    def get_wallet_balance(self):
        """Get wallet balance"""
        url = f"{self.base_url}/api/v1/wallet"

        try:
            response = requests.get(
                url,
                headers=self.get_headers(use_admin=True),
                timeout=30
            )
            response.raise_for_status()

            data = response.json()
            return data.get('balance', 0)

        except requests.RequestException as e:
            logger.error(f"Failed to get wallet balance: {str(e)}")
            raise LNDbitsError(f"Failed to get wallet balance: {str(e)}")

    def create_payment_request(self, amount_sats, description, expiry_minutes=60):
        """
        Create a payment request with all necessary data

        Args:
            amount_sats (int): Amount in satoshis
            description (str): Payment description
            expiry_minutes (int): Expiry time in minutes

        Returns:
            dict: Complete payment request data
        """
        expiry_seconds = expiry_minutes * 60

        try:
            invoice_data = self.create_invoice(
                amount_sats=amount_sats,
                memo=description,
                expiry_seconds=expiry_seconds
            )

            return {
                'payment_hash': invoice_data.get('payment_hash'),
                'payment_request': invoice_data.get('payment_request'),
                'checking_id': invoice_data.get('checking_id'),
                'bolt11': invoice_data.get('payment_request'),
                'amount': amount_sats,
                'memo': description,
                'expires_at': timezone.now() + timedelta(minutes=expiry_minutes)
            }

        except Exception as e:
            logger.error(f"Failed to create payment request: {str(e)}")
            raise LNDbitsError(f"Failed to create payment request: {str(e)}")

    def verify_payment(self, payment_hash):
        """
        Verify if a payment has been completed

        Args:
            payment_hash (str): Payment hash to verify

        Returns:
            tuple: (is_paid: bool, payment_data: dict)
        """
        try:
            status_data = self.check_invoice_status(payment_hash)

            is_paid = status_data.get('paid', False)

            return is_paid, status_data

        except Exception as e:
            logger.error(f"Failed to verify payment: {str(e)}")
            return False, {}


