from utils.firebase_config import query_collection, COLLECTIONS

orders = query_collection(COLLECTIONS['orders'])
menu = query_collection(COLLECTIONS['menu_items'])

menu_names = set(item.get('menuName', item.get('name', '')) for item in menu)
order_items = set()

for order in orders:
    for item in order.get('orderList', []):
        menu_name = item.get('menuName')
        if menu_name:
            order_items.add(menu_name)

missing = order_items - menu_names

print(f'✅ Menu items: {len(menu_names)}')
print(f'✅ Unique items in orders: {len(order_items)}')
print(f'✅ Total orders: {len(orders)}')

if missing:
    print(f'\n❌ Items in orders but NOT in menu:')
    for item in missing:
        print(f'  - {item}')
else:
    print(f'\n✅ All order items match menu items!')
