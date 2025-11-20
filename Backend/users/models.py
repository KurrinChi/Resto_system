from django.contrib.auth.models import AbstractUser
from django.db import models

class Role(models.Model):
    name = models.CharField(max_length=32, unique=True)
    description = models.TextField(blank=True)

class User(AbstractUser):
    avatar = models.ImageField(upload_to='avatars/', blank=True, null=True)
    roles = models.ManyToManyField(Role, blank=True)

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
