import requests

print("Testing Admin API Endpoints...\n")

base_url = "http://127.0.0.1:8000/api/admin"

endpoints_to_test = [
    "/users",
    "/menu",
    "/orders",
    "/dashboard/stats",
    "/profile",
]

for endpoint in endpoints_to_test:
    url = base_url + endpoint
    try:
        response = requests.get(url, timeout=5)
        status = "✓ OK" if response.status_code == 200 else f"✗ {response.status_code}"
        print(f"{status:10} GET {endpoint}")
        if response.status_code != 200:
            print(f"           Response: {response.text[:100]}")
    except requests.exceptions.ConnectionError:
        print(f"✗ ERROR    GET {endpoint} - Connection refused (server not running?)")
    except requests.exceptions.Timeout:
        print(f"✗ TIMEOUT  GET {endpoint}")
    except Exception as e:
        print(f"✗ ERROR    GET {endpoint} - {str(e)}")

print("\n" + "="*50)
print("Checking Django server status...")
try:
    response = requests.get("http://127.0.0.1:8000/", timeout=2)
    print("✓ Django server is running")
except:
    print("✗ Django server is NOT running!")
    print("\nTo start the server, run:")
    print("  python manage.py runserver")
