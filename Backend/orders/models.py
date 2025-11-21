from django.db import models
from users.models import User
from menu.models import MenuItem, ItemVariation

class Order(models.Model):
    ORDER_TYPE_CHOICES = (
        ('dine-in', 'Dine-In'),
        ('delivery', 'Delivery'),
    )
    STATUS_CHOICES = (
        ('received', 'Received'),
        ('preparing', 'Preparing'),
        ('ready', 'Ready'),
        ('out-for-delivery', 'Out for Delivery'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    )
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    guest_id = models.CharField(max_length=64, blank=True)
    order_type = models.CharField(max_length=16, choices=ORDER_TYPE_CHOICES)
    status = models.CharField(max_length=32, choices=STATUS_CHOICES, default='received')
    total = models.DecimalField(max_digits=10, decimal_places=2)
    contact = models.CharField(max_length=128)
    delivery_address = models.CharField(max_length=256, blank=True)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class OrderLineItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='line_items')
    item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    variation = models.ForeignKey(ItemVariation, on_delete=models.SET_NULL, null=True, blank=True)
    quantity = models.PositiveIntegerField()
    price = models.DecimalField(max_digits=8, decimal_places=2)

class OrderStatusEvent(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='status_events')
    status = models.CharField(max_length=32)
    changed_at = models.DateTimeField(auto_now_add=True)
    actor = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
