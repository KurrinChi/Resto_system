"""
Quick test for login functionality
"""
import os
import sys
import django

sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from utils.firebase_config import query_collection, COLLECTIONS
import hashlib

# Test with the registered user
username_or_email = "cdlibunao"  # or "cdlibunao2104@gmail.com"
test_password = input(f"Enter password for {username_or_email}: ").strip()

if not test_password:
    print("No password provided")
    sys.exit(1)

# Hash password
password_hash = hashlib.sha256(test_password.encode()).hexdigest()
print(f"\nPassword hash: {password_hash[:30]}...")

# Find user
users = query_collection(COLLECTIONS['users'])
user = None

identifier_lower = username_or_email.lower().strip()

for u in users:
    username = (u.get('username') or '').lower().strip()
    email = (u.get('email') or '').lower().strip()
    
    print(f"Checking: {username} / {email} vs {identifier_lower}")
    
    if username == identifier_lower or email == identifier_lower:
        user = u
        print(f"[FOUND] User: {u.get('username')} / {u.get('email')}")
        break

if not user:
    print("\n[ERROR] User not found!")
    sys.exit(1)

print(f"\nUser found:")
print(f"  ID: {user.get('id')}")
print(f"  Username: {user.get('username')}")
print(f"  Email: {user.get('email')}")
print(f"  Status: {user.get('status')}")
print(f"  Has password_hash: {bool(user.get('password_hash'))}")

if not user.get('password_hash'):
    print("\n[ERROR] User has no password_hash!")
    sys.exit(1)

stored_hash = user.get('password_hash', '').strip()
print(f"\nStored hash: {stored_hash[:30]}...")
print(f"Computed hash: {password_hash[:30]}...")

if stored_hash == password_hash:
    print("\n[SUCCESS] Password matches! Login should work.")
else:
    print("\n[ERROR] Password does NOT match!")
    print(f"  Stored: {stored_hash}")
    print(f"  Computed: {password_hash}")

