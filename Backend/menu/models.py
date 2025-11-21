from django.db import models

class Category(models.Model):
    name = models.CharField(max_length=64, unique=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class MenuItem(models.Model):
    category = models.ForeignKey(Category, on_delete=models.CASCADE, related_name='items')
    name = models.CharField(max_length=128)
    description = models.TextField(blank=True)
    image = models.URLField(blank=True, null=True)  # Changed from ImageField
    active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class ItemVariation(models.Model):
    item = models.ForeignKey(MenuItem, on_delete=models.CASCADE, related_name='variations')
    label = models.CharField(max_length=64)
    price = models.DecimalField(max_digits=8, decimal_places=2)
    sku = models.CharField(max_length=32, blank=True)
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
