"""Create 5 sample orders with different statuses for tracking"""
import os
import sys
import django
from datetime import datetime
from decimal import Decimal
import random

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from admin_api.models import Order, MenuItem

# Get some menu items
menu_items = list(MenuItem.objects.all()[:5])

if not menu_items:
    print("Error: No menu items found in database")
    sys.exit(1)

# Different order statuses for tracking
statuses = ['received', 'preparing', 'ready', 'delivered', 'completed']
today = datetime.now().strftime('%Y%m%d')

# Create 5 orders with different statuses
for i, status in enumerate(statuses, 1):
    # Random items for this order
    num_items = min(3, len(menu_items))
    items = random.sample(menu_items, num_items)
    
    order_list = []
    for item in items:
        order_list.append({
            'id': item.id,
            'name': item.name,
            'quantity': random.randint(1, 3),
            'price': float(item.price)
        })
    
    # Calculate totals
    subtotal = sum(item['price'] * item['quantity'] for item in order_list)
    tax = subtotal * 0.1
    total = subtotal + tax
    
    # Create order
    order = Order.objects.create(
        id=f'order{i:03d}',
        fullName=f'Customer {i}',
        phoneNumber=f'+1234567890{i}',
        address=f'{100+i} Main St, City',
        orderList=order_list,
        orderStatus=status,
        orderType='DELIVERY',
        totalFee=Decimal(str(round(total, 2))),
        dayKey=today,
        createdAt=datetime.now()
    )
    
    print(f'✓ Created Order {order.id}:')
    print(f'  Status: {status}')
    print(f'  Customer: {order.fullName}')
    print(f'  Items: {len(order_list)}')
    print(f'  Total: ${total:.2f}')
    print()

print('✓ All 5 sample orders created successfully!')
