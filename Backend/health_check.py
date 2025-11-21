"""
System Health Check
Run this to diagnose setup issues
"""
import sys
import os

print("="*60)
print("Restaurant System - Health Check")
print("="*60)
print()

# Check 1: Python Version
print("1. Python Version")
print(f"   ✓ Python {sys.version.split()[0]}")
print()

# Check 2: Required Python Packages
print("2. Required Packages")
required_packages = [
    'django',
    'djangorestframework',
    'firebase-admin',
    'django-cors-headers',
]

for package in required_packages:
    try:
        __import__(package.replace('-', '_'))
        print(f"   ✓ {package} installed")
    except ImportError:
        print(f"   ✗ {package} NOT installed - run: pip install {package}")
print()

# Check 3: Firebase Credentials
print("3. Firebase Credentials")
firebase_path = "firebase-credentials.json"
if os.path.exists(firebase_path):
    print(f"   ✓ {firebase_path} found")
    import json
    try:
        with open(firebase_path) as f:
            data = json.load(f)
            if 'project_id' in data:
                print(f"   ✓ Valid Firebase config (Project: {data['project_id']})")
            else:
                print(f"   ⚠ File exists but may be invalid")
    except:
        print(f"   ✗ File exists but is not valid JSON")
else:
    print(f"   ✗ {firebase_path} NOT found!")
    print(f"   → Get this file from your team lead")
print()

# Check 4: Django Settings
print("4. Django Configuration")
try:
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
    import django
    django.setup()
    print("   ✓ Django configured correctly")
    
    from django.conf import settings
    if hasattr(settings, 'FIREBASE_SERVICE_ACCOUNT'):
        print(f"   ✓ Firebase path: {settings.FIREBASE_SERVICE_ACCOUNT}")
    
except Exception as e:
    print(f"   ✗ Django configuration error: {e}")
print()

# Check 5: Database Connection
print("5. Firebase Connection")
try:
    from utils.firebase_config import db, COLLECTIONS
    # Try to access a collection
    users = list(db.collection(COLLECTIONS['users']).limit(1).stream())
    print(f"   ✓ Firebase connected successfully")
    print(f"   ✓ Can access Firestore collections")
except Exception as e:
    print(f"   ✗ Firebase connection failed: {e}")
print()

# Check 6: API Endpoints
print("6. API Endpoints (requires server running)")
try:
    import requests
    base_url = "http://127.0.0.1:8000/api/admin"
    
    endpoints = ['/users', '/menu', '/orders', '/dashboard/stats']
    all_ok = True
    
    for endpoint in endpoints:
        try:
            r = requests.get(base_url + endpoint, timeout=2)
            if r.status_code == 200:
                print(f"   ✓ {endpoint}")
            else:
                print(f"   ✗ {endpoint} (Status: {r.status_code})")
                all_ok = False
        except requests.exceptions.ConnectionError:
            print(f"   ✗ {endpoint} (Server not running)")
            all_ok = False
            break
        except Exception as e:
            print(f"   ✗ {endpoint} ({e})")
            all_ok = False
    
    if not all_ok:
        print()
        print("   → Start Django server: python manage.py runserver")
        
except ImportError:
    print("   ⚠ requests package not installed (optional)")
    print("   → Install with: pip install requests")
print()

# Summary
print("="*60)
print("Health Check Complete!")
print("="*60)
print()
print("Next Steps:")
print("1. Fix any issues marked with ✗")
print("2. Run: python manage.py runserver")
print("3. In another terminal, run: npm run dev")
print("4. Access: http://localhost:5173")
print()
