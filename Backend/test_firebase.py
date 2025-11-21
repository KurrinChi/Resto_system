"""
Test Firebase Firestore Connection
Run this to verify Firebase is set up correctly
"""
import sys
import os

# Add Backend to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    from utils.firebase_config import db, COLLECTIONS, add_document, query_collection
    
    print("✅ Firebase Admin SDK initialized successfully!")
    print(f"📊 Database client: {db}")
    print(f"\n📁 Available collections:")
    for key, value in COLLECTIONS.items():
        print(f"   - {key}: {value}")
    
    # Test adding a document
    print("\n🧪 Testing document operations...")
    
    test_data = {
        'name': 'Test Item',
        'test': True,
        'timestamp': '2024-01-01T00:00:00'
    }
    
    print(f"\n➕ Adding test document to '{COLLECTIONS['menu_items']}'...")
    doc_id = add_document(COLLECTIONS['menu_items'], test_data)
    print(f"✅ Document added with ID: {doc_id}")
    
    print(f"\n📖 Querying all documents from '{COLLECTIONS['menu_items']}'...")
    docs = query_collection(COLLECTIONS['menu_items'])
    print(f"✅ Found {len(docs)} document(s)")
    
    if docs:
        print("\n📄 Sample document:")
        print(docs[0])
    
    print("\n" + "="*60)
    print("🎉 Firebase Firestore is working correctly!")
    print("="*60)
    print("\n💡 You can now:")
    print("   1. Start the Django server: python manage.py runserver")
    print("   2. Access admin API at: http://localhost:8000/api/admin/")
    print("   3. View API docs at: http://localhost:8000/swagger/")
    
except Exception as e:
    print(f"\n❌ Error: {e}")
    print("\n🔧 Troubleshooting:")
    print("   1. Check if firebase-credentials.json exists in Backend folder")
    print("   2. Verify your Firebase project has Firestore enabled")
    print("   3. Ensure firebase-admin is installed: pip install firebase-admin")
    sys.exit(1)
