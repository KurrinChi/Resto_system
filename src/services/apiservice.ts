// Admin API Service for Firebase Backend Integration
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/admin';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ==================== Dashboard API ====================
export const dashboardApi = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
  },
  getCharts: async () => {
    const response = await api.get('/dashboard/charts');
    return response.data;
  },
};

// ==================== Users API ====================
export const usersApi = {
  getAll: async (role?: string) => {
    const response = await api.get('/users', { params: { role } });
    return response.data;
  },
  getById: async (userId: string) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },
  create: async (userData: any) => {
    const response = await api.post('/users/create', userData);
    return response.data;
  },
  update: async (userId: string, userData: any) => {
    const response = await api.put(`/users/${userId}`, userData);
    return response.data;
  },
  delete: async (userId: string) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },
};

// ==================== Menu Items API ====================
export const menuApi = {
  getAll: async (category?: string) => {
    const response = await api.get('/menu', { params: { category } });
    return response.data;
  },
  getById: async (menuId: string) => {
    const response = await api.get(`/menu/${menuId}`);
    return response.data;
  },
  create: async (menuData: any) => {
    const response = await api.post('/menu/create', menuData);
    return response.data;
  },
  update: async (menuId: string, menuData: any) => {
    const response = await api.put(`/menu/${menuId}`, menuData);
    return response.data;
  },
  delete: async (menuId: string) => {
    const response = await api.delete(`/menu/${menuId}`);
    return response.data;
  },
};

// ==================== Orders API ====================
export const ordersApi = {
  getAll: async (status?: string) => {
    const response = await api.get('/orders', { params: { status } });
    return response.data;
  },
  getById: async (orderId: string) => {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  },
  updateStatus: async (orderId: string, status: string) => {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  },
  update: async (orderId: string, orderData: any) => {
    const response = await api.put(`/orders/${orderId}`, orderData);
    return response.data;
  },
};

// ==================== Categories API ====================
export const categoriesApi = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  create: async (categoryData: any) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },
  update: async (categoryId: string, categoryData: any) => {
    const response = await api.put(`/categories/${categoryId}`, categoryData);
    return response.data;
  },
  delete: async (categoryId: string) => {
    const response = await api.delete(`/categories/${categoryId}`);
    return response.data;
  },
};

// ==================== Reports API ====================
export const reportsApi = {
  getSalesReport: async (params: { start_date?: string; end_date?: string }) => {
    const response = await api.get('/reports/sales', { params });
    return response.data;
  },
  getPopularItems: async (params: { limit?: number }) => {
    const response = await api.get('/reports/popular-items', { params });
    return response.data;
  },
};

// ==================== Settings API ====================
export const settingsApi = {
  get: async () => {
    const response = await api.get('/settings');
    return response.data;
  },
  update: async (settingsData: any) => {
    const response = await api.put('/settings', settingsData);
    return response.data;
  },
};

// Export all APIs
export default {
  dashboard: dashboardApi,
  users: usersApi,
  menu: menuApi,
  orders: ordersApi,
  categories: categoriesApi,
  reports: reportsApi,
  settings: settingsApi,
};