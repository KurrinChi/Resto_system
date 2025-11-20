from django.db import models

class SalesReport(models.Model):
    date = models.DateField()
    total_sales = models.DecimalField(max_digits=12, decimal_places=2)
    orders_count = models.PositiveIntegerField()
    average_order_value = models.DecimalField(max_digits=8, decimal_places=2)

class MenuPopularity(models.Model):
    item_name = models.CharField(max_length=128)
    item_id = models.IntegerField()
    total_orders = models.PositiveIntegerField()
    total_revenue = models.DecimalField(max_digits=10, decimal_places=2)
