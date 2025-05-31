def sats_to_btc(satoshis):
    """Convert satoshis to BTC"""
    return Decimal(satoshis) / Decimal('100000000')


def btc_to_sats(btc_amount):
    """Convert BTC to satoshis"""
    return int(Decimal(str(btc_amount)) * Decimal('100000000'))


def generate_invoice_id():
    """Generate a unique invoice ID"""
    timestamp = str(int(time.time()))
    random_string = hashlib.sha256(f"{timestamp}{time.time()}".encode()).hexdigest()[:8]
    return f"inv_{timestamp}_{random_string}"