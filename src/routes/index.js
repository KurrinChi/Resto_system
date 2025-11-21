import { jsx as _jsx } from "react/jsx-runtime";
import { LayoutDashboard, Users, UtensilsCrossed, ShoppingCart, MapPin, Clock, BarChart3, Settings, } from 'lucide-react';
// Import page components
import { Dashboard } from '../components/admin/dashboard/Dashboard';
import { UserManagement } from '../components/admin/users/UserManagement';
import { MenuItemManagement } from '../components/admin/menu/MenuItemManagement';
import { OrderManagement } from '../components/admin/orders/OrderManagement';
import { CustomerTracking } from '../components/admin/tracking/CustomerTracking';
import { RestaurantAvailability } from '../components/admin/availability/RestaurantAvailability';
import { ReportsAnalytics } from '../components/admin/reports/ReportsAnalytics';
import { AdminSettings } from '../components/admin/settings/AdminSettings';
export const adminRoutes = [
    {
        path: '/admin/dashboard',
        label: 'Dashboard',
        icon: _jsx(LayoutDashboard, { className: "w-5 h-5" }),
        component: Dashboard,
    },
    {
        path: '/admin/users',
        label: 'User Management',
        icon: _jsx(Users, { className: "w-5 h-5" }),
        component: UserManagement,
    },
    {
        path: '/admin/menu',
        label: 'Menu Items',
        icon: _jsx(UtensilsCrossed, { className: "w-5 h-5" }),
        component: MenuItemManagement,
    },
    {
        path: '/admin/orders',
        label: 'Orders',
        icon: _jsx(ShoppingCart, { className: "w-5 h-5" }),
        component: OrderManagement,
    },
    {
        path: '/admin/tracking',
        label: 'Customer Tracking',
        icon: _jsx(MapPin, { className: "w-5 h-5" }),
        component: CustomerTracking,
    },
    {
        path: '/admin/availability',
        label: 'Availability',
        icon: _jsx(Clock, { className: "w-5 h-5" }),
        component: RestaurantAvailability,
    },
    {
        path: '/admin/reports',
        label: 'Reports & Analytics',
        icon: _jsx(BarChart3, { className: "w-5 h-5" }),
        component: ReportsAnalytics,
    },
    {
        path: '/admin/settings',
        label: 'Settings',
        icon: _jsx(Settings, { className: "w-5 h-5" }),
        component: AdminSettings,
    },
];
