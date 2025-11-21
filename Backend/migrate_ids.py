from utils.firebase_config import db, COLLECTIONS
from google.cloud import firestore

print("Starting ID migration for Orders and Users...")

# ==================== FIX ORDERS ====================
print("\n=== FIXING ORDER IDs ===")
orders_ref = db.collection(COLLECTIONS['orders'])
orders = list(orders_ref.stream())

print(f"Found {len(orders)} orders to rename")

# Sort orders by creation date
orders_sorted = sorted(orders, key=lambda x: x.to_dict().get('createdAt', ''))

# Rename orders to order01, order02, etc.
for index, order_doc in enumerate(orders_sorted, start=1):
    old_id = order_doc.id
    new_id = f"order{index:03d}"  # order001, order002, etc.
    
    # Get the order data
    order_data = order_doc.to_dict()
    
    # Create new document with incremental ID
    new_doc_ref = db.collection(COLLECTIONS['orders']).document(new_id)
    new_doc_ref.set(order_data)
    
    # Delete old document
    order_doc.reference.delete()
    
    print(f"✓ Renamed: {old_id[:20]}... → {new_id}")

print(f"\n✅ Migrated {len(orders)} orders to incremental IDs")

# ==================== FIX USERS ====================
print("\n=== FIXING USER IDs ===")
users_ref = db.collection(COLLECTIONS['users'])
users = list(users_ref.stream())

print(f"Found {len(users)} users to rename")

for user_doc in users:
    old_id = user_doc.id
    user_data = user_doc.to_dict()
    user_name = user_data.get('name', user_data.get('fullName', 'Unknown'))
    
    # Create readable ID from name (lowercase, replace spaces with hyphens)
    # For "Admin Using" -> "admin-using"
    new_id = user_name.lower().replace(' ', '-').replace('_', '-')
    
    # If ID already matches the name format, skip
    if old_id == new_id:
        print(f"  Skipping: {old_id} (already correct)")
        continue
    
    # Create new document with readable ID
    new_doc_ref = db.collection(COLLECTIONS['users']).document(new_id)
    
    # Check if this ID already exists
    if new_doc_ref.get().exists:
        print(f"  Warning: {new_id} already exists, adding number suffix")
        counter = 1
        while True:
            new_id_numbered = f"{new_id}-{counter}"
            new_doc_ref = db.collection(COLLECTIONS['users']).document(new_id_numbered)
            if not new_doc_ref.get().exists:
                new_id = new_id_numbered
                break
            counter += 1
    
    # Set the new document
    new_doc_ref.set(user_data)
    
    # Delete old document
    user_doc.reference.delete()
    
    print(f"✓ Renamed: {old_id} → {new_id} (Name: {user_name})")

print(f"\n✅ Migrated {len(users)} users to readable IDs")

print("\n🎉 All done! Orders now use order001, order002... format")
print("   Users now use name-based IDs (e.g., admin-using)")
