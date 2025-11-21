"""
Test script to verify Firebase authentication
"""
import os
import sys
import django

# Setup Django
sys.path.append(os.path.dirname(os.path.abspath(__file__)))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from utils.firebase_config import query_collection, COLLECTIONS
import hashlib

def test_firebase_users():
    """List all users in Firebase"""
    print("=" * 50)
    print("Firebase Users Check")
    print("=" * 50)
    
    try:
        users = query_collection(COLLECTIONS['users'])
        
        if not users:
            print("[ERROR] No users found in Firebase!")
            return
        
        print(f"[OK] Found {len(users)} user(s) in Firebase:\n")
        
        for user in users:
            print(f"ID: {user.get('id', 'N/A')}")
            print(f"Username: {user.get('username', 'N/A')}")
            print(f"Email: {user.get('email', 'N/A')}")
            print(f"Role: {user.get('role', 'N/A')}")
            print(f"Status: {user.get('status', 'N/A')}")
            print(f"Password Hash: {user.get('password_hash', 'N/A')[:20]}..." if user.get('password_hash') else "Password Hash: N/A")
            print("-" * 50)
            
    except Exception as e:
        print(f"[ERROR] Error: {e}")
        import traceback
        traceback.print_exc()

def test_password_hash(password):
    """Test password hashing"""
    print("\n" + "=" * 50)
    print("Password Hash Test")
    print("=" * 50)
    password_hash = hashlib.sha256(password.encode()).hexdigest()
    print(f"Password: {password}")
    print(f"Hash: {password_hash}")
    return password_hash

def test_login_simulation(username_or_email, password):
    """Simulate login process"""
    print("\n" + "=" * 50)
    print("Login Simulation")
    print("=" * 50)
    
    try:
        # Hash password
        password_hash = hashlib.sha256(password.encode()).hexdigest()
        print(f"Looking for user: {username_or_email}")
        print(f"Password hash: {password_hash[:20]}...")
        
        # Find user
        users = query_collection(COLLECTIONS['users'])
        user = None
        
        for u in users:
            username_match = u.get('username', '').lower() == username_or_email.lower()
            email_match = u.get('email', '').lower() == username_or_email.lower()
            
            print(f"\nChecking user: {u.get('username')} / {u.get('email')}")
            print(f"  Username match: {username_match}")
            print(f"  Email match: {email_match}")
            
            if username_match or email_match:
                user = u
                print(f"  [OK] User found!")
                break
        
        if not user:
            print("\n[ERROR] User not found!")
            return False
        
        print(f"\nFound user:")
        print(f"  ID: {user.get('id')}")
        print(f"  Username: {user.get('username')}")
        print(f"  Email: {user.get('email')}")
        print(f"  Status: {user.get('status')}")
        print(f"  Stored hash: {user.get('password_hash', 'N/A')[:20]}..." if user.get('password_hash') else "  Stored hash: N/A")
        
        # Check password
        stored_hash = user.get('password_hash')
        if stored_hash == password_hash:
            print("\n[OK] Password matches!")
            return True
        else:
            print("\n[ERROR] Password does NOT match!")
            print(f"  Expected: {password_hash[:20]}...")
            print(f"  Got: {stored_hash[:20]}..." if stored_hash else "  Got: N/A")
            return False
            
    except Exception as e:
        print(f"[ERROR] Error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == '__main__':
    # List all users
    test_firebase_users()
    
    # Test password hashing
    test_password = input("\nEnter a password to test hashing (or press Enter to skip): ").strip()
    if test_password:
        test_password_hash(test_password)
    
    # Test login
    print("\n" + "=" * 50)
    username_or_email = input("Enter username or email to test login: ").strip()
    password = input("Enter password: ").strip()
    
    if username_or_email and password:
        test_login_simulation(username_or_email, password)

