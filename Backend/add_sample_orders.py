"""
Add sample orders to Firebase for testing Reports & Analytics
"""
import sys
import os
from datetime import datetime, timedelta
import random

# Add the project directory to the path
sys.path.insert(0, os.path.dirname(__file__))

from utils.firebase_config import add_document, COLLECTIONS

# Sample menu items
MENU_ITEMS = [
    {"menuName": "Burger", "price": 150},
    {"menuName": "Pizza", "price": 250},
    {"menuName": "Pasta", "price": 180},
    {"menuName": "Salad", "price": 120},
    {"menuName": "Fries", "price": 80},
    {"menuName": "Soda", "price": 50},
    {"menuName": "Coffee", "price": 70},
    {"menuName": "Steak", "price": 350},
]

# Order statuses
STATUSES = ["received", "preparing", "ready", "delivered", "completed"]

def create_sample_order(days_ago=0, status="received"):
    """Create a sample order"""
    order_date = datetime.now() - timedelta(days=days_ago)
    day_key = order_date.strftime("%Y-%m-%d")
    
    # Random number of items (1-4)
    num_items = random.randint(1, 4)
    order_list = []
    total_fee = 0
    
    for _ in range(num_items):
        item = random.choice(MENU_ITEMS)
        quantity = random.randint(1, 3)
        subtotal = item["price"] * quantity
        
        order_list.append({
            "menuName": item["menuName"],
            "price": item["price"],
            "quantity": quantity,
            "subtotal": subtotal
        })
        
        total_fee += subtotal
    
    order = {
        "orderType": random.choice(["DINE_IN", "TAKE_OUT", "DELIVERY"]),
        "orderStatus": status,
        "orderList": order_list,
        "totalFee": total_fee,
        "dayKey": day_key,
        "createdAt": order_date.isoformat(),
        "updatedAt": datetime.now().isoformat(),
        "customerName": f"Customer {random.randint(1000, 9999)}",
        "tableNumber": random.randint(1, 20) if random.choice([True, False]) else None,
    }
    
    return order

def main():
    print("🔥 Adding sample orders to Firebase...\n")
    
    # Create orders for the past 30 days
    orders_created = 0
    
    # Add orders with different statuses
    for days_ago in range(30):
        # Create 1-5 orders per day
        num_orders = random.randint(1, 5)
        
        for _ in range(num_orders):
            # Random status based on recency
            if days_ago == 0:  # Today
                status = random.choice(["received", "preparing", "ready"])
            elif days_ago <= 3:  # Last 3 days
                status = random.choice(["preparing", "ready", "delivered", "completed"])
            else:  # Older
                status = random.choice(["delivered", "completed"])
            
            order = create_sample_order(days_ago, status)
            order_id = add_document(COLLECTIONS['orders'], order)
            orders_created += 1
            
            print(f"✅ Created order {orders_created}: {order['dayKey']} - {status} - ₱{order['totalFee']}")
    
    print(f"\n🎉 Successfully created {orders_created} sample orders!")
    print("\nOrder Distribution:")
    print("- Last 30 days with varying statuses")
    print("- Mix of DINE_IN, TAKE_OUT, and DELIVERY")
    print("- Random menu items from 8 different dishes")
    print("\n✨ Go to Reports & Analytics to see the charts!")

if __name__ == "__main__":
    main()
