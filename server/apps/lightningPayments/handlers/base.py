from abc import ABC, abstractmethod

class BasePaymentHandler(ABC):
    @abstractmethod
    def handle_successful_payment(self, payment):
        pass

    @abstractmethod
    def validate_payment_data(self, payment_data):
        pass