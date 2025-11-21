# Firebase Integration for Django Backend

This module provides helper functions to interact with Firebase Firestore using the Firebase Admin SDK.

## Usage

Import the client and use the CRUD functions in your Django views or other modules:

```python
from firebase_integration.firebase_client import add_document, get_document, update_document, delete_document, list_documents

# Add a new menu item
add_document('menu_items', {'name': 'Classic Burger', 'price': 8.99})

# Get a menu item by ID
item = get_document('menu_items', 'item_id_here')

# Update a menu item
update_document('menu_items', 'item_id_here', {'price': 9.99})

# Delete a menu item
delete_document('menu_items', 'item_id_here')

# List all menu items
items = list_documents('menu_items')
```

## Configuration
- Place your Firebase service account JSON file in the Backend directory as `firebase_service_account.json`.
- The path is set in `core/settings.py` as `FIREBASE_SERVICE_ACCOUNT`.

## Next Steps
- Refactor Django views to use these functions for data storage/retrieval.
- You can extend the helper functions for more advanced queries, batch operations, or authentication as needed.
