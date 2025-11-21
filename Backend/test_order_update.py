"""
Test order status update API
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/admin"

print("🧪 Testing Order Status Update\n")

# First, get an order
print("1️⃣  Getting orders...")
response = requests.get(f"{BASE_URL}/orders")
if response.status_code == 200:
    data = response.json()
    if data.get('data') and len(data['data']) > 0:
        order = data['data'][0]
        order_id = order['id']
        current_status = order.get('orderStatus', 'unknown')
        print(f"✅ Found order: {order_id}")
        print(f"   Current status: {current_status}")
        
        # Test status update
        print(f"\n2️⃣  Updating order status to 'cancelled'...")
        update_response = requests.put(
            f"{BASE_URL}/orders/{order_id}/status",
            json={"status": "cancelled"},
            headers={"Content-Type": "application/json"}
        )
        
        print(f"   Status code: {update_response.status_code}")
        print(f"   Response: {json.dumps(update_response.json(), indent=2)}")
        
        if update_response.status_code == 200:
            print("✅ Order cancelled successfully!")
            
            # Verify the change
            print("\n3️⃣  Verifying the change...")
            verify_response = requests.get(f"{BASE_URL}/orders/{order_id}")
            if verify_response.status_code == 200:
                updated_order = verify_response.json()
                new_status = updated_order.get('data', {}).get('orderStatus', 'unknown')
                print(f"✅ New status: {new_status}")
        else:
            print(f"❌ Failed to update order")
            print(f"   Error: {update_response.text}")
    else:
        print("❌ No orders found")
else:
    print(f"❌ Error getting orders: {response.status_code}")
    print(response.text)
