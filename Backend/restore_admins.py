import os
import django
import hashlib

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from admin_api.models import User

def hash_password(password):
    return hashlib.sha256(password.encode()).hexdigest()

# Admin 1
admin1, created1 = User.objects.update_or_create(
    id='admin01',
    defaults={
        'email': 'admin@restaurant.com',
        'password_hash': hash_password('admin123'),
        'fullName': 'Admin One',
        'role': 'ADMIN',
        'status': 'active'
    }
)
print(f"Admin 1: {'Created' if created1 else 'Updated'} - {admin1.email}")

# Admin 2
admin2, created2 = User.objects.update_or_create(
    id='admin02',
    defaults={
        'email': 'admin2@resto.com',
        'password_hash': hash_password('admin123'),
        'fullName': 'Admin Two',
        'role': 'ADMIN',
        'status': 'active'
    }
)
print(f"Admin 2: {'Created' if created2 else 'Updated'} - {admin2.email}")

print("\nAdmin accounts restored successfully!")
print("Login credentials:")
print("  admin@restaurant.com / admin123")
print("  admin2@resto.com / admin123")
