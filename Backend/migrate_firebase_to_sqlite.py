"""
Migrate data from Firebase Firestore to SQLite
Run this script to transfer all your data
"""
import os
import django

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from admin_api.models import User, MenuItem, Order, Category
from utils.firebase_config import db, COLLECTIONS
from datetime import datetime
from decimal import Decimal

print("="*60)
print("Firebase to SQLite Migration")
print("="*60)
print()

# Migrate Users
print("1. Migrating Users...")
users_ref = db.collection(COLLECTIONS['users'])
firebase_users = list(users_ref.stream())

migrated_users = 0
for user_doc in firebase_users:
    user_data = user_doc.to_dict()
    
    try:
        # Convert Firebase timestamp to datetime
        created_at = user_data.get('createdAt', user_data.get('created_at'))
        if hasattr(created_at, 'isoformat'):
            created_at = created_at
        elif isinstance(created_at, str):
            try:
                created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
            except:
                created_at = datetime.now()
        else:
            created_at = datetime.now()
        
        last_login = user_data.get('lastLogin')
        if last_login and hasattr(last_login, 'isoformat'):
            last_login = last_login
        elif isinstance(last_login, str):
            try:
                last_login = datetime.fromisoformat(last_login.replace('Z', '+00:00'))
            except:
                last_login = None
        else:
            last_login = None
        
        user, created = User.objects.update_or_create(
            id=user_doc.id,
            defaults={
                'fullName': user_data.get('fullName', user_data.get('name')),
                'name': user_data.get('name', user_data.get('fullName')),
                'email': user_data.get('email'),
                'phoneNumber': user_data.get('phoneNumber', user_data.get('phone')),
                'phone': user_data.get('phone', user_data.get('phoneNumber')),
                'address': user_data.get('address', ''),
                'bio': user_data.get('bio', ''),
                'role': user_data.get('role', 'CUSTOMER').upper(),
                'status': user_data.get('status', 'ACTIVE').upper(),
                'avatar': user_data.get('avatar', ''),
                'password_hash': user_data.get('password_hash', ''),
                'login_attempts': user_data.get('login_attempts', 0),
                'createdAt': created_at,
                'created_at': created_at,
                'lastLogin': last_login,
            }
        )
        migrated_users += 1
        print(f"  ✓ {user_doc.id} - {user.fullName or user.name}")
    except Exception as e:
        print(f"  ✗ Error migrating user {user_doc.id}: {e}")

print(f"\n  Migrated {migrated_users}/{len(firebase_users)} users\n")

# Migrate Menu Items
print("2. Migrating Menu Items...")
menu_ref = db.collection(COLLECTIONS['menu_items'])
firebase_menu = list(menu_ref.stream())

migrated_menu = 0
for menu_doc in firebase_menu:
    menu_data = menu_doc.to_dict()
    
    try:
        created_at = menu_data.get('created_at')
        if hasattr(created_at, 'isoformat'):
            created_at = created_at
        elif isinstance(created_at, str):
            try:
                created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
            except:
                created_at = datetime.now()
        else:
            created_at = datetime.now()
        
        menu_item, created = MenuItem.objects.update_or_create(
            id=menu_doc.id,
            defaults={
                'name': menu_data.get('name', menu_data.get('menuName', 'Unknown')),
                'menuName': menu_data.get('menuName', menu_data.get('name')),
                'description': menu_data.get('description', ''),
                'price': Decimal(str(menu_data.get('price', 0))),
                'category': menu_data.get('category', 'Other'),
                'available': menu_data.get('available', True),
                'preparation_time': menu_data.get('preparation_time', menu_data.get('preparationTime', 15)),
                'ingredients': menu_data.get('ingredients', menu_data.get('keywords', [])),
                'image_url': menu_data.get('image_url', menu_data.get('image', '')),
                'created_at': created_at,
            }
        )
        migrated_menu += 1
        print(f"  ✓ {menu_doc.id} - {menu_item.name}")
    except Exception as e:
        print(f"  ✗ Error migrating menu item {menu_doc.id}: {e}")

print(f"\n  Migrated {migrated_menu}/{len(firebase_menu)} menu items\n")

# Migrate Orders
print("3. Migrating Orders...")
orders_ref = db.collection(COLLECTIONS['orders'])
firebase_orders = list(orders_ref.stream())

migrated_orders = 0
for order_doc in firebase_orders:
    order_data = order_doc.to_dict()
    
    try:
        created_at = order_data.get('createdAt', order_data.get('created_at'))
        if hasattr(created_at, 'isoformat'):
            created_at = created_at
        elif isinstance(created_at, str):
            try:
                created_at = datetime.fromisoformat(created_at.replace('Z', '+00:00'))
            except:
                created_at = datetime.now()
        else:
            created_at = datetime.now()
        
        order, created = Order.objects.update_or_create(
            id=order_doc.id,
            defaults={
                'fullName': order_data.get('fullName', 'Unknown'),
                'phoneNumber': order_data.get('phoneNumber', ''),
                'address': order_data.get('address', ''),
                'orderList': order_data.get('orderList', []),
                'totalFee': Decimal(str(order_data.get('totalFee', 0))),
                'orderStatus': order_data.get('orderStatus', 'received'),
                'orderType': order_data.get('orderType', 'DINE_IN'),
                'dayKey': order_data.get('dayKey', created_at.strftime('%Y-%m-%d')),
                'createdAt': created_at,
            }
        )
        migrated_orders += 1
        if migrated_orders % 10 == 0:
            print(f"  ✓ Migrated {migrated_orders} orders...")
    except Exception as e:
        print(f"  ✗ Error migrating order {order_doc.id}: {e}")

print(f"\n  Migrated {migrated_orders}/{len(firebase_orders)} orders\n")

print("="*60)
print("Migration Complete!")
print("="*60)
print(f"\nSummary:")
print(f"  Users: {migrated_users}/{len(firebase_users)}")
print(f"  Menu Items: {migrated_menu}/{len(firebase_menu)}")
print(f"  Orders: {migrated_orders}/{len(firebase_orders)}")
print(f"\nTotal: {migrated_users + migrated_menu + migrated_orders} records migrated")
print("\nNext steps:")
print("1. Update settings.py to disable Firebase")
print("2. Update admin_api/views.py to use Django ORM")
print("3. Restart Django server")
