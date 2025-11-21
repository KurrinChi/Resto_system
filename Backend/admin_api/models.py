"""
Django Models for Restaurant Management System
SQLite Database Schema
"""
from django.db import models
import uuid


class User(models.Model):
    """User model for customers, staff, and admins"""
    ROLE_CHOICES = [
        ('ADMIN', 'Admin'),
        ('CUSTOMER', 'Customer'),
        ('CHEF', 'Chef'),
        ('CASHIER', 'Cashier'),
        ('WAITER', 'Waiter'),
        ('SECURITY_GUARD', 'Security Guard'),
        ('STAFF', 'Staff'),
    ]
    
    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
        ('SUSPENDED', 'Suspended'),
    ]
    
    id = models.CharField(max_length=50, primary_key=True)
    fullName = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(unique=True, blank=True, null=True)
    phoneNumber = models.CharField(max_length=20, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='CUSTOMER')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    avatar = models.TextField(blank=True, null=True)  # Store base64 or URL
    password_hash = models.CharField(max_length=255, blank=True, null=True)
    login_attempts = models.IntegerField(default=0)
    createdAt = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    lastLogin = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'users'
        
    def __str__(self):
        return f"{self.id} - {self.fullName or self.name or self.email}"


class MenuItem(models.Model):
    """Menu items/dishes"""
    CATEGORY_CHOICES = [
        ('Starters', 'Starters'),
        ('Soups', 'Soups'),
        ('Mains', 'Mains'),
        ('Grills', 'Grills'),
        ('Specialties', 'Specialties'),
        ('Pasta', 'Pasta'),
        ('Sides', 'Sides'),
        ('Desserts', 'Desserts'),
        ('Drinks', 'Drinks'),
        ('Cocktails', 'Cocktails'),
    ]
    
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=255)
    menuName = models.CharField(max_length=255, blank=True, null=True)
    description = models.TextField(blank=True, null=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    available = models.BooleanField(default=True)
    preparation_time = models.IntegerField(default=15)  # in minutes
    ingredients = models.JSONField(default=list, blank=True)
    image_url = models.TextField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'menu_items'
        ordering = ['category', 'name']
        
    def __str__(self):
        return f"{self.id} - {self.name}"


class Order(models.Model):
    """Customer orders"""
    STATUS_CHOICES = [
        ('received', 'Received'),
        ('preparing', 'Preparing'),
        ('ready', 'Ready'),
        ('delivered', 'Delivered'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    ORDER_TYPE_CHOICES = [
        ('DINE_IN', 'Dine In'),
        ('TAKE_OUT', 'Take Out'),
        ('DELIVERY', 'Delivery'),
    ]
    
    id = models.CharField(max_length=50, primary_key=True)
    fullName = models.CharField(max_length=255)
    phoneNumber = models.CharField(max_length=20)
    address = models.TextField(blank=True, null=True)
    orderList = models.JSONField(default=list)  # Array of items
    totalFee = models.DecimalField(max_digits=10, decimal_places=2)
    orderStatus = models.CharField(max_length=20, choices=STATUS_CHOICES, default='received')
    orderType = models.CharField(max_length=20, choices=ORDER_TYPE_CHOICES, default='DINE_IN')
    dayKey = models.CharField(max_length=20)  # YYYY-MM-DD format
    createdAt = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'orders'
        ordering = ['-createdAt']
        
    def __str__(self):
        return f"{self.id} - {self.fullName} - ${self.totalFee}"


class Category(models.Model):
    """Menu categories"""
    id = models.CharField(max_length=50, primary_key=True)
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    display_order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        db_table = 'categories'
        ordering = ['display_order', 'name']
        
    def __str__(self):
        return self.name


class Setting(models.Model):
    """System settings"""
    key = models.CharField(max_length=100, primary_key=True)
    value = models.JSONField()
    description = models.TextField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        db_table = 'settings'
        
    def __str__(self):
        return self.key
