"""
Firebase Firestore Configuration
Initializes Firebase Admin SDK for Firestore database operations
"""
import firebase_admin
from firebase_admin import credentials, firestore
import os
from pathlib import Path

# Initialize Firebase Admin SDK
BASE_DIR = Path(__file__).resolve().parent.parent
FIREBASE_CREDENTIALS_PATH = BASE_DIR / 'firebase-credentials.json'

# Initialize Firebase app (singleton pattern)
if not firebase_admin._apps:
    cred = credentials.Certificate(str(FIREBASE_CREDENTIALS_PATH))
    firebase_admin.initialize_app(cred)

# Get Firestore client
db = firestore.client()

# Collection names (mapped to actual Firebase collection names)
COLLECTIONS = {
    'users': 'users',
    'menu_items': 'menus',  # Actual collection name in Firebase
    'orders': 'orders',
    'categories': 'categories',
    'tables': 'tables',
    'settings': 'settings',
    'reports': 'reports',
}


def get_collection(collection_name):
    """
    Get Firestore collection reference
    """
    return db.collection(collection_name)


def get_document(collection_name, document_id):
    """
    Get a specific document from a collection
    """
    return db.collection(collection_name).document(document_id).get()


def add_document(collection_name, data):
    """
    Add a new document to a collection
    Returns: document_id
    """
    doc_ref = db.collection(collection_name).add(data)
    return doc_ref[1].id


def update_document(collection_name, document_id, data):
    """
    Update an existing document
    """
    db.collection(collection_name).document(document_id).update(data)


def delete_document(collection_name, document_id):
    """
    Delete a document from a collection
    """
    db.collection(collection_name).document(document_id).delete()


def query_collection(collection_name, filters=None, order_by=None, limit=None):
    """
    Query a collection with optional filters, ordering, and limit
    
    Args:
        collection_name: Name of the collection
        filters: List of tuples (field, operator, value)
        order_by: Field to order by
        limit: Maximum number of results
    
    Returns:
        List of documents
    """
    query = db.collection(collection_name)
    
    if filters:
        for field, operator, value in filters:
            query = query.where(field, operator, value)
    
    if order_by:
        query = query.order_by(order_by)
    
    if limit:
        query = query.limit(limit)
    
    docs = query.stream()
    return [{'id': doc.id, **doc.to_dict()} for doc in docs]
