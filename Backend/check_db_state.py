from utils.firebase_config import db, COLLECTIONS

print("Current Database State:\n")

print("=== USERS ===")
users = list(db.collection(COLLECTIONS['users']).stream())
for user in users:
    data = user.to_dict()
    print(f"{user.id} - Role: {data.get('role')}, Name: {data.get('name', data.get('fullName'))}")

print(f"\nTotal users: {len(users)}\n")

print("=== MENU ITEMS ===")
menu_items = list(db.collection(COLLECTIONS['menu_items']).stream())
for item in menu_items:
    data = item.to_dict()
    print(f"{item.id} - {data.get('name', data.get('menuName'))}")
print(f"\nTotal menu items: {len(menu_items)}\n")

print("=== ORDERS ===")
orders = list(db.collection(COLLECTIONS['orders']).stream())
sample_orders = sorted(orders, key=lambda x: x.id)[:5]
for order in sample_orders:
    print(f"{order.id}")
print(f"... and {len(orders) - 5} more")
print(f"\nTotal orders: {len(orders)}")
