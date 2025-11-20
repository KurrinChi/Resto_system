from rest_framework import serializers
from .models import OrderTracking
from orders.serializers import OrderSerializer

class OrderTrackingSerializer(serializers.ModelSerializer):
    order = OrderSerializer(read_only=True)
    class Meta:
        model = OrderTracking
        fields = '__all__'
