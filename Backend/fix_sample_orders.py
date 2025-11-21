import random
from datetime import datetime, timedelta
from utils.firebase_config import query_collection, add_document, delete_document, COLLECTIONS

# First, get all existing orders and delete them
print("Deleting old orders...")
orders = query_collection(COLLECTIONS['orders'])
for order in orders:
    delete_document(COLLECTIONS['orders'], order['id'])
print(f"Deleted {len(orders)} old orders")

# Get real menu items
menu = query_collection(COLLECTIONS['menu_items'])
print(f"\nFound {len(menu)} menu items")

# Organize menu by category for realistic orders
menu_by_category = {}
for item in menu:
    category = item.get('category', item.get('type', 'Other'))
    if category not in menu_by_category:
        menu_by_category[category] = []
    menu_by_category[category].append(item)

# Order statuses and their probabilities
statuses = ['received', 'preparing', 'ready', 'delivered', 'completed']
status_weights = [10, 15, 10, 30, 35]  # More completed orders

# Generate 100 sample orders over the last 30 days
print("\nGenerating sample orders with real menu items...")
num_orders = 100
start_date = datetime.now() - timedelta(days=30)

for i in range(num_orders):
    # Random date in the last 30 days
    days_ago = random.randint(0, 30)
    order_date = datetime.now() - timedelta(days=days_ago)
    day_key = order_date.strftime('%Y-%m-%d')
    
    # Random number of items (1-5)
    num_items = random.randint(1, 5)
    order_items = []
    total_fee = 0
    
    # Select items from different categories for variety
    selected_items = random.sample(menu, min(num_items, len(menu)))
    
    for menu_item in selected_items:
        quantity = random.randint(1, 3)
        price = float(menu_item.get('price', 0))
        
        order_items.append({
            'menuName': menu_item.get('menuName', menu_item.get('name', 'Unknown')),
            'quantity': quantity,
            'price': price,
            'category': menu_item.get('category', menu_item.get('type', 'Other'))
        })
        
        total_fee += price * quantity
    
    # Create order
    order_data = {
        'fullName': random.choice([
            'Juan Dela Cruz', 'Maria Santos', 'Pedro Garcia', 'Ana Reyes',
            'Carlos Lopez', 'Sofia Martinez', 'Miguel Torres', 'Isabella Rivera',
            'Diego Hernandez', 'Lucia Gonzales', 'Rafael Cruz', 'Carmen Flores'
        ]),
        'phoneNumber': f'+639{random.randint(100000000, 999999999)}',
        'address': random.choice([
            'Quezon City', 'Manila', 'Makati', 'Pasig', 'Taguig',
            'Mandaluyong', 'San Juan', 'Pasay', 'Caloocan', 'Marikina'
        ]),
        'orderList': order_items,
        'totalFee': round(total_fee, 2),
        'orderStatus': random.choices(statuses, weights=status_weights)[0],
        'orderType': random.choice(['DINE_IN', 'TAKE_OUT', 'DELIVERY']),
        'dayKey': day_key,
        'createdAt': order_date.isoformat(),
        'updatedAt': order_date.isoformat(),
    }
    
    # Add to Firebase
    add_document(COLLECTIONS['orders'], order_data)
    
    if (i + 1) % 10 == 0:
        print(f"Created {i + 1}/{num_orders} orders...")

print(f"\n✅ Successfully created {num_orders} sample orders with real menu items!")
print("\nSample order breakdown:")
print(f"  - Items per order: 1-5 items")
print(f"  - Date range: Last 30 days")
print(f"  - All items from actual menu")
