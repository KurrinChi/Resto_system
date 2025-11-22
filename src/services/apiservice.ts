// Admin API Service for Firebase Backend Integration
import axios from 'axios';
import { getSessionUser } from './sessionService';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/admin';

console.log('API Base URL:', API_BASE_URL);

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach request interceptor to always include current session user info / token
api.interceptors.request.use((config) => {
  try {
    const user = getSessionUser();
    if (user) {
      // If backend expects Authorization header when a token exists
      if (user.token) {
        config.headers = {
          ...config.headers,
          Authorization: `Bearer ${user.token}`,
        } as any;
      }

      // Also include a user id header so backend can easily identify the caller
      config.headers = {
        ...config.headers,
        'X-User-Id': user.id,
        'X-User-Name': user.name || (user as any).fullName || (user as any).displayName || undefined,
      } as any;
    }
  } catch (err) {
    // swallow errors to avoid blocking requests
    console.error('apiservice interceptor error', err);
  }
  return config;
}, (error) => Promise.reject(error));

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
  create: async (menuData: any, imageFile?: File) => {
    if (imageFile) {
      const formData = new FormData();
      Object.keys(menuData).forEach(key => {
        if (Array.isArray(menuData[key])) {
          formData.append(key, JSON.stringify(menuData[key]));
        } else if (typeof menuData[key] === 'boolean') {
          formData.append(key, String(menuData[key]));
        } else {
          formData.append(key, String(menuData[key]));
        }
      });
      formData.append('image', imageFile);

      const response = await api.post('/menu/create', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } else {
      const response = await api.post('/menu/create', menuData);
      return response.data;
    }
  },
  update: async (menuId: string, menuData: any, imageFile?: File) => {
    if (imageFile) {
      const formData = new FormData();
      Object.keys(menuData).forEach(key => {
        if (Array.isArray(menuData[key])) {
          formData.append(key, JSON.stringify(menuData[key]));
        } else if (typeof menuData[key] === 'boolean') {
          formData.append(key, String(menuData[key]));
        } else {
          formData.append(key, String(menuData[key]));
        }
      });
      formData.append('image', imageFile);

      const response = await api.put(`/menu/${menuId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      return response.data;
    } else {
      const response = await api.put(`/menu/${menuId}`, menuData);
      return response.data;
    }
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
  create: async (orderData: any) => {
    const response = await api.post('/orders', orderData);
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
  getRevenueTrend: async (params: { days?: number }) => {
    const response = await api.get('/reports/revenue-trend', { params });
    return response.data;
  },
  getCategorySales: async () => {
    const response = await api.get('/reports/category-sales');
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

// ==================== Profile API ====================
export const profileApi = {
  get: async () => {
    const user = (getSessionUser() || {}) as any;
    const response = await api.get('/profile', { params: { userId: user.id, email: user.email } });
    return response.data;
  },
  update: async (profileData: any) => {
    const user = (getSessionUser() || {}) as any;
    const response = await api.put('/profile', { ...profileData, userId: user.id, userEmail: user.email });
    return response.data;
  },
  changePassword: async (passwordData: { current_password: string; new_password: string }) => {
    const user = (getSessionUser() || {}) as any;
    const response = await api.put('/profile/password', { ...passwordData, userId: user.id, userEmail: user.email });
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
  profile: profileApi,
};