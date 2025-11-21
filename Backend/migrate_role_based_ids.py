from utils.firebase_config import db, COLLECTIONS
from collections import defaultdict

print("Starting Role-Based ID Migration for Users and Menu Items...")

# ==================== FIX USERS WITH ROLE-BASED IDs ====================
print("\n=== MIGRATING USERS TO ROLE-BASED IDs ===")
users_ref = db.collection(COLLECTIONS['users'])
users = list(users_ref.stream())

print(f"Found {len(users)} users to rename")

# Group users by role and sort by creation date
role_counters = defaultdict(int)
users_by_role = defaultdict(list)

for user_doc in users:
    user_data = user_doc.to_dict()
    role = user_data.get('role', 'CUSTOMER').upper()
    # Get creation timestamp and convert to string for consistent sorting
    created_at = user_data.get('created_at', user_data.get('createdAt', ''))
    if hasattr(created_at, 'isoformat'):
        created_at = created_at.isoformat()
    elif not isinstance(created_at, str):
        created_at = str(created_at) if created_at else ''
    users_by_role[role].append((user_doc, created_at))

# Sort each role group by creation date
for role in users_by_role:
    users_by_role[role].sort(key=lambda x: x[1])

# Migrate users with role-based IDs
role_prefix_map = {
    'ADMIN': 'admin',
    'CUSTOMER': 'customer',
    'CHEF': 'staff',
    'CASHIER': 'staff',
    'WAITER': 'staff',
    'SECURITY_GUARD': 'staff',
    'STAFF': 'staff'
}

for role, user_list in users_by_role.items():
    prefix = role_prefix_map.get(role, 'customer')
    
    for user_doc, _ in user_list:
        old_id = user_doc.id
        user_data = user_doc.to_dict()
        user_role = user_data.get('role', 'CUSTOMER')
        user_name = user_data.get('name', user_data.get('fullName', 'Unknown'))
        
        # Increment counter for this role type
        role_counters[prefix] += 1
        new_id = f"{prefix}{role_counters[prefix]:02d}"  # admin01, customer01, staff01
        
        # Check if ID already exists
        new_doc_ref = db.collection(COLLECTIONS['users']).document(new_id)
        while new_doc_ref.get().exists:
            role_counters[prefix] += 1
            new_id = f"{prefix}{role_counters[prefix]:02d}"
            new_doc_ref = db.collection(COLLECTIONS['users']).document(new_id)
        
        # Create new document
        new_doc_ref.set(user_data)
        
        # Delete old document
        user_doc.reference.delete()
        
        print(f"✓ Renamed: {old_id} → {new_id} (Role: {user_role}, Name: {user_name})")

print(f"\n✅ Migrated {len(users)} users to role-based IDs")
print(f"   Counters: {dict(role_counters)}")

# ==================== FIX MENU ITEMS WITH GENERATED IDs ====================
print("\n=== MIGRATING MENU ITEMS TO GENERATED IDs ===")
menu_ref = db.collection(COLLECTIONS['menu_items'])
menu_items = list(menu_ref.stream())

print(f"Found {len(menu_items)} menu items to rename")

# Sort by creation date with proper type conversion
def get_sortable_timestamp(menu_doc):
    data = menu_doc.to_dict()
    created = data.get('created_at', data.get('createdAt', ''))
    if hasattr(created, 'isoformat'):
        return created.isoformat()
    elif isinstance(created, str):
        return created
    return str(created) if created else ''

menu_items_sorted = sorted(menu_items, key=get_sortable_timestamp)

for index, menu_doc in enumerate(menu_items_sorted, start=1):
    old_id = menu_doc.id
    new_id = f"menu{index:03d}"  # menu001, menu002, etc.
    
    menu_data = menu_doc.to_dict()
    menu_name = menu_data.get('name', menu_data.get('menuName', 'Unknown'))
    
    # Create new document
    new_doc_ref = db.collection(COLLECTIONS['menu_items']).document(new_id)
    new_doc_ref.set(menu_data)
    
    # Delete old document
    menu_doc.reference.delete()
    
    print(f"✓ Renamed: {old_id} → {new_id} (Item: {menu_name})")

print(f"\n✅ Migrated {len(menu_items)} menu items to generated IDs")

print("\n🎉 All done!")
print(f"   Users: admin01-{role_counters['admin']:02d}, customer01-{role_counters['customer']:02d}, staff01-{role_counters['staff']:02d}")
print(f"   Menu Items: menu001-menu{len(menu_items):03d}")
