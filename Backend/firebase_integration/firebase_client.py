import firebase_admin
from firebase_admin import credentials, firestore
from django.conf import settings
import os

# Path to service account key
service_account_path = os.path.join(settings.BASE_DIR, 'firebase_service_account.json')

# Initialize Firebase app
if not firebase_admin._apps:
    cred = credentials.Certificate(service_account_path)
    firebase_admin.initialize_app(cred)

db = firestore.client()

# Example functions for CRUD operations

def add_document(collection, data, doc_id=None):
    if doc_id:
        db.collection(collection).document(doc_id).set(data)
    else:
        db.collection(collection).add(data)

def get_document(collection, doc_id):
    doc = db.collection(collection).document(doc_id).get()
    return doc.to_dict() if doc.exists else None

def update_document(collection, doc_id, data):
    db.collection(collection).document(doc_id).update(data)

def delete_document(collection, doc_id):
    db.collection(collection).document(doc_id).delete()

def list_documents(collection):
    docs = db.collection(collection).stream()
    return [doc.to_dict() for doc in docs]
