#!/usr/bin/env python
"""Quick script to check users in database"""
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import User

print("=" * 50)
print("Users in Database:")
print("=" * 50)

users = User.objects.all()
if users.exists():
    for u in users:
        print(f"  Username: {u.username}")
        print(f"  Email: {u.email}")
        print(f"  ID: {u.id}")
        print(f"  Is Active: {u.is_active}")
        print("-" * 50)
    print(f"\nTotal: {users.count()} user(s)")
else:
    print("  No users found in database!")
    print("\nTo create a user:")
    print("  1. Register via: http://localhost:5173/register")
    print("  2. Or use superuser: devadmin / DevAdmin123!")

print("=" * 50)

