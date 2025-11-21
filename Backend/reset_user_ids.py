from utils.firebase_config import db, COLLECTIONS

print("Resetting user IDs to start from 01...")

# Get all current users
users_ref = db.collection(COLLECTIONS['users'])
users = list(users_ref.stream())

print(f"Found {len(users)} users")

# Group by role
admin_users = []
customer_users = []
staff_users = []

for user_doc in users:
    data = user_doc.to_dict()
    role = data.get('role', '').upper()
    
    # Get timestamp for sorting
    created = data.get('created_at', data.get('createdAt', ''))
    if hasattr(created, 'isoformat'):
        created = created.isoformat()
    
    if role == 'ADMIN':
        admin_users.append((user_doc, created, data))
    elif role in ['CHEF', 'CASHIER', 'WAITER', 'SECURITY_GUARD', 'STAFF']:
        staff_users.append((user_doc, created, data))
    else:
        customer_users.append((user_doc, created, data))

# Sort by creation date
admin_users.sort(key=lambda x: x[1])
customer_users.sort(key=lambda x: x[1])
staff_users.sort(key=lambda x: x[1])

# Rename admins
for idx, (user_doc, _, data) in enumerate(admin_users, 1):
    old_id = user_doc.id
    new_id = f"admin{idx:02d}"
    
    if old_id != new_id:
        # Create new document
        db.collection(COLLECTIONS['users']).document(new_id).set(data)
        # Delete old
        user_doc.reference.delete()
        print(f"✓ Admin: {old_id} → {new_id} ({data.get('name', data.get('fullName'))})")
    else:
        print(f"  Skipped: {new_id} (already correct)")

# Rename customers
for idx, (user_doc, _, data) in enumerate(customer_users, 1):
    old_id = user_doc.id
    new_id = f"customer{idx:02d}"
    
    if old_id != new_id:
        db.collection(COLLECTIONS['users']).document(new_id).set(data)
        user_doc.reference.delete()
        print(f"✓ Customer: {old_id} → {new_id} ({data.get('name', data.get('fullName'))})")
    else:
        print(f"  Skipped: {new_id} (already correct)")

# Rename staff
for idx, (user_doc, _, data) in enumerate(staff_users, 1):
    old_id = user_doc.id
    new_id = f"staff{idx:02d}"
    
    if old_id != new_id:
        db.collection(COLLECTIONS['users']).document(new_id).set(data)
        user_doc.reference.delete()
        print(f"✓ Staff: {old_id} → {new_id} ({data.get('name', data.get('fullName'))})")
    else:
        print(f"  Skipped: {new_id} (already correct)")

print(f"\n✅ User IDs reset successfully!")
print(f"   Admins: admin01-{len(admin_users):02d}")
print(f"   Customers: customer01-{len(customer_users):02d}")
print(f"   Staff: staff01-{len(staff_users):02d}")
