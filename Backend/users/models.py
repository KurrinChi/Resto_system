from django.contrib.auth.models import AbstractUser
from django.db import models

class Role(models.Model):
    name = models.CharField(max_length=32, unique=True)
    description = models.TextField(blank=True)

class User(AbstractUser):
    avatar = models.URLField(blank=True, null=True)  # Changed from ImageField
    roles = models.ManyToManyField(Role, blank=True)
    
    class Meta:
        # Fix conflicts with auth.User
        verbose_name = 'Custom User'
        verbose_name_plural = 'Custom Users'
    
    # Override to avoid conflicts
    groups = models.ManyToManyField(
        'auth.Group',
        verbose_name='groups',
        blank=True,
        related_name='custom_user_set',  # Changed related_name
        related_query_name='custom_user',
    )
    user_permissions = models.ManyToManyField(
        'auth.Permission',
        verbose_name='user permissions',
        blank=True,
        related_name='custom_user_set',  # Changed related_name
        related_query_name='custom_user',
    )

class Address(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='addresses')
    line1 = models.CharField(max_length=128)
    line2 = models.CharField(max_length=128, blank=True)
    city = models.CharField(max_length=64)
    province = models.CharField(max_length=64)
    postal = models.CharField(max_length=16)
    is_default = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
