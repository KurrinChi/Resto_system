// TypeScript interfaces for the application

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'staff' | 'customer';
  status: 'active' | 'inactive' | 'suspended';
  avatar?: string;
  phone?: string;
  dateJoined: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  availability: 'available' | 'out_of_stock' | 'discontinued';
  preparationTime: number; // in minutes
  ingredients?: string[];
}

export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName: string;
  items: OrderItem[];
  status: 'pending' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
  total: number;
  paymentStatus: 'paid' | 'pending' | 'refunded';
  orderDate: string;
  deliveryAddress?: string;
  notes?: string;
}

export interface OrderItem {
  menuItemId: string;
  name: string;
  quantity: number;
  price: number;
  specialInstructions?: string;
}

export interface CustomerTracking {
  orderId: string;
  orderNumber: string;
  customerName: string;
  status: 'preparing' | 'out_for_delivery' | 'delivered';
  estimatedDelivery: string;
  location?: {
    lat: number;
    lng: number;
  };
  driver?: string;
}

export interface RestaurantAvailability {
  id: string;
  dayOfWeek: string;
  openTime: string;
  closeTime: string;
  isOpen: boolean;
}

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}
