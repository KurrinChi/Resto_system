from utils.firebase_config import query_collection, COLLECTIONS

# Get all menu items
menu = query_collection(COLLECTIONS['menu_items'])

print('Menu items available:')
for item in menu:
    name = item.get('menuName', item.get('name', 'Unknown'))
    category = item.get('category', item.get('type', 'N/A'))
    price = item.get('price', 0)
    print(f"  - {name} ({category}) - ₱{price}")
    
print(f"\nTotal: {len(menu)} items")
