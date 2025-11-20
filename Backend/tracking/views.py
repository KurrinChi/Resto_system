from rest_framework import viewsets
from .models import OrderTracking
from .serializers import OrderTrackingSerializer

class OrderTrackingViewSet(viewsets.ModelViewSet):
    queryset = OrderTracking.objects.all()
    serializer_class = OrderTrackingSerializer
