"""
Admin API Views - Using Django ORM with SQLite
"""
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta
from django.utils import timezone
from admin_api.models import User, MenuItem, Order, Category, Setting
from django.db.models import Q, Sum, Count
import hashlib
from collections import defaultdict
import re


# ==================== HELPER FUNCTIONS ====================

def get_next_order_number():
    """Get the next available order number"""
    try:
        last_order = Order.objects.filter(id__startswith='order').order_by('-id').first()
        if last_order:
            match = re.match(r'order(\d+)', last_order.id)
            if match:
                next_num = int(match.group(1)) + 1
                return f"order{next_num:03d}"
        return "order001"
    except:
        return "order001"


def get_next_user_id(role):
    """Get the next available user ID based on role"""
    try:
        role_prefix_map = {
            'ADMIN': 'admin',
            'CUSTOMER': 'customer',
            'CHEF': 'staff',
            'CASHIER': 'staff',
            'WAITER': 'staff',
            'SECURITY_GUARD': 'staff',
            'STAFF': 'staff'
        }
        
        prefix = role_prefix_map.get(role.upper(), 'customer')
        last_user = User.objects.filter(id__startswith=prefix).order_by('-id').first()
        
        if last_user:
            match = re.match(rf'{prefix}(\d+)', last_user.id)
            if match:
                next_num = int(match.group(1)) + 1
                return f"{prefix}{next_num:02d}"
        return f"{prefix}01"
    except:
        return f"user_{int(datetime.now().timestamp())}"


def get_next_menu_id():
    """Get the next available menu item ID"""
    try:
        last_menu = MenuItem.objects.filter(id__startswith='menu').order_by('-id').first()
        if last_menu:
            match = re.match(r'menu(\d+)', last_menu.id)
            if match:
                next_num = int(match.group(1)) + 1
                return f"menu{next_num:03d}"
        return "menu001"
    except:
        return "menu001"


# ==================== DASHBOARD ====================

@api_view(['GET'])
def dashboard_stats(request):
    """Get dashboard statistics"""
    try:
        # Get all orders
        orders = Order.objects.all()
        total_orders = orders.count()
        total_revenue = orders.aggregate(Sum('totalFee'))['totalFee__sum'] or 0
        
        # Orders by status
        pending_orders = orders.filter(orderStatus='pending').count()
        preparing_orders = orders.filter(orderStatus='preparing').count()
        ready_orders = orders.filter(orderStatus='ready').count()
        completed_orders = orders.filter(orderStatus='completed').count()
        
        # Today's stats
        today = datetime.now().date()
        today_key = today.strftime('%Y%m%d')  # Format as YYYYMMDD
        today_orders = orders.filter(dayKey=today_key)
        today_revenue = today_orders.aggregate(Sum('totalFee'))['totalFee__sum'] or 0
        
        # Total users
        total_users = User.objects.count()
        
        # Calculate average order value
        avg_order_value = total_revenue / total_orders if total_orders > 0 else 0
        
        # Active customers and staff
        active_customers = User.objects.filter(role='customer', status='active').count()
        total_staff = User.objects.filter(role='staff').count()
        
        return Response({
            'success': True,
            'data': {
                'total_orders': total_orders,
                'total_revenue': float(total_revenue),
                'pending_orders': pending_orders,
                'preparing_orders': preparing_orders,
                'ready_orders': ready_orders,
                'completed_orders': completed_orders,
                'today_orders': today_orders.count(),
                'today_revenue': float(today_revenue),
                'total_menu_items': MenuItem.objects.count(),
                'total_staff': total_staff,
                'total_users': total_users,
                'active_customers': active_customers,
                'avg_order_value': round(avg_order_value, 2),
            }
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def dashboard_charts(request):
    """Get data for dashboard charts"""
    try:
        # Revenue by day (last 7 days)
        revenue_by_day = []
        orders_by_day = []
        
        for i in range(6, -1, -1):  # Last 7 days, reversed
            date = (datetime.now().date() - timedelta(days=i))
            day_key = date.strftime('%Y%m%d')  # Format as YYYYMMDD
            
            day_orders = Order.objects.filter(dayKey=day_key)
            revenue = day_orders.aggregate(Sum('totalFee'))['totalFee__sum'] or 0
            
            revenue_by_day.append({
                'date': date.strftime('%Y-%m-%d'),
                'revenue': float(revenue)
            })
            orders_by_day.append({
                'date': date.strftime('%Y-%m-%d'),
                'count': day_orders.count()
            })
        
        return Response({
            'success': True,
            'data': {
                'revenue_by_day': revenue_by_day,
                'orders_by_day': orders_by_day,
            }
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==================== USER MANAGEMENT ====================

@api_view(['GET'])
def list_users(request):
    """List all users with optional filtering"""
    try:
        users = User.objects.all()
        
        # Apply filters
        role = request.GET.get('role')
        user_status = request.GET.get('status')
        
        if role:
            users = users.filter(role=role)
        if user_status:
            users = users.filter(status=user_status)
        
        # Convert to dict
        users_data = []
        for user in users:
            # Convert UTC to local timezone for display
            created_at = user.createdAt
            if created_at and timezone.is_aware(created_at):
                created_at = timezone.localtime(created_at)
            
            last_login = user.lastLogin
            if last_login and timezone.is_aware(last_login):
                last_login = timezone.localtime(last_login)
            
            users_data.append({
                'id': user.id,
                'fullName': user.fullName,
                'name': user.name,
                'email': user.email,
                'phoneNumber': user.phoneNumber,
                'phone': user.phone,
                'address': user.address,
                'bio': user.bio,
                'role': user.role,
                'status': user.status,
                'avatar': user.avatar,
                'createdAt': created_at.isoformat() if created_at else None,
                'created_at': created_at.isoformat() if created_at else None,
                'lastLogin': last_login.isoformat() if last_login else None,
            })
        
        return Response({
            'success': True,
            'data': users_data
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def create_user(request):
    """Create a new user with role-based ID"""
    try:
        data = request.data
        role = data.get('role', 'CUSTOMER')
        user_id = get_next_user_id(role)
        
        # Hash password if provided
        password = data.get('password')
        password_hash = ''
        if password:
            password_hash = hashlib.sha256(password.encode()).hexdigest()
        
        user = User.objects.create(
            id=user_id,
            fullName=data.get('fullName', data.get('name', '')),
            name=data.get('name', data.get('fullName', '')),
            email=data.get('email'),
            phoneNumber=data.get('phoneNumber', data.get('phone', '')),
            phone=data.get('phone', data.get('phoneNumber', '')),
            address=data.get('address', ''),
            bio=data.get('bio', ''),
            role=role.upper(),
            status=data.get('status', 'ACTIVE').upper(),
            avatar=data.get('avatar', ''),
            password_hash=password_hash,
            login_attempts=0,
        )
        
        return Response({
            'success': True,
            'message': 'User created successfully',
            'data': {
                'id': user.id,
                'fullName': user.fullName,
                'email': user.email,
                'role': user.role,
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def user_detail(request, user_id):
    """Get, update, or delete a user"""
    try:
        user = User.objects.get(id=user_id)
        
        if request.method == 'GET':
            # Convert UTC to local timezone for display
            created_at = user.createdAt
            if created_at and timezone.is_aware(created_at):
                created_at = timezone.localtime(created_at)
            
            return Response({
                'success': True,
                'data': {
                    'id': user.id,
                    'fullName': user.fullName,
                    'name': user.name,
                    'email': user.email,
                    'phoneNumber': user.phoneNumber,
                    'phone': user.phone,
                    'address': user.address,
                    'bio': user.bio,
                    'role': user.role,
                    'status': user.status,
                    'avatar': user.avatar,
                    'createdAt': created_at.isoformat() if created_at else None,
                }
            })
        
        elif request.method == 'PUT':
            data = request.data
            
            # Update fields
            if 'fullName' in data:
                user.fullName = data['fullName']
                user.name = data['fullName']
            if 'name' in data:
                user.name = data['name']
            if 'email' in data:
                user.email = data['email']
            if 'phoneNumber' in data:
                user.phoneNumber = data['phoneNumber']
                user.phone = data['phoneNumber']
            if 'phone' in data:
                user.phone = data['phone']
            if 'address' in data:
                user.address = data['address']
            if 'bio' in data:
                user.bio = data['bio']
            if 'role' in data:
                user.role = data['role'].upper()
            if 'status' in data:
                user.status = data['status'].upper()
            if 'avatar' in data:
                user.avatar = data['avatar']
            if 'password' in data:
                user.password_hash = hashlib.sha256(data['password'].encode()).hexdigest()
            
            user.save()
            
            return Response({
                'success': True,
                'message': 'User updated successfully'
            })
        
        elif request.method == 'DELETE':
            user.delete()
            return Response({
                'success': True,
                'message': 'User deleted successfully'
            })
    
    except User.DoesNotExist:
        return Response({
            'success': False,
            'error': 'User not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==================== MENU MANAGEMENT ====================

@api_view(['GET'])
def list_menu_items(request):
    """List all menu items with optional filtering"""
    try:
        items = MenuItem.objects.all()
        
        # Apply filters
        category = request.GET.get('category')
        available = request.GET.get('available')
        
        if category:
            items = items.filter(category=category)
        if available is not None:
            items = items.filter(available=available.lower() == 'true')
        
        # Convert to dict
        items_data = []
        for item in items:
            # Build full image URL if image exists
            image_url = None
            if item.image:
                image_url = request.build_absolute_uri(item.image.url)
            
            items_data.append({
                'id': item.id,
                'name': item.name,
                'menuName': item.menuName,
                'description': item.description,
                'price': float(item.price),
                'category': item.category,
                'available': item.available,
                'preparation_time': item.preparation_time,
                'ingredients': item.ingredients,
                'image_url': image_url or item.image_url,
                'created_at': item.created_at.isoformat() if item.created_at else None,
            })
        
        return Response({
            'success': True,
            'data': items_data
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def create_menu_item(request):
    """Create a new menu item with auto-generated ID"""
    try:
        data = request.data
        menu_id = get_next_menu_id()
        
        # Defensive parsing for numeric fields
        try:
            price = float(data.get('price', 0)) if data.get('price') else 0.0
        except (ValueError, TypeError):
            price = 0.0
        
        try:
            prep_time = int(data.get('preparation_time', 15)) if data.get('preparation_time') else 15
        except (ValueError, TypeError):
            prep_time = 15
        
        # Parse boolean field from FormData (comes as string "true"/"false")
        available_str = data.get('available', 'true')
        if isinstance(available_str, str):
            available = available_str.lower() in ['true', '1', 'yes']
        else:
            available = bool(available_str)
        
        # Parse ingredients JSON if provided as string
        ingredients = []
        if data.get('ingredients'):
            try:
                if isinstance(data['ingredients'], str):
                    ingredients = eval(data['ingredients']) if data['ingredients'] else []
                else:
                    ingredients = data['ingredients']
            except:
                ingredients = []
        
        # Handle image file if provided
        image_file = request.FILES.get('image') if request.FILES else None
        
        menu_item = MenuItem.objects.create(
            id=menu_id,
            name=data.get('name', ''),
            menuName=data.get('menuName', data.get('name', '')),
            description=data.get('description', ''),
            price=price,
            category=data.get('category', 'Other'),
            available=available,
            preparation_time=prep_time,
            ingredients=ingredients,
            image=image_file,
            image_url=data.get('image_url', ''),
        )
        
        # Build full image URL if image exists
        image_url = None
        if menu_item.image:
            image_url = request.build_absolute_uri(menu_item.image.url)
        
        return Response({
            'success': True,
            'message': 'Menu item created successfully',
            'data': {
                'id': menu_item.id,
                'name': menu_item.name,
                'price': float(menu_item.price),
                'image_url': image_url or menu_item.image_url,
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def menu_item_detail(request, item_id):
    """Get, update, or delete a menu item"""
    try:
        item = MenuItem.objects.get(id=item_id)
        
        if request.method == 'GET':
            # Build full image URL if image exists
            image_url = None
            if item.image:
                image_url = request.build_absolute_uri(item.image.url)
            
            return Response({
                'success': True,
                'data': {
                    'id': item.id,
                    'name': item.name,
                    'menuName': item.menuName,
                    'description': item.description,
                    'price': float(item.price),
                    'category': item.category,
                    'available': item.available,
                    'preparation_time': item.preparation_time,
                    'ingredients': item.ingredients,
                    'image_url': image_url or item.image_url,
                }
            })
        
        elif request.method == 'PUT':
            data = request.data
            
            if 'name' in data:
                item.name = data['name']
                item.menuName = data['name']
            if 'menuName' in data:
                item.menuName = data['menuName']
            if 'description' in data:
                item.description = data['description']
            
            if 'price' in data:
                try:
                    item.price = float(data['price']) if data['price'] else 0.0
                except (ValueError, TypeError):
                    item.price = 0.0
            
            if 'category' in data:
                item.category = data['category']
            
            if 'available' in data:
                available_str = data['available']
                if isinstance(available_str, str):
                    item.available = available_str.lower() in ['true', '1', 'yes']
                else:
                    item.available = bool(available_str)
            
            if 'preparation_time' in data:
                try:
                    item.preparation_time = int(data['preparation_time']) if data['preparation_time'] else 15
                except (ValueError, TypeError):
                    item.preparation_time = 15
            
            if 'ingredients' in data:
                try:
                    if isinstance(data['ingredients'], str):
                        item.ingredients = eval(data['ingredients']) if data['ingredients'] else []
                    else:
                        item.ingredients = data['ingredients']
                except:
                    item.ingredients = []
            
            # Handle image file upload
            if 'image' in request.FILES:
                # Delete old image if it exists
                if item.image:
                    item.image.delete()
                item.image = request.FILES['image']
            
            if 'image_url' in data:
                item.image_url = data['image_url']
            
            item.save()
            
            # Build full image URL if image exists
            image_url = None
            if item.image:
                image_url = request.build_absolute_uri(item.image.url)
            
            return Response({
                'success': True,
                'message': 'Menu item updated successfully',
                'data': {
                    'id': item.id,
                    'image_url': image_url or item.image_url,
                }
            })
        
        elif request.method == 'DELETE':
            # Delete image file if it exists
            if item.image:
                item.image.delete()
            item.delete()
            return Response({
                'success': True,
                'message': 'Menu item deleted successfully'
            })
    
    except MenuItem.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Menu item not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==================== ORDER MANAGEMENT ====================

@api_view(['GET', 'POST'])
def list_orders(request):
    """List all orders or create a new order"""
    try:
        if request.method == 'GET':
            orders = Order.objects.all().order_by('-createdAt')
            
            # Apply filters
            order_status = request.GET.get('status')
            order_type = request.GET.get('order_type')
            
            if order_status:
                orders = orders.filter(orderStatus=order_status)
            if order_type:
                orders = orders.filter(orderType=order_type)
            
            # Convert to dict
            orders_data = []
            for order in orders:
                orders_data.append({
                    'id': order.id,
                    'fullName': order.fullName,
                    'phoneNumber': order.phoneNumber,
                    'address': order.address,
                    'orderList': order.orderList,
                    'totalFee': float(order.totalFee),
                    'orderStatus': order.orderStatus,
                    'orderType': order.orderType,
                    'dayKey': order.dayKey,
                    'createdAt': order.createdAt.isoformat() if order.createdAt else None,
                })
            
            return Response({
                'success': True,
                'data': orders_data
            })
        
        elif request.method == 'POST':
            data = request.data
            order_id = get_next_order_number()
            
            now = datetime.now()
            
            order = Order.objects.create(
                id=order_id,
                fullName=data.get('fullName', 'Unknown'),
                phoneNumber=data.get('phoneNumber', ''),
                address=data.get('address', ''),
                orderList=data.get('orderList', []),
                totalFee=data.get('totalFee', 0),
                orderStatus=data.get('orderStatus', 'received'),
                orderType=data.get('orderType', 'DINE_IN'),
                dayKey=str(now.date()),
            )
            
            return Response({
                'success': True,
                'message': 'Order created successfully',
                'data': {
                    'id': order.id,
                    'totalFee': float(order.totalFee),
                }
            }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT'])
def order_detail(request, order_id):
    """Get or update an order"""
    try:
        order = Order.objects.get(id=order_id)
        
        if request.method == 'GET':
            return Response({
                'success': True,
                'data': {
                    'id': order.id,
                    'fullName': order.fullName,
                    'phoneNumber': order.phoneNumber,
                    'address': order.address,
                    'orderList': order.orderList,
                    'totalFee': float(order.totalFee),
                    'orderStatus': order.orderStatus,
                    'orderType': order.orderType,
                    'dayKey': order.dayKey,
                    'createdAt': order.createdAt.isoformat() if order.createdAt else None,
                }
            })
        
        elif request.method == 'PUT':
            data = request.data
            
            if 'fullName' in data:
                order.fullName = data['fullName']
            if 'phoneNumber' in data:
                order.phoneNumber = data['phoneNumber']
            if 'address' in data:
                order.address = data['address']
            if 'orderList' in data:
                order.orderList = data['orderList']
            if 'totalFee' in data:
                order.totalFee = data['totalFee']
            if 'orderStatus' in data:
                order.orderStatus = data['orderStatus']
            if 'orderType' in data:
                order.orderType = data['orderType']
            
            order.save()
            
            return Response({
                'success': True,
                'message': 'Order updated successfully'
            })
    
    except Order.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Order not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
def update_order_status(request, order_id):
    """Update order status"""
    try:
        order = Order.objects.get(id=order_id)
        order.orderStatus = request.data.get('status', order.orderStatus)
        order.save()
        
        return Response({
            'success': True,
            'message': 'Order status updated successfully'
        })
    except Order.DoesNotExist:
        return Response({
            'success': False,
            'error': 'Order not found'
        }, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==================== CATEGORIES ====================

@api_view(['GET', 'POST'])
def categories(request):
    """List or create categories"""
    try:
        if request.method == 'GET':
            cats = Category.objects.all()
            cats_data = [{'id': c.id, 'name': c.name, 'description': c.description} for c in cats]
            return Response({'success': True, 'data': cats_data})
        
        elif request.method == 'POST':
            data = request.data
            cat = Category.objects.create(
                id=data.get('id', data.get('name', '').lower().replace(' ', '_')),
                name=data.get('name', ''),
                description=data.get('description', ''),
                display_order=data.get('display_order', 0)
            )
            return Response({'success': True, 'data': {'id': cat.id, 'name': cat.name}})
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT', 'DELETE'])
def category_detail(request, category_id):
    """Get, update, or delete a category"""
    try:
        cat = Category.objects.get(id=category_id)
        
        if request.method == 'GET':
            return Response({'success': True, 'data': {'id': cat.id, 'name': cat.name}})
        elif request.method == 'PUT':
            data = request.data
            if 'name' in data:
                cat.name = data['name']
            if 'description' in data:
                cat.description = data['description']
            cat.save()
            return Response({'success': True, 'message': 'Category updated'})
        elif request.method == 'DELETE':
            cat.delete()
            return Response({'success': True, 'message': 'Category deleted'})
    except Category.DoesNotExist:
        return Response({'success': False, 'error': 'Category not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==================== REPORTS & ANALYTICS ====================

@api_view(['GET'])
def sales_report(request):
    """Get sales report"""
    try:
        orders = Order.objects.all()
        total_sales = orders.aggregate(Sum('totalFee'))['totalFee__sum'] or 0
        
        return Response({
            'success': True,
            'data': {
                'total_sales': float(total_sales),
                'total_orders': orders.count(),
            }
        })
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def popular_items_report(request):
    """Get popular menu items"""
    try:
        # Count items from orders
        item_counts = defaultdict(int)
        item_revenue = defaultdict(float)
        orders = Order.objects.all()
        
        for order in orders:
            if isinstance(order.orderList, list):
                for item in order.orderList:
                    item_name = item.get('name', 'Unknown')
                    quantity = item.get('quantity', 1)
                    item_counts[item_name] += quantity
                    item_revenue[item_name] += float(item.get('total', 0))
        
        # Sort by count and get top 10
        popular = sorted(item_counts.items(), key=lambda x: x[1], reverse=True)[:10]
        
        return Response({
            'success': True,
            'data': [{
                'name': name,
                'count': count,
                'revenue': float(item_revenue[name])
            } for name, count in popular]
        })
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def revenue_trend(request):
    """Get revenue trend over time"""
    try:
        # Last 30 days
        trend = []
        for i in range(30):
            date = (datetime.now().date() - timedelta(days=i))
            day_key = date.strftime('%Y%m%d')  # Format as YYYYMMDD
            revenue = Order.objects.filter(dayKey=day_key).aggregate(Sum('totalFee'))['totalFee__sum'] or 0
            trend.append({'date': date.strftime('%Y-%m-%d'), 'revenue': float(revenue)})
        
        trend.reverse()
        
        return Response({'success': True, 'data': trend})
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def category_sales(request):
    """Get sales by category"""
    try:
        category_totals = defaultdict(float)
        category_orders = defaultdict(int)
        orders = Order.objects.all()
        
        # Get menu items to map categories
        menu_items_dict = {item.id: item for item in MenuItem.objects.all()}
        
        for order in orders:
            if isinstance(order.orderList, list):
                for item in order.orderList:
                    item_id = item.get('id', '')
                    menu_item = menu_items_dict.get(item_id)
                    
                    if menu_item:
                        # Get category from menu item
                        category_obj = Category.objects.filter(id=menu_item.category).first()
                        category_name = category_obj.name if category_obj else 'Other'
                    else:
                        category_name = 'Other'
                    
                    price = float(item.get('price', 0))
                    quantity = item.get('quantity', 1)
                    category_totals[category_name] += price * quantity
                    category_orders[category_name] += 1
        
        data = [
            {
                'category': cat,
                'revenue': float(total),
                'orders': category_orders[cat],
                'growth': 0  # Placeholder for growth calculation
            } 
            for cat, total in category_totals.items()
        ]
        
        return Response({'success': True, 'data': data})
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==================== SETTINGS ====================

@api_view(['GET', 'PUT'])
def settings(request):
    """Get or update settings"""
    try:
        if request.method == 'GET':
            all_settings = Setting.objects.all()
            settings_dict = {s.key: s.value for s in all_settings}
            return Response({'success': True, 'data': settings_dict})
        
        elif request.method == 'PUT':
            data = request.data
            for key, value in data.items():
                Setting.objects.update_or_create(key=key, defaults={'value': value})
            return Response({'success': True, 'message': 'Settings updated'})
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==================== PROFILE ====================

@api_view(['GET', 'PUT'])
def profile(request):
    """Get or update admin profile"""
    try:
        if request.method == 'GET':
            # Get first admin user
            admin = User.objects.filter(role='admin').first()
            
            if admin:
                return Response({
                    'success': True,
                    'data': {
                        'id': admin.id,
                        'name': admin.fullName or admin.name or 'Admin User',
                        'email': admin.email or 'admin@restaurant.com',
                        'phone': admin.phoneNumber or admin.phone or '',
                        'address': admin.address or '',
                        'bio': admin.bio or '',
                        'role': admin.role or 'ADMIN',
                        'avatar': admin.avatar or '',
                        'createdAt': admin.createdAt.isoformat() if admin.createdAt else '',
                        'lastLogin': admin.lastLogin.isoformat() if admin.lastLogin else '',
                    }
                })
            else:
                # Return default if no admin exists
                return Response({
                    'success': True,
                    'data': {
                        'id': 'admin01',
                        'name': 'Admin User',
                        'email': 'admin@restaurant.com',
                        'phone': '',
                        'address': '',
                        'bio': '',
                        'role': 'ADMIN',
                        'avatar': '',
                        'createdAt': datetime.now().isoformat(),
                        'lastLogin': datetime.now().isoformat(),
                    }
                })
        
        elif request.method == 'PUT':
            data = request.data
            admin = User.objects.filter(role='admin').first()
            
            if admin:
                if 'name' in data:
                    admin.fullName = data['name']
                    admin.name = data['name']
                if 'email' in data:
                    admin.email = data['email']
                if 'phone' in data:
                    admin.phoneNumber = data['phone']
                    admin.phone = data['phone']
                if 'address' in data:
                    admin.address = data['address']
                if 'bio' in data:
                    admin.bio = data['bio']
                if 'avatar' in data:
                    admin.avatar = data['avatar']
                
                admin.save()
                
                return Response({'success': True, 'message': 'Profile updated successfully'})
            else:
                return Response({'success': False, 'error': 'Admin user not found'}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def change_password(request):
    """Change admin password"""
    try:
        data = request.data
        current_password = data.get('current_password')
        new_password = data.get('new_password')
        
        admin = User.objects.filter(role='admin').first()
        
        if admin:
            # Verify current password
            current_hash = hashlib.sha256(current_password.encode()).hexdigest()
            
            if admin.password_hash == current_hash or not admin.password_hash:
                # Update password
                admin.password_hash = hashlib.sha256(new_password.encode()).hexdigest()
                admin.save()
                
                return Response({'success': True, 'message': 'Password changed successfully'})
            else:
                return Response({'success': False, 'error': 'Current password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response({'success': False, 'error': 'Admin user not found'}, status=status.HTTP_404_NOT_FOUND)
    
    except Exception as e:
        return Response({'success': False, 'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
