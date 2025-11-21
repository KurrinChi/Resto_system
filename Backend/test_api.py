"""
Test API endpoints directly
"""
import requests
import json

BASE_URL = "http://localhost:8000/api/admin"

print("🧪 Testing Admin API Endpoints\n")

# Test Dashboard Stats
print("=" * 60)
print("1️⃣  Testing Dashboard Stats")
print("=" * 60)
try:
    response = requests.get(f"{BASE_URL}/dashboard/stats")
    if response.status_code == 200:
        data = response.json()
        print("✅ Dashboard Stats API working!")
        print(json.dumps(data, indent=2))
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"❌ Connection error: {e}")

print("\n" + "=" * 60)
print("2️⃣  Testing Menu Items")
print("=" * 60)
try:
    response = requests.get(f"{BASE_URL}/menu")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Menu API working! Found {len(data.get('data', []))} items")
        if data.get('data'):
            print("\nFirst menu item:")
            print(json.dumps(data['data'][0], indent=2))
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"❌ Connection error: {e}")

print("\n" + "=" * 60)
print("3️⃣  Testing Orders")
print("=" * 60)
try:
    response = requests.get(f"{BASE_URL}/orders")
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Orders API working! Found {len(data.get('data', []))} orders")
        if data.get('data'):
            print("\nFirst order:")
            print(json.dumps(data['data'][0], indent=2))
    else:
        print(f"❌ Error: {response.status_code}")
        print(response.text)
except Exception as e:
    print(f"❌ Connection error: {e}")

print("\n✅ API Testing Complete!")
