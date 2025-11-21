from django.db import models
from orders.models import Order

class OrderTracking(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='tracking')
    current_status = models.CharField(max_length=32)
    updated_at = models.DateTimeField(auto_now=True)
