"""
Test script to verify Firebase collections and data
"""
import sys
from pathlib import Path

# Add Backend to path
sys.path.append(str(Path(__file__).resolve().parent))

from utils.firebase_config import db, COLLECTIONS, query_collection

print("🔍 Testing Firebase Collections...\n")

# Test menus collection
print("=" * 50)
print("📋 MENUS Collection:")
print("=" * 50)
menus = query_collection(COLLECTIONS['menu_items'])
print(f"✅ Found {len(menus)} menu items in '{COLLECTIONS['menu_items']}' collection")
if menus:
    print("\nSample menu item:")
    sample = menus[0]
    for key, value in sample.items():
        print(f"  {key}: {value}")

# Test orders collection
print("\n" + "=" * 50)
print("📦 ORDERS Collection:")
print("=" * 50)
orders = query_collection(COLLECTIONS['orders'])
print(f"✅ Found {len(orders)} orders in '{COLLECTIONS['orders']}' collection")
if orders:
    print("\nSample order:")
    sample = orders[0]
    for key, value in sample.items():
        print(f"  {key}: {value}")

# Test users collection
print("\n" + "=" * 50)
print("👥 USERS Collection:")
print("=" * 50)
users = query_collection(COLLECTIONS['users'])
print(f"✅ Found {len(users)} users in '{COLLECTIONS['users']}' collection")

# Calculate stats
print("\n" + "=" * 50)
print("📊 STATISTICS:")
print("=" * 50)
total_revenue = sum(float(order.get('total_amount', 0)) for order in orders)
avg_order = total_revenue / len(orders) if orders else 0

print(f"Total Menu Items: {len(menus)}")
print(f"Total Orders: {len(orders)}")
print(f"Total Revenue: ₱{total_revenue:,.2f}")
print(f"Average Order: ₱{avg_order:,.2f}")
print(f"Total Users: {len(users)}")

print("\n✅ All collections are accessible!")
