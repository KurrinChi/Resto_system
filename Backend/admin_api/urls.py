"""
Admin API URL Configuration
"""
from django.urls import path
from admin_api import views

urlpatterns = [
    # Dashboard
    path('dashboard/stats', views.dashboard_stats, name='dashboard_stats'),
    path('dashboard/charts', views.dashboard_charts, name='dashboard_charts'),
    
    # User Management
    path('users', views.list_users, name='list_users'),
    path('users/create', views.create_user, name='create_user'),
    path('users/<str:user_id>', views.user_detail, name='user_detail'),
    
    # Menu Management
    path('menu', views.list_menu_items, name='list_menu_items'),
    path('menu/create', views.create_menu_item, name='create_menu_item'),
    path('menu/<str:item_id>', views.menu_item_detail, name='menu_item_detail'),
    
    # Order Management
    path('orders', views.list_orders, name='list_orders'),
    path('orders/<str:order_id>', views.order_detail, name='order_detail'),
    path('orders/<str:order_id>/status', views.update_order_status, name='update_order_status'),
    
    # Categories
    path('categories', views.categories, name='categories'),
    path('categories/<str:category_id>', views.category_detail, name='category_detail'),
    
    # Reports & Analytics
    path('reports/sales', views.sales_report, name='sales_report'),
    path('reports/popular-items', views.popular_items_report, name='popular_items_report'),
    path('reports/revenue-trend', views.revenue_trend, name='revenue_trend'),
    path('reports/category-sales', views.category_sales, name='category_sales'),
    
    # Settings
    path('settings', views.settings, name='settings'),
    
    # Profile
    path('profile', views.profile, name='profile'),
    path('profile/password', views.change_password, name='change_password'),
]

