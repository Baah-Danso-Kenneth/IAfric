from rest_framework import  serializers




class CurrencyConvertSerializer(serializers.Serializer):
    CURRENCY_CHOICES = [
        ('btc', 'Bitcoin'),
        ('sats', 'Satoshis'),
        ('usd', 'US Dollar'),
    ]

    from_currency = serializers.ChoiceField(
        choices=CURRENCY_CHOICES,
        source='from',
        help_text="Source currency"
    )
    to_currency = serializers.ChoiceField(
        choices=CURRENCY_CHOICES,
        source='to',
        help_text="Target currency"
    )
    amount = serializers.DecimalField(
        max_digits=20,
        decimal_places=8,
        help_text="Amount to convert"
    )

    def validate(self, data):
        """Custom validation for conversion pairs"""
        from_curr = data['from']
        to_curr = data['to']

        valid_conversions = {
            ('btc', 'sats'), ('sats', 'btc'),
            ('btc', 'usd'), ('usd', 'btc'),
            ('sats', 'usd'), ('usd', 'sats'),
        }

        if (from_curr, to_curr) not in valid_conversions:
            raise serializers.ValidationError(
                f"Conversion {from_curr} -> {to_curr} not supported"
            )

        return data


class CurrencyFormatSerializer(serializers.Serializer):
    MODE_CHOICES = [
        ('sats', 'Satoshis'),
        ('btc', 'Bitcoin'),
        ('usd', 'US Dollar'),
    ]

    satoshis = serializers.IntegerField(
        min_value=0,
        help_text="Amount in satoshis to format"
    )
    mode = serializers.ChoiceField(
        choices=MODE_CHOICES,
        default='sats',
        help_text="Display format mode"
    )


# Response serializers for documentation
class ConversionResponseSerializer(serializers.Serializer):
    from_currency = serializers.CharField(source='from')
    to_currency = serializers.CharField(source='to')
    original_amount = serializers.CharField()
    converted_amount = serializers.CharField()


class FormatResponseSerializer(serializers.Serializer):
    satoshis = serializers.IntegerField()
    mode = serializers.CharField()
    formatted = serializers.CharField()


class RatesResponseSerializer(serializers.Serializer):
    btc_to_usd = serializers.CharField()
    updated_at = serializers.DateTimeField()