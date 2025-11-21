"""
Admin API Views
Handles all admin-related endpoints for the restaurant management system
"""
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from datetime import datetime, timedelta
from utils.firebase_config import (
    get_collection, query_collection, add_document,
    update_document, delete_document, get_document, COLLECTIONS
)
import hashlib
from collections import defaultdict


# ==================== DASHBOARD ====================

@api_view(['GET'])
def dashboard_stats(request):
    """
    Get dashboard statistics
    GET /api/admin/dashboard/stats
    """
    try:
        # Get all orders
        orders = query_collection(COLLECTIONS['orders'])
        menu_items = query_collection(COLLECTIONS['menu_items'])
        users = query_collection(COLLECTIONS['users'])
        
        # Calculate stats
        total_orders = len(orders)
        total_revenue = sum(float(order.get('totalFee', 0)) for order in orders)
        
        # Orders by status (using orderStatus field)
        pending_orders = len([o for o in orders if o.get('orderStatus') == 'received'])
        preparing_orders = len([o for o in orders if o.get('orderStatus') == 'preparing'])
        ready_orders = len([o for o in orders if o.get('orderStatus') == 'ready'])
        completed_orders = len([o for o in orders if o.get('orderStatus') in ['delivered', 'completed']])
        
        # Today's stats
        today = datetime.now().date()
        today_key = str(today)
        today_orders = [o for o in orders if o.get('dayKey') == today_key]
        today_revenue = sum(float(order.get('totalFee', 0)) for order in today_orders)
        
        # Staff count
        staff_count = len([u for u in users if u.get('role') in ['CHEF', 'CASHIER', 'WAITER', 'SECURITY_GUARD']])
        
        # Calculate average order value
        avg_order_value = total_revenue / total_orders if total_orders > 0 else 0
        
        # Active customers (total users)
        active_customers = len(users)
        
        return Response({
            'success': True,
            'data': {
                'total_orders': total_orders,
                'total_revenue': total_revenue,
                'pending_orders': pending_orders,
                'preparing_orders': preparing_orders,
                'ready_orders': ready_orders,
                'completed_orders': completed_orders,
                'today_orders': len(today_orders),
                'today_revenue': today_revenue,
                'total_menu_items': len(menu_items),
                'total_staff': staff_count,
                'total_users': len(users),
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
    """
    Get data for dashboard charts
    GET /api/admin/dashboard/charts
    """
    try:
        orders = query_collection(COLLECTIONS['orders'])
        
        # Revenue by day (last 7 days)
        revenue_by_day = defaultdict(float)
        orders_by_day = defaultdict(int)
        
        for i in range(7):
            date = (datetime.now().date() - timedelta(days=i))
            revenue_by_day[str(date)] = 0
            orders_by_day[str(date)] = 0
        
        for order in orders:
            order_date = order.get('dayKey', '')
            if order_date in revenue_by_day:
                revenue_by_day[order_date] += float(order.get('totalFee', 0))
                orders_by_day[order_date] += 1
        
        # Orders by type
        orders_by_type = {
            'DINE_IN': len([o for o in orders if o.get('order_type') == 'DINE_IN']),
            'TAKEOUT': len([o for o in orders if o.get('order_type') == 'TAKEOUT']),
            'DELIVERY': len([o for o in orders if o.get('order_type') == 'DELIVERY']),
        }
        
        # Top menu items
        item_counts = defaultdict(int)
        for order in orders:
            for item in order.get('items', []):
                item_name = item.get('name', 'Unknown')
                item_counts[item_name] += item.get('quantity', 0)
        
        top_items = sorted(item_counts.items(), key=lambda x: x[1], reverse=True)[:5]
        
        return Response({
            'success': True,
            'data': {
                'revenue_chart': [
                    {'date': date, 'revenue': revenue}
                    for date, revenue in sorted(revenue_by_day.items())
                ],
                'orders_chart': [
                    {'date': date, 'orders': count}
                    for date, count in sorted(orders_by_day.items())
                ],
                'orders_by_type': orders_by_type,
                'top_items': [{'name': name, 'count': count} for name, count in top_items]
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
    """
    List all users with optional filtering
    GET /api/admin/users?role=CHEF&status=ACTIVE
    """
    try:
        role = request.GET.get('role')
        user_status = request.GET.get('status')
        
        filters = []
        if role:
            filters.append(('role', '==', role))
        if user_status:
            filters.append(('status', '==', user_status))
        
        users = query_collection(COLLECTIONS['users'], filters=filters if filters else None)
        
        # Remove password hashes from response
        for user in users:
            user.pop('password_hash', None)
        
        return Response({
            'success': True,
            'data': users
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def create_user(request):
    """
    Create a new user
    POST /api/admin/users
    """
    try:
        data = request.data
        
        # Hash password
        password = data.get('password')
        if password:
            data['password_hash'] = hashlib.sha256(password.encode()).hexdigest()
            del data['password']
        
        # Set defaults
        data['created_at'] = datetime.now().isoformat()
        data['status'] = data.get('status', 'ACTIVE')
        data['login_attempts'] = 0
        
        # Add to Firestore
        doc_id = add_document(COLLECTIONS['users'], data)
        
        return Response({
            'success': True,
            'data': {
                'id': doc_id,
                **data
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def user_detail(request, user_id):
    """
    Get, update, or delete a user
    GET/PUT/DELETE /api/admin/users/<id>
    """
    try:
        if request.method == 'GET':
            doc = get_document(COLLECTIONS['users'], user_id)
            if not doc.exists:
                return Response({
                    'success': False,
                    'error': 'User not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            user_data = {'id': doc.id, **doc.to_dict()}
            user_data.pop('password_hash', None)
            
            return Response({
                'success': True,
                'data': user_data
            })
        
        elif request.method == 'PUT':
            data = request.data
            
            # Hash password if provided
            if 'password' in data:
                data['password_hash'] = hashlib.sha256(data['password'].encode()).hexdigest()
                del data['password']
            
            data['updated_at'] = datetime.now().isoformat()
            
            update_document(COLLECTIONS['users'], user_id, data)
            
            return Response({
                'success': True,
                'message': 'User updated successfully'
            })
        
        elif request.method == 'DELETE':
            delete_document(COLLECTIONS['users'], user_id)
            
            return Response({
                'success': True,
                'message': 'User deleted successfully'
            })
    
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==================== MENU MANAGEMENT ====================

@api_view(['GET'])
def list_menu_items(request):
    """
    List all menu items with optional filtering
    GET /api/admin/menu?category=Main Course&available=true
    """
    try:
        category = request.GET.get('category')
        available = request.GET.get('available')
        
        filters = []
        if category:
            filters.append(('category', '==', category))
        if available:
            filters.append(('available', '==', available.lower() == 'true'))
        
        items = query_collection(COLLECTIONS['menu_items'], filters=filters if filters else None)
        
        return Response({
            'success': True,
            'data': items
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def create_menu_item(request):
    """
    Create a new menu item
    POST /api/admin/menu
    """
    try:
        data = request.data
        data['created_at'] = datetime.now().isoformat()
        data['available'] = data.get('available', True)
        
        doc_id = add_document(COLLECTIONS['menu_items'], data)
        
        return Response({
            'success': True,
            'data': {
                'id': doc_id,
                **data
            }
        }, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
def menu_item_detail(request, item_id):
    """
    Get, update, or delete a menu item
    GET/PUT/DELETE /api/admin/menu/<id>
    """
    try:
        if request.method == 'GET':
            doc = get_document(COLLECTIONS['menu_items'], item_id)
            if not doc.exists:
                return Response({
                    'success': False,
                    'error': 'Menu item not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            return Response({
                'success': True,
                'data': {'id': doc.id, **doc.to_dict()}
            })
        
        elif request.method == 'PUT':
            data = request.data
            data['updated_at'] = datetime.now().isoformat()
            
            update_document(COLLECTIONS['menu_items'], item_id, data)
            
            return Response({
                'success': True,
                'message': 'Menu item updated successfully'
            })
        
        elif request.method == 'DELETE':
            delete_document(COLLECTIONS['menu_items'], item_id)
            
            return Response({
                'success': True,
                'message': 'Menu item deleted successfully'
            })
    
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==================== ORDER MANAGEMENT ====================

@api_view(['GET'])
def list_orders(request):
    """
    List all orders with optional filtering
    GET /api/admin/orders?status=received&order_type=delivery
    """
    try:
        order_status = request.GET.get('status')
        order_type = request.GET.get('order_type')
        
        filters = []
        if order_status:
            filters.append(('orderStatus', '==', order_status))  # Changed from 'status'
        if order_type:
            filters.append(('orderType', '==', order_type))  # Changed from 'order_type'
        
        orders = query_collection(
            COLLECTIONS['orders'],
            filters=filters if filters else None,
            order_by='createdAt'  # Changed from 'created_at'
        )
        
        # Reverse to get newest first
        orders.reverse()
        
        return Response({
            'success': True,
            'data': orders
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT'])
def order_detail(request, order_id):
    """
    Get or update an order
    GET/PUT /api/admin/orders/<id>
    """
    try:
        if request.method == 'GET':
            doc = get_document(COLLECTIONS['orders'], order_id)
            if not doc.exists:
                return Response({
                    'success': False,
                    'error': 'Order not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            return Response({
                'success': True,
                'data': {'id': doc.id, **doc.to_dict()}
            })
        
        elif request.method == 'PUT':
            data = request.data
            data['updated_at'] = datetime.now().isoformat()
            
            update_document(COLLECTIONS['orders'], order_id, data)
            
            return Response({
                'success': True,
                'message': 'Order updated successfully'
            })
    
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
def update_order_status(request, order_id):
    """
    Update order status
    PUT /api/admin/orders/<id>/status
    """
    try:
        new_status = request.data.get('status')
        if not new_status:
            return Response({
                'success': False,
                'error': 'Status is required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Update with correct Firebase field name
        update_document(COLLECTIONS['orders'], order_id, {
            'orderStatus': new_status,  # Changed from 'status' to 'orderStatus'
            'updatedAt': datetime.now().isoformat()  # Changed from 'updated_at'
        })
        
        return Response({
            'success': True,
            'message': f'Order status updated to {new_status}'
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==================== CATEGORIES ====================

@api_view(['GET', 'POST'])
def categories(request):
    """
    List or create categories
    GET/POST /api/admin/categories
    """
    try:
        if request.method == 'GET':
            cats = query_collection(COLLECTIONS['categories'])
            return Response({
                'success': True,
                'data': cats
            })
        
        elif request.method == 'POST':
            data = request.data
            data['created_at'] = datetime.now().isoformat()
            
            doc_id = add_document(COLLECTIONS['categories'], data)
            
            return Response({
                'success': True,
                'data': {
                    'id': doc_id,
                    **data
                }
            }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET', 'PUT', 'DELETE'])
def category_detail(request, category_id):
    """
    Get, update, or delete a category
    GET/PUT/DELETE /api/admin/categories/<id>
    """
    try:
        if request.method == 'GET':
            doc = get_document(COLLECTIONS['categories'], category_id)
            if not doc.exists:
                return Response({
                    'success': False,
                    'error': 'Category not found'
                }, status=status.HTTP_404_NOT_FOUND)
            
            return Response({
                'success': True,
                'data': {'id': doc.id, **doc.to_dict()}
            })
        
        elif request.method == 'PUT':
            data = request.data
            data['updated_at'] = datetime.now().isoformat()
            
            update_document(COLLECTIONS['categories'], category_id, data)
            
            return Response({
                'success': True,
                'message': 'Category updated successfully'
            })
        
        elif request.method == 'DELETE':
            delete_document(COLLECTIONS['categories'], category_id)
            
            return Response({
                'success': True,
                'message': 'Category deleted successfully'
            })
    
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==================== REPORTS & ANALYTICS ====================

@api_view(['GET'])
def sales_report(request):
    """
    Get sales report
    GET /api/admin/reports/sales?start_date=2024-01-01&end_date=2024-12-31
    """
    try:
        start_date = request.GET.get('start_date')
        end_date = request.GET.get('end_date')
        
        orders = query_collection(COLLECTIONS['orders'])
        
        # Filter by date range if provided
        if start_date and end_date:
            orders = [
                o for o in orders
                if o.get('dayKey', '') and start_date <= o.get('dayKey', '') <= end_date
            ]
        
        total_sales = sum(float(o.get('totalFee', 0)) for o in orders)
        total_orders = len(orders)
        
        # Group by order type
        by_type = defaultdict(lambda: {'count': 0, 'revenue': 0})
        for order in orders:
            order_type = order.get('orderType', 'UNKNOWN')
            by_type[order_type]['count'] += 1
            by_type[order_type]['revenue'] += float(order.get('totalFee', 0))
        
        # Group by status
        by_status = defaultdict(int)
        for order in orders:
            by_status[order.get('orderStatus', 'UNKNOWN')] += 1
        
        return Response({
            'success': True,
            'data': {
                'total_sales': total_sales,
                'total_orders': total_orders,
                'average_order_value': total_sales / total_orders if total_orders > 0 else 0,
                'by_type': dict(by_type),
                'by_status': dict(by_status),
            }
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def popular_items_report(request):
    """
    Get popular items report
    GET /api/admin/reports/popular-items?limit=10
    """
    try:
        limit_param = request.GET.get('limit', '10')
        limit = int(limit_param)
        
        orders = query_collection(COLLECTIONS['orders'])
        
        # Count item occurrences
        item_stats = defaultdict(lambda: {'count': 0, 'revenue': 0})
        
        for order in orders:
            order_list = order.get('orderList', [])
            if isinstance(order_list, list):
                for item in order_list:
                    item_name = item.get('menuName', 'Unknown')
                    quantity = item.get('quantity', 1)
                    price = float(item.get('price', 0))
                    
                    item_stats[item_name]['count'] += quantity
                    item_stats[item_name]['revenue'] += quantity * price
        
        # Sort by count and limit
        popular_items = sorted(
            [
                {'name': name, **stats}
                for name, stats in item_stats.items()
            ],
            key=lambda x: x['count'],
            reverse=True
        )[:limit]
        
        return Response({
            'success': True,
            'data': popular_items
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def revenue_trend(request):
    """
    Get revenue trend data for charts
    GET /api/admin/reports/revenue-trend?days=30
    """
    try:
        days_param = request.GET.get('days', '30')
        days = int(days_param)
        
        orders = query_collection(COLLECTIONS['orders'])
        
        # Group revenue by day
        daily_revenue = defaultdict(float)
        daily_orders = defaultdict(int)
        
        for order in orders:
            day_key = order.get('dayKey', '')
            if day_key:
                daily_revenue[day_key] += float(order.get('totalFee', 0))
                daily_orders[day_key] += 1
        
        # Sort by date and get last N days
        sorted_days = sorted(daily_revenue.keys(), reverse=True)[:days]
        sorted_days.reverse()  # Chronological order
        
        trend_data = [
            {
                'date': day,
                'revenue': daily_revenue[day],
                'orders': daily_orders[day]
            }
            for day in sorted_days
        ]
        
        return Response({
            'success': True,
            'data': trend_data
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['GET'])
def category_sales(request):
    """
    Get sales by category
    GET /api/admin/reports/category-sales
    """
    try:
        orders = query_collection(COLLECTIONS['orders'])
        menu_items = query_collection(COLLECTIONS['menu_items'])
        
        # Create a mapping of menu item names to categories
        menu_categories = {}
        for item in menu_items:
            menu_name = item.get('menuName', item.get('name', ''))
            category = item.get('category', item.get('type', 'Other'))
            if menu_name:
                menu_categories[menu_name] = category
        
        # Calculate sales by category
        category_stats = defaultdict(lambda: {'orders': 0, 'revenue': 0, 'count': 0})
        
        for order in orders:
            order_list = order.get('orderList', [])
            if isinstance(order_list, list):
                for item in order_list:
                    item_name = item.get('menuName', '')
                    quantity = item.get('quantity', 1)
                    price = float(item.get('price', 0))
                    
                    # Get category from menu items mapping
                    category = menu_categories.get(item_name, 'Other')
                    
                    category_stats[category]['orders'] += 1
                    category_stats[category]['count'] += quantity
                    category_stats[category]['revenue'] += quantity * price
        
        # Convert to list and calculate growth (mock data for now)
        category_sales_list = [
            {
                'category': category,
                'orders': stats['orders'],
                'revenue': round(stats['revenue'], 2),
                'growth': round((stats['orders'] / max(1, len(orders))) * 100, 1)  # Simple percentage
            }
            for category, stats in category_stats.items()
        ]
        
        # Sort by revenue
        category_sales_list.sort(key=lambda x: x['revenue'], reverse=True)
        
        return Response({
            'success': True,
            'data': category_sales_list
        })
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==================== SETTINGS ====================

@api_view(['GET', 'PUT'])
def settings(request):
    """
    Get or update system settings
    GET/PUT /api/admin/settings
    """
    try:
        if request.method == 'GET':
            settings_docs = query_collection(COLLECTIONS['settings'], limit=1)
            
            if settings_docs:
                return Response({
                    'success': True,
                    'data': settings_docs[0]
                })
            else:
                # Return default settings
                return Response({
                    'success': True,
                    'data': {
                        'restaurant_name': 'Restaurant Management System',
                        'tax_rate': 0.12,
                        'currency': 'PHP',
                        'timezone': 'Asia/Manila'
                    }
                })
        
        elif request.method == 'PUT':
            data = request.data
            data['updated_at'] = datetime.now().isoformat()
            
            # Get existing settings
            settings_docs = query_collection(COLLECTIONS['settings'], limit=1)
            
            if settings_docs:
                # Update existing
                update_document(COLLECTIONS['settings'], settings_docs[0]['id'], data)
            else:
                # Create new
                add_document(COLLECTIONS['settings'], data)
            
            return Response({
                'success': True,
                'message': 'Settings updated successfully'
            })
    
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


# ==================== PROFILE ====================

@api_view(['GET', 'PUT'])
def profile(request):
    """
    Get or update admin profile
    GET/PUT /api/admin/profile
    """
    try:
        # For now, use the first admin user or create a default one
        # In production, this should use authenticated user from request.user
        
        if request.method == 'GET':
            # Get admin users
            admins = query_collection(COLLECTIONS['users'], filters=[('role', '==', 'ADMIN')], limit=1)
            
            if admins:
                admin = admins[0]
                return Response({
                    'success': True,
                    'data': {
                        'id': admin.get('id'),
                        'name': admin.get('fullName', 'Admin User'),
                        'email': admin.get('email', 'admin@restaurant.com'),
                        'phone': admin.get('phoneNumber', ''),
                        'address': admin.get('address', ''),
                        'bio': admin.get('bio', ''),
                        'role': admin.get('role', 'ADMIN'),
                        'avatar': admin.get('avatar', ''),
                        'createdAt': admin.get('createdAt', ''),
                        'lastLogin': admin.get('lastLogin', ''),
                    }
                })
            else:
                # Return default profile
                return Response({
                    'success': True,
                    'data': {
                        'id': 'admin-1',
                        'name': 'Admin User',
                        'email': 'admin@restaurant.com',
                        'phone': '+1 (555) 123-4567',
                        'address': '123 Main St, City, State 12345',
                        'bio': 'Restaurant administrator',
                        'role': 'ADMIN',
                        'avatar': '',
                        'createdAt': datetime.now().isoformat(),
                        'lastLogin': datetime.now().isoformat(),
                    }
                })
        
        elif request.method == 'PUT':
            data = request.data
            
            # Get admin users
            admins = query_collection(COLLECTIONS['users'], filters=[('role', '==', 'ADMIN')], limit=1)
            
            update_data = {
                'fullName': data.get('name'),
                'email': data.get('email'),
                'phoneNumber': data.get('phone'),
                'address': data.get('address'),
                'bio': data.get('bio'),
                'avatar': data.get('avatar'),
                'updatedAt': datetime.now().isoformat()
            }
            
            # Remove None values
            update_data = {k: v for k, v in update_data.items() if v is not None}
            
            if admins:
                # Update existing admin
                update_document(COLLECTIONS['users'], admins[0]['id'], update_data)
                
                # Get updated document
                doc = get_document(COLLECTIONS['users'], admins[0]['id'])
                updated_admin = {'id': doc.id, **doc.to_dict()} if doc.exists else admins[0]
                
                return Response({
                    'success': True,
                    'message': 'Profile updated successfully',
                    'data': {
                        'id': updated_admin.get('id'),
                        'name': updated_admin.get('fullName'),
                        'email': updated_admin.get('email'),
                        'phone': updated_admin.get('phoneNumber'),
                        'address': updated_admin.get('address'),
                        'bio': updated_admin.get('bio'),
                        'role': updated_admin.get('role'),
                        'avatar': updated_admin.get('avatar'),
                    }
                })
            else:
                # Create new admin profile
                new_admin = {
                    'fullName': data.get('name', 'Admin User'),
                    'email': data.get('email', 'admin@restaurant.com'),
                    'phoneNumber': data.get('phone', ''),
                    'address': data.get('address', ''),
                    'bio': data.get('bio', ''),
                    'role': 'ADMIN',
                    'avatar': data.get('avatar', ''),
                    'createdAt': datetime.now().isoformat(),
                    'updatedAt': datetime.now().isoformat(),
                }
                
                admin_id = add_document(COLLECTIONS['users'], new_admin)
                
                return Response({
                    'success': True,
                    'message': 'Profile created successfully',
                    'data': {
                        'id': admin_id,
                        **new_admin
                    }
                })
    
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['PUT'])
def change_password(request):
    """
    Change admin password
    PUT /api/admin/profile/password
    """
    try:
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        
        if not current_password or not new_password:
            return Response({
                'success': False,
                'error': 'Current password and new password are required'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        if len(new_password) < 8:
            return Response({
                'success': False,
                'error': 'Password must be at least 8 characters long'
            }, status=status.HTTP_400_BAD_REQUEST)
        
        # Get admin users
        admins = query_collection(COLLECTIONS['users'], filters=[('role', '==', 'ADMIN')], limit=1)
        
        if not admins:
            return Response({
                'success': False,
                'error': 'Admin user not found'
            }, status=status.HTTP_404_NOT_FOUND)
        
        admin = admins[0]
        
        # Verify current password (you should use proper password hashing)
        # For now, we'll just update the password
        # In production, use bcrypt or similar
        
        hashed_password = hashlib.sha256(new_password.encode()).hexdigest()
        
        update_document(COLLECTIONS['users'], admin['id'], {
            'password': hashed_password,
            'updatedAt': datetime.now().isoformat()
        })
        
        return Response({
            'success': True,
            'message': 'Password changed successfully'
        })
    
    except Exception as e:
        return Response({
            'success': False,
            'error': str(e)
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
