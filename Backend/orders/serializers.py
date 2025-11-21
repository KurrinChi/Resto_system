from rest_framework import serializers
from .models import Order, OrderLineItem, OrderStatusEvent
from menu.serializers import MenuItemSerializer, ItemVariationSerializer
from users.serializers import UserSerializer

class OrderLineItemSerializer(serializers.ModelSerializer):
    item = MenuItemSerializer(read_only=True)
    variation = ItemVariationSerializer(read_only=True)
    class Meta:
        model = OrderLineItem
        fields = '__all__'

class OrderStatusEventSerializer(serializers.ModelSerializer):
    actor = UserSerializer(read_only=True)
    class Meta:
        model = OrderStatusEvent
        fields = '__all__'

class OrderSerializer(serializers.ModelSerializer):
    line_items = OrderLineItemSerializer(many=True, read_only=True)
    status_events = OrderStatusEventSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    class Meta:
        model = Order
        fields = '__all__'
