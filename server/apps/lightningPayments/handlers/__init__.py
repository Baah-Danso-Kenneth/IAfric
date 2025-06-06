from .shop_handler import ShopPaymentHandler


PAYMENT_HANDLERS = {
    'shop': ShopPaymentHandler,
}

def get_payment_handler(payment_type):
    hanler_class = PAYMENT_HANDLERS.get(payment_type)
    return hanler_class() if hanler_class else None