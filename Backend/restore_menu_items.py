from utils.firebase_config import db, COLLECTIONS

print("Restoring menu items to database...")

menu_items = [
    {
        "id": "menu001",
        "name": "Crispy Calamari with Lime",
        "menuName": "Crispy Calamari with Lime",
        "price": 295,
        "category": "Starters",
        "description": "Tender squid rings with spicy aioli",
        "available": True,
        "image": "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400"
    },
    {
        "id": "menu002",
        "name": "Beet Hummus with Pita",
        "menuName": "Beet Hummus with Pita",
        "price": 245,
        "category": "Starters",
        "description": "Vibrant beetroot hummus served with warm pita",
        "available": True,
        "image": "https://images.unsplash.com/photo-1632778149955-e80f8ceca2e8?w=400"
    },
    {
        "id": "menu003",
        "name": "Tuna Tostadas",
        "menuName": "Tuna Tostadas",
        "price": 325,
        "category": "Starters",
        "description": "Crispy corn tortillas topped with fresh tuna",
        "available": True,
        "image": "https://images.unsplash.com/photo-1619895092538-128341789043?w=400"
    },
    {
        "id": "menu004",
        "name": "Creamy Tomato Soup",
        "menuName": "Creamy Tomato Soup",
        "price": 195,
        "category": "Soups",
        "description": "Rich tomato soup with basil and cream",
        "available": True,
        "image": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400"
    },
    {
        "id": "menu005",
        "name": "Spicy Beef Rice Bowl",
        "menuName": "Spicy Beef Rice Bowl",
        "price": 345,
        "category": "Mains",
        "description": "Tender beef with vegetables on steamed rice",
        "available": True,
        "image": "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400"
    },
    {
        "id": "menu006",
        "name": "Adobo Flakes with Garlic Rice",
        "menuName": "Adobo Flakes with Garlic Rice",
        "price": 295,
        "category": "Mains",
        "description": "Filipino-style adobo flakes with fragrant garlic rice",
        "available": True,
        "image": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400"
    },
    {
        "id": "menu007",
        "name": "Mapo Tofu with Rice",
        "menuName": "Mapo Tofu with Rice",
        "price": 275,
        "category": "Mains",
        "description": "Spicy Sichuan tofu with minced pork",
        "available": True,
        "image": "https://images.unsplash.com/photo-1633964913295-ceb43826e36f?w=400"
    },
    {
        "id": "menu008",
        "name": "Chicken Inasal with Rice",
        "menuName": "Chicken Inasal with Rice",
        "price": 285,
        "category": "Mains",
        "description": "Grilled marinated chicken with savory rice",
        "available": True,
        "image": "https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400"
    },
    {
        "id": "menu009",
        "name": "BBQ Pork Belly + Slaw",
        "menuName": "BBQ Pork Belly + Slaw",
        "price": 395,
        "category": "Grills",
        "description": "Smoky grilled pork belly with tangy coleslaw",
        "available": True,
        "image": "https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400"
    },
    {
        "id": "menu010",
        "name": "Mixed Grill Skewers + Dips",
        "menuName": "Mixed Grill Skewers + Dips",
        "price": 425,
        "category": "Grills",
        "description": "Assorted meat skewers with three signature dips",
        "available": True,
        "image": "https://images.unsplash.com/photo-1633504581786-316c8002b1b9?w=400"
    },
    {
        "id": "menu011",
        "name": "Short-Rib Kare-Kare",
        "menuName": "Short-Rib Kare-Kare",
        "price": 495,
        "category": "Specialties",
        "description": "Filipino peanut stew with tender short ribs",
        "available": True,
        "image": "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400"
    },
    {
        "id": "menu012",
        "name": "Seared Salmon with Roasted Tomatoes",
        "menuName": "Seared Salmon with Roasted Tomatoes",
        "price": 545,
        "category": "Specialties",
        "description": "Pan-seared salmon with cherry tomatoes and herbs",
        "available": True,
        "image": "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400"
    },
    {
        "id": "menu013",
        "name": "Grilled Cauliflower Steak",
        "menuName": "Grilled Cauliflower Steak",
        "price": 345,
        "category": "Specialties",
        "description": "Charred cauliflower with tahini and pomegranate",
        "available": True,
        "image": "https://images.unsplash.com/photo-1572449043416-55f4685c9bb7?w=400"
    },
    {
        "id": "menu014",
        "name": "Tomato Puttanesca",
        "menuName": "Tomato Puttanesca",
        "price": 295,
        "category": "Pasta",
        "description": "Classic Italian pasta with olives and capers",
        "available": True,
        "image": "https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400"
    },
    {
        "id": "menu015",
        "name": "Creamy Crab Linguine",
        "menuName": "Creamy Crab Linguine",
        "price": 395,
        "category": "Pasta",
        "description": "Fresh crab meat in a rich cream sauce",
        "available": True,
        "image": "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400"
    },
    {
        "id": "menu016",
        "name": "Garlic Rice",
        "menuName": "Garlic Rice",
        "price": 85,
        "category": "Sides",
        "description": "Fragrant rice with roasted garlic",
        "available": True,
        "image": "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=400"
    },
    {
        "id": "menu017",
        "name": "Tomato-Cucumber Salad",
        "menuName": "Tomato-Cucumber Salad",
        "price": 125,
        "category": "Sides",
        "description": "Fresh vegetables with citrus vinaigrette",
        "available": True,
        "image": "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400"
    },
    {
        "id": "menu018",
        "name": "Roasted Vegetables",
        "menuName": "Roasted Vegetables",
        "price": 145,
        "category": "Sides",
        "description": "Seasonal vegetables with herb butter",
        "available": True,
        "image": "https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400"
    },
    {
        "id": "menu019",
        "name": "Sweet Potato Fries + Aioli",
        "menuName": "Sweet Potato Fries + Aioli",
        "price": 165,
        "category": "Sides",
        "description": "Crispy fries with garlic aioli",
        "available": True,
        "image": "https://images.unsplash.com/photo-1639024471283-03518883512d?w=400"
    },
    {
        "id": "menu020",
        "name": "Chocolate Lava Cake",
        "menuName": "Chocolate Lava Cake",
        "price": 195,
        "category": "Desserts",
        "description": "Warm chocolate cake with molten center",
        "available": True,
        "image": "https://images.unsplash.com/photo-1624353365286-3f8d62daad51?w=400"
    },
    {
        "id": "menu021",
        "name": "Strawberry Cheesecake",
        "menuName": "Strawberry Cheesecake",
        "price": 215,
        "category": "Desserts",
        "description": "Creamy cheesecake with fresh strawberries",
        "available": True,
        "image": "https://images.unsplash.com/photo-1533134242443-c218d83e969b?w=400"
    },
    {
        "id": "menu022",
        "name": "Strawberry-Lychee Shaved Ice",
        "menuName": "Strawberry-Lychee Shaved Ice",
        "price": 175,
        "category": "Desserts",
        "description": "Refreshing shaved ice with tropical fruits",
        "available": True,
        "image": "https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=400"
    },
    {
        "id": "menu023",
        "name": "Hibiscus Calamansi Iced Tea",
        "menuName": "Hibiscus Calamansi Iced Tea",
        "price": 95,
        "category": "Drinks",
        "description": "Floral tea with citrus notes",
        "available": True,
        "image": "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400"
    },
    {
        "id": "menu024",
        "name": "Classic Lemonade",
        "menuName": "Classic Lemonade",
        "price": 85,
        "category": "Drinks",
        "description": "Fresh-squeezed lemonade",
        "available": True,
        "image": "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f0a?w=400"
    },
    {
        "id": "menu025",
        "name": "Watermelon Soda",
        "menuName": "Watermelon Soda",
        "price": 105,
        "category": "Drinks",
        "description": "Sparkling watermelon refresher",
        "available": True,
        "image": "https://images.unsplash.com/photo-1597306691203-7d68f6cd1ba6?w=400"
    },
    {
        "id": "menu026",
        "name": "Mojito (Zero-Proof Available)",
        "menuName": "Mojito (Zero-Proof Available)",
        "price": 145,
        "category": "Cocktails",
        "description": "Refreshing mint and lime cocktail",
        "available": True,
        "image": "https://images.unsplash.com/photo-1551538827-9c037cb4f32a?w=400"
    },
    {
        "id": "menu027",
        "name": "Classic Margarita (Zero-Proof Available)",
        "menuName": "Classic Margarita (Zero-Proof Available)",
        "price": 165,
        "category": "Cocktails",
        "description": "Tangy citrus cocktail with salt rim",
        "available": True,
        "image": "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=400"
    },
    {
        "id": "menu028",
        "name": "Kalabaw",
        "menuName": "Kalabaw",
        "price": 185,
        "category": "Cocktails",
        "description": "Filipino-inspired signature cocktail",
        "available": True,
        "image": "https://images.unsplash.com/photo-1470337458703-46ad1756a187?w=400"
    }
]

# Restore all menu items
for item_data in menu_items:
    item_id = item_data.pop('id')
    item_data['created_at'] = '2024-01-01T00:00:00'
    
    # Create document with specific ID
    db.collection(COLLECTIONS['menu_items']).document(item_id).set(item_data)
    print(f"✓ Restored: {item_id} - {item_data['name']}")

print(f"\n✅ Successfully restored {len(menu_items)} menu items!")
