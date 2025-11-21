from utils.firebase_config import db, COLLECTIONS

print("Checking menu item availability...")

menu_ref = db.collection(COLLECTIONS['menu_items'])
menu_items = list(menu_ref.stream())

print(f"\nFound {len(menu_items)} menu items:\n")

for item in menu_items:
    data = item.to_dict()
    name = data.get('name', data.get('menuName', 'Unknown'))
    available = data.get('available')
    
    print(f"{item.id}: {name}")
    print(f"  Available field: {available} (type: {type(available).__name__})")
    print()

# Check if any have the 'available' field set
items_with_available = [i for i in menu_items if 'available' in i.to_dict()]
print(f"\nItems with 'available' field: {len(items_with_available)}/{len(menu_items)}")
