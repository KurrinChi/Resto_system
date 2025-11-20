from rest_framework import viewsets
from .models import Order, OrderLineItem, OrderStatusEvent
from .serializers import OrderSerializer, OrderLineItemSerializer, OrderStatusEventSerializer

class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer

class OrderLineItemViewSet(viewsets.ModelViewSet):
    queryset = OrderLineItem.objects.all()
    serializer_class = OrderLineItemSerializer

class OrderStatusEventViewSet(viewsets.ModelViewSet):
    queryset = OrderStatusEvent.objects.all()
    serializer_class = OrderStatusEventSerializer
