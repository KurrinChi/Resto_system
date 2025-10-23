import React from 'react';
import {
  LayoutDashboard,
  Users,
  UtensilsCrossed,
  ShoppingCart,
  MapPin,
  Clock,
  BarChart3,
  Settings,
} from 'lucide-react';

// Import page components
import { Dashboard } from '../components/admin/dashboard/Dashboard.tsx';
import { UserManagement } from '../components/admin/users/UserManagement.tsx';
import { MenuItemManagement } from '../components/admin/menu/MenuItemManagement.tsx';
import { OrderManagement } from '../components/admin/orders/OrderManagement.tsx';
import { CustomerTracking } from '../components/admin/tracking/CustomerTracking.tsx';
import { RestaurantAvailability } from '../components/admin/availability/RestaurantAvailability.tsx';
import { ReportsAnalytics } from '../components/admin/reports/ReportsAnalytics.tsx';
import { AdminSettings } from '../components/admin/settings/AdminSettings.tsx';

export interface RouteConfig {
  path: string;
  label: string;
  icon: React.ReactNode;
  component: React.ComponentType;
}

export const adminRoutes: RouteConfig[] = [
  {
    path: '/admin/dashboard',
    label: 'Dashboard',
    icon: <LayoutDashboard className="w-5 h-5" />,
    component: Dashboard,
  },
  {
    path: '/admin/users',
    label: 'User Management',
    icon: <Users className="w-5 h-5" />,
    component: UserManagement,
  },
  {
    path: '/admin/menu',
    label: 'Menu Items',
    icon: <UtensilsCrossed className="w-5 h-5" />,
    component: MenuItemManagement,
  },
  {
    path: '/admin/orders',
    label: 'Orders',
    icon: <ShoppingCart className="w-5 h-5" />,
    component: OrderManagement,
  },
  {
    path: '/admin/tracking',
    label: 'Customer Tracking',
    icon: <MapPin className="w-5 h-5" />,
    component: CustomerTracking,
  },
  {
    path: '/admin/availability',
    label: 'Availability',
    icon: <Clock className="w-5 h-5" />,
    component: RestaurantAvailability,
  },
  {
    path: '/admin/reports',
    label: 'Reports & Analytics',
    icon: <BarChart3 className="w-5 h-5" />,
    component: ReportsAnalytics,
  },
  {
    path: '/admin/settings',
    label: 'Settings',
    icon: <Settings className="w-5 h-5" />,
    component: AdminSettings,
  },
];
