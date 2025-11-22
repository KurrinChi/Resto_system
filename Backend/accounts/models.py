from django.db import models

class Customer(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    fullName = models.CharField(max_length=255, blank=True, null=True)
    name = models.CharField(max_length=255, blank=True, null=True)
    email = models.CharField(max_length=254, blank=True, null=True)
    phoneNumber = models.CharField(max_length=20, blank=True, null=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    address = models.TextField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    role = models.CharField(max_length=20, default='Customer')
    status = models.CharField(max_length=20, default='active')
    avatar = models.TextField(blank=True, null=True)
    password_hash = models.CharField(max_length=255, blank=True, null=True)
    login_attempts = models.IntegerField(default=0)
    createdAt = models.DateTimeField(auto_now_add=True)
    created_at = models.DateTimeField(auto_now_add=True)
    lastLogin = models.DateTimeField(blank=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'users'  # Use existing users table
        managed = False  # Don't let Django manage this table

    def __str__(self):
        return f"{self.fullName or self.name} ({self.email})"
