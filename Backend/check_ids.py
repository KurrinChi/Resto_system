from utils.firebase_config import query_collection, update_document, COLLECTIONS
from google.cloud import firestore

# Get all orders and users
orders = query_collection(COLLECTIONS['orders'])
users = query_collection(COLLECTIONS['users'])

print(f"Found {len(orders)} orders")
print(f"Found {len(users)} users")

# Show sample order IDs
if orders:
    print("\nSample order IDs:")
    for order in orders[:5]:
        print(f"  - {order.get('id')}")

# Show sample user IDs
if users:
    print("\nSample user IDs:")
    for user in users:
        print(f"  - {user.get('id')} (Name: {user.get('name', 'N/A')})")
