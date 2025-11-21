#!/usr/bin/env python
"""Reset password for a user"""
import os
import django
import sys

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from users.models import User

if len(sys.argv) < 3:
    print("Usage: python reset_user_password.py <username> <new_password>")
    sys.exit(1)

username = sys.argv[1]
new_password = sys.argv[2]

try:
    user = User.objects.get(username=username)
    user.set_password(new_password)
    user.save()
    print(f"✅ Password reset successfully for user: {username}")
    print(f"   New password: {new_password}")
except User.DoesNotExist:
    print(f"❌ User '{username}' not found!")
    print("\nAvailable users:")
    for u in User.objects.all():
        print(f"  - {u.username} ({u.email})")

