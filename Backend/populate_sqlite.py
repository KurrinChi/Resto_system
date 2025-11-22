"""
Populate SQLite database with sample data
"""
import os
import django
from datetime import datetime, timedelta
import random

# Setup Django
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from admin_api.models import User, MenuItem, Order, Category
from decimal import Decimal

print("="*60)
print("Populating SQLite Database")
print("="*60)
print()

# Clear existing data
print("Clearing existing data...")
User.objects.all().delete()
MenuItem.objects.all().delete()
Order.objects.all().delete()
Category.objects.all().delete()
print("✓ Cleared\n")

# 1. Create Categories
print("1. Creating Categories...")
categories_data = [
    {"id": "cat001", "name": "Appetizers", "description": "Starters and small bites", "display_order": 1},
    {"id": "cat002", "name": "Main Course", "description": "Main dishes", "display_order": 2},
    {"id": "cat003", "name": "Desserts", "description": "Sweet treats", "display_order": 3},
    {"id": "cat004", "name": "Beverages", "description": "Drinks and refreshments", "display_order": 4},
    {"id": "cat005", "name": "Sides", "description": "Side dishes", "display_order": 5},
]

for cat_data in categories_data:
    Category.objects.create(**cat_data)
print(f"✓ Created {len(categories_data)} categories\n")

# 2. Create Users
print("2. Creating Users...")
users_data = [
    {
        "id": "admin01",
        "fullName": "Admin User",
        "name": "admin",
        "email": "admin@resto.com",
        "phoneNumber": "+1234567890",
        "role": "admin",
        "status": "active",
        "avatar": "https://ui-avatars.com/api/?name=Admin+User&background=4F46E5&color=fff",
        "password_hash": "hashed_password_admin",
        "createdAt": datetime.now() - timedelta(days=180),
        "lastLogin": datetime.now() - timedelta(hours=2)
    }
]

for user_data in users_data:
    User.objects.create(**user_data)
print(f"✓ Created {len(users_data)} users\n")

# 3. Create Menu Items
print("3. Creating Menu Items...")
menu_items_data = [
    # Appetizers
    {"id": "menu001", "name": "Spring Rolls", "menuName": "Vegetable Spring Rolls", "description": "Crispy rolls filled with fresh vegetables", "price": Decimal("8.99"), "category": "cat001", "available": True, "preparation_time": 15, "ingredients": ["cabbage", "carrots", "spring roll wrapper"], "image_url": "https://images.unsplash.com/photo-1529042410759-befb1204b468"},
    {"id": "menu002", "name": "Garlic Bread", "menuName": "Garlic Bread Sticks", "description": "Toasted bread with garlic butter", "price": Decimal("6.99"), "category": "cat001", "available": True, "preparation_time": 10, "ingredients": ["bread", "garlic", "butter"], "image_url": "https://images.unsplash.com/photo-1573140401552-388e3aadb2b6"},
    {"id": "menu003", "name": "Bruschetta", "menuName": "Tomato Bruschetta", "description": "Grilled bread with tomatoes and basil", "price": Decimal("9.99"), "category": "cat001", "available": True, "preparation_time": 12, "ingredients": ["tomatoes", "basil", "bread", "olive oil"], "image_url": "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f"},
    {"id": "menu004", "name": "Mozzarella Sticks", "menuName": "Fried Mozzarella", "description": "Breaded and fried mozzarella cheese", "price": Decimal("10.99"), "category": "cat001", "available": True, "preparation_time": 15, "ingredients": ["mozzarella", "breadcrumbs"], "image_url": "https://images.unsplash.com/photo-1531749668029-2db88e4276c7"},
    
    # Main Course
    {"id": "menu005", "name": "Margherita Pizza", "menuName": "Classic Margherita", "description": "Fresh mozzarella, tomato sauce, basil", "price": Decimal("15.99"), "category": "cat002", "available": True, "preparation_time": 20, "ingredients": ["dough", "tomato sauce", "mozzarella", "basil"], "image_url": "https://images.unsplash.com/photo-1574071318508-1cdbab80d002"},
    {"id": "menu006", "name": "Pepperoni Pizza", "menuName": "Pepperoni Special", "description": "Classic pepperoni with cheese", "price": Decimal("17.99"), "category": "cat002", "available": True, "preparation_time": 20, "ingredients": ["dough", "tomato sauce", "mozzarella", "pepperoni"], "image_url": "https://images.unsplash.com/photo-1628840042765-356cda07504e"},
    {"id": "menu007", "name": "Grilled Chicken", "menuName": "Herb Grilled Chicken", "description": "Juicy chicken breast with herbs", "price": Decimal("18.99"), "category": "cat002", "available": True, "preparation_time": 25, "ingredients": ["chicken", "herbs", "olive oil"], "image_url": "https://images.unsplash.com/photo-1598103442097-8b74394b95c6"},
    {"id": "menu008", "name": "Beef Burger", "menuName": "Classic Beef Burger", "description": "Angus beef patty with fresh vegetables", "price": Decimal("16.99"), "category": "cat002", "available": True, "preparation_time": 18, "ingredients": ["beef", "lettuce", "tomato", "bun", "cheese"], "image_url": "https://images.unsplash.com/photo-1568901346375-23c9450c58cd"},
    {"id": "menu009", "name": "Pasta Carbonara", "menuName": "Creamy Carbonara", "description": "Pasta with bacon and cream sauce", "price": Decimal("14.99"), "category": "cat002", "available": True, "preparation_time": 20, "ingredients": ["pasta", "bacon", "cream", "parmesan"], "image_url": "https://images.unsplash.com/photo-1612874742237-6526221588e3"},
    {"id": "menu010", "name": "Salmon Steak", "menuName": "Grilled Salmon", "description": "Fresh salmon with lemon butter", "price": Decimal("22.99"), "category": "cat002", "available": True, "preparation_time": 25, "ingredients": ["salmon", "lemon", "butter", "herbs"], "image_url": "https://images.unsplash.com/photo-1467003909585-2f8a72700288"},
    {"id": "menu011", "name": "Vegetable Stir Fry", "menuName": "Asian Veggie Stir Fry", "description": "Mixed vegetables in Asian sauce", "price": Decimal("13.99"), "category": "cat002", "available": True, "preparation_time": 15, "ingredients": ["broccoli", "carrots", "bell peppers", "soy sauce"], "image_url": "https://images.unsplash.com/photo-1512058564366-18510be2db19"},
    {"id": "menu012", "name": "Fish Tacos", "menuName": "Baja Fish Tacos", "description": "Crispy fish with fresh slaw", "price": Decimal("15.99"), "category": "cat002", "available": False, "preparation_time": 20, "ingredients": ["fish", "tortilla", "cabbage", "sauce"], "image_url": "https://images.unsplash.com/photo-1551504734-5ee1c4a1479b"},
    
    # Desserts
    {"id": "menu013", "name": "Chocolate Cake", "menuName": "Rich Chocolate Cake", "description": "Decadent chocolate layered cake", "price": Decimal("8.99"), "category": "cat003", "available": True, "preparation_time": 10, "ingredients": ["chocolate", "flour", "eggs", "sugar"], "image_url": "https://images.unsplash.com/photo-1578985545062-69928b1d9587"},
    {"id": "menu014", "name": "Tiramisu", "menuName": "Classic Tiramisu", "description": "Italian coffee-flavored dessert", "price": Decimal("9.99"), "category": "cat003", "available": True, "preparation_time": 8, "ingredients": ["mascarpone", "coffee", "ladyfingers", "cocoa"], "image_url": "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9"},
    {"id": "menu015", "name": "Cheesecake", "menuName": "New York Cheesecake", "description": "Creamy classic cheesecake", "price": Decimal("10.99"), "category": "cat003", "available": True, "preparation_time": 10, "ingredients": ["cream cheese", "graham crackers", "sugar"], "image_url": "https://images.unsplash.com/photo-1533134486753-c833f0ed4866"},
    {"id": "menu016", "name": "Ice Cream", "menuName": "Vanilla Ice Cream", "description": "Premium vanilla ice cream", "price": Decimal("6.99"), "category": "cat003", "available": True, "preparation_time": 5, "ingredients": ["cream", "vanilla", "sugar"], "image_url": "https://images.unsplash.com/photo-1563805042-7684c019e1cb"},
    {"id": "menu017", "name": "Apple Pie", "menuName": "Homemade Apple Pie", "description": "Warm apple pie with cinnamon", "price": Decimal("8.99"), "category": "cat003", "available": True, "preparation_time": 12, "ingredients": ["apples", "cinnamon", "pastry"], "image_url": "https://images.unsplash.com/photo-1535920527002-b35e96722eb9"},
    
    # Beverages
    {"id": "menu018", "name": "Coca Cola", "menuName": "Coca Cola Classic", "description": "Refreshing cola drink", "price": Decimal("3.99"), "category": "cat004", "available": True, "preparation_time": 2, "ingredients": ["cola"], "image_url": "https://images.unsplash.com/photo-1554866585-cd94860890b7"},
    {"id": "menu019", "name": "Fresh Orange Juice", "menuName": "Freshly Squeezed OJ", "description": "100% fresh orange juice", "price": Decimal("5.99"), "category": "cat004", "available": True, "preparation_time": 5, "ingredients": ["oranges"], "image_url": "https://images.unsplash.com/photo-1600271886742-f049cd451bba"},
    {"id": "menu020", "name": "Iced Coffee", "menuName": "Cold Brew Coffee", "description": "Smooth cold brew coffee", "price": Decimal("4.99"), "category": "cat004", "available": True, "preparation_time": 3, "ingredients": ["coffee", "ice"], "image_url": "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7"},
    {"id": "menu021", "name": "Lemonade", "menuName": "Fresh Lemonade", "description": "Homemade lemonade", "price": Decimal("4.49"), "category": "cat004", "available": True, "preparation_time": 5, "ingredients": ["lemons", "sugar", "water"], "image_url": "https://images.unsplash.com/photo-1523677011781-c91d1bbe2f9f"},
    {"id": "menu022", "name": "Green Tea", "menuName": "Japanese Green Tea", "description": "Premium green tea", "price": Decimal("3.99"), "category": "cat004", "available": True, "preparation_time": 4, "ingredients": ["green tea leaves"], "image_url": "https://images.unsplash.com/photo-1556679343-c7306c1976bc"},
    
    # Sides
    {"id": "menu023", "name": "French Fries", "menuName": "Crispy French Fries", "description": "Golden crispy fries", "price": Decimal("4.99"), "category": "cat005", "available": True, "preparation_time": 10, "ingredients": ["potatoes", "salt"], "image_url": "https://images.unsplash.com/photo-1573080496219-bb080dd4f877"},
    {"id": "menu024", "name": "Onion Rings", "menuName": "Crispy Onion Rings", "description": "Breaded and fried onion rings", "price": Decimal("5.99"), "category": "cat005", "available": True, "preparation_time": 12, "ingredients": ["onions", "breadcrumbs"], "image_url": "https://images.unsplash.com/photo-1639024471283-03518883512d"},
    {"id": "menu025", "name": "Coleslaw", "menuName": "Fresh Coleslaw", "description": "Creamy cabbage salad", "price": Decimal("3.99"), "category": "cat005", "available": True, "preparation_time": 5, "ingredients": ["cabbage", "carrots", "mayo"], "image_url": "https://images.unsplash.com/photo-1626200419199-391ae4be7a41"},
    {"id": "menu026", "name": "Caesar Salad", "menuName": "Classic Caesar", "description": "Romaine lettuce with Caesar dressing", "price": Decimal("7.99"), "category": "cat005", "available": True, "preparation_time": 8, "ingredients": ["romaine", "parmesan", "croutons", "dressing"], "image_url": "https://images.unsplash.com/photo-1546793665-c74683f339c1"},
    {"id": "menu027", "name": "Mashed Potatoes", "menuName": "Creamy Mash", "description": "Smooth mashed potatoes", "price": Decimal("4.99"), "category": "cat005", "available": True, "preparation_time": 15, "ingredients": ["potatoes", "butter", "milk"], "image_url": "https://images.unsplash.com/photo-1585307858364-2e6ecb3000c6"},
    {"id": "menu028", "name": "Rice Pilaf", "menuName": "Herb Rice Pilaf", "description": "Fluffy rice with herbs", "price": Decimal("4.49"), "category": "cat005", "available": True, "preparation_time": 20, "ingredients": ["rice", "herbs", "butter"], "image_url": "https://images.unsplash.com/photo-1516684732162-798a0062be99"},
]

for item_data in menu_items_data:
    MenuItem.objects.create(**item_data)
print(f"✓ Created {len(menu_items_data)} menu items\n")

# 4. Create Orders
print("4. Creating Orders...")
customer_names = ["John Doe", "Jane Smith", "Mike Johnson", "Sarah Williams", "Tom Brown", 
                  "Emily Davis", "David Wilson", "Lisa Anderson", "James Taylor", "Mary Martinez"]
addresses = ["123 Main St", "456 Oak Ave", "789 Pine Rd", "321 Elm St", "654 Maple Dr",
             "987 Cedar Ln", "147 Birch Way", "258 Willow Ct", "369 Spruce Pl", "741 Ash Blvd"]
phone_numbers = [f"+123456{str(i).zfill(4)}" for i in range(7000, 7100)]

order_statuses = ["pending", "confirmed", "preparing", "ready", "delivering", "completed", "cancelled"]
order_types = ["delivery", "dine-in", "takeout"]

# Get all menu items for order creation
all_menu_items = list(MenuItem.objects.all())

orders_created = 0
for i in range(1, 101):
    # Random order details
    num_items = random.randint(1, 5)
    selected_items = random.sample(all_menu_items, num_items)
    
    order_list = []
    total_fee = Decimal("0.00")
    
    for item in selected_items:
        quantity = random.randint(1, 3)
        item_total = item.price * quantity
        total_fee += item_total
        
        order_list.append({
            "id": item.id,
            "name": item.menuName,
            "price": float(item.price),
            "quantity": quantity,
            "total": float(item_total)
        })
    
    # Random date within last 90 days
    days_ago = random.randint(0, 90)
    order_date = datetime.now() - timedelta(days=days_ago, hours=random.randint(0, 23), minutes=random.randint(0, 59))
    
    order_data = {
        "id": f"order{str(i).zfill(3)}",
        "fullName": random.choice(customer_names),
        "phoneNumber": random.choice(phone_numbers),
        "address": random.choice(addresses),
        "orderList": order_list,
        "totalFee": total_fee,
        "orderStatus": random.choice(order_statuses) if i < 95 else random.choice(["completed", "cancelled"]),
        "orderType": random.choice(order_types),
        "dayKey": order_date.strftime("%Y%m%d"),
        "createdAt": order_date
    }
    
    Order.objects.create(**order_data)
    orders_created += 1

print(f"✓ Created {orders_created} orders\n")

# Summary
print("="*60)
print("Database Population Complete!")
print("="*60)
print(f"Categories: {Category.objects.count()}")
print(f"Users: {User.objects.count()}")
print(f"Menu Items: {MenuItem.objects.count()}")
print(f"Orders: {Order.objects.count()}")
print()
print("You can now use the admin panel with data!")
print("="*60)
