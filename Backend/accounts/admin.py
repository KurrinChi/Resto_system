from django.contrib import admin
from .models import Customer

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ['id', 'fullName', 'email', 'phoneNumber', 'role', 'status', 'created_at']
    search_fields = ['fullName', 'name', 'email', 'phoneNumber']
    list_filter = ['role', 'status', 'created_at']
    readonly_fields = ['id', 'createdAt', 'created_at', 'updated_at']
