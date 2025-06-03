from decimal import Decimal
import hashlib
import time


BTC_TO_USD_RATE = Decimal('68000.00')

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

def btc_to_usd(btc_amout, rate=BTC_TO_USD_RATE):
    return Decimal(btc_amout) * rate

def usd_to_btc(usd_amount, rate=BTC_TO_USD_RATE):
    return Decimal(usd_amount) / rate

def sats_to_usd(satoshis, rate=BTC_TO_USD_RATE):
    btc = sats_to_btc(satoshis)
    return btc_to_usd(btc, rate)

def usd_to_sats(usd_amount, rate=BTC_TO_USD_RATE):
    btc = usd_to_btc(usd_amount, rate)
    return btc_to_sats(btc)


def format_currency(satoshis, mode="sats",rate=BTC_TO_USD_RATE):
    if mode == "sats":
        return f"{satoshis} sats"
    elif mode == "btc":
        btc = sats_to_btc(satoshis)
        return f"{btc.normalize()} BTC"
    elif mode == "usd":
        usd = sats_to_usd(satoshis, rate)
        return f"${usd.quantize(Decimal('0.01'))} USD"
    else:
        raise ValueError("Unknown currency mode")