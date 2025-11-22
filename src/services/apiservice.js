// Admin API Service for Firebase Backend Integration
import axios from 'axios';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/admin';
console.log('API Base URL:', API_BASE_URL);
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
    getAll: async (role) => {
        const response = await api.get('/users', { params: { role } });
        return response.data;
    },
    getById: async (userId) => {
        const response = await api.get(`/users/${userId}`);
        return response.data;
    },
    create: async (userData) => {
        const response = await api.post('/users/create', userData);
        return response.data;
    },
    update: async (userId, userData) => {
        const response = await api.put(`/users/${userId}`, userData);
        return response.data;
    },
    delete: async (userId) => {
        const response = await api.delete(`/users/${userId}`);
        return response.data;
    },
};
// ==================== Menu Items API ====================
export const menuApi = {
    getAll: async (category) => {
        const response = await api.get('/menu', { params: { category } });
        return response.data;
    },
    getById: async (menuId) => {
        const response = await api.get(`/menu/${menuId}`);
        return response.data;
    },
    create: async (menuData, imageFile) => {
        if (imageFile) {
            const formData = new FormData();
            Object.keys(menuData).forEach(key => {
                if (Array.isArray(menuData[key])) {
                    formData.append(key, JSON.stringify(menuData[key]));
                }
                else if (typeof menuData[key] === 'boolean') {
                    formData.append(key, String(menuData[key]));
                }
                else {
                    formData.append(key, String(menuData[key]));
                }
            });
            formData.append('image', imageFile);
            const response = await api.post('/menu/create', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        }
        else {
            const response = await api.post('/menu/create', menuData);
            return response.data;
        }
    },
    update: async (menuId, menuData, imageFile) => {
        if (imageFile) {
            const formData = new FormData();
            Object.keys(menuData).forEach(key => {
                if (Array.isArray(menuData[key])) {
                    formData.append(key, JSON.stringify(menuData[key]));
                }
                else if (typeof menuData[key] === 'boolean') {
                    formData.append(key, String(menuData[key]));
                }
                else {
                    formData.append(key, String(menuData[key]));
                }
            });
            formData.append('image', imageFile);
            const response = await api.put(`/menu/${menuId}`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });
            return response.data;
        }
        else {
            const response = await api.put(`/menu/${menuId}`, menuData);
            return response.data;
        }
    },
    delete: async (menuId) => {
        const response = await api.delete(`/menu/${menuId}`);
        return response.data;
    },
};
// ==================== Orders API ====================
export const ordersApi = {
    getAll: async (status) => {
        const response = await api.get('/orders', { params: { status } });
        return response.data;
    },
    getById: async (orderId) => {
        const response = await api.get(`/orders/${orderId}`);
        return response.data;
    },
    updateStatus: async (orderId, status) => {
        const response = await api.put(`/orders/${orderId}/status`, { status });
        return response.data;
    },
    update: async (orderId, orderData) => {
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
    create: async (categoryData) => {
        const response = await api.post('/categories', categoryData);
        return response.data;
    },
    update: async (categoryId, categoryData) => {
        const response = await api.put(`/categories/${categoryId}`, categoryData);
        return response.data;
    },
    delete: async (categoryId) => {
        const response = await api.delete(`/categories/${categoryId}`);
        return response.data;
    },
};
// ==================== Reports API ====================
export const reportsApi = {
    getSalesReport: async (params) => {
        const response = await api.get('/reports/sales', { params });
        return response.data;
    },
    getPopularItems: async (params) => {
        const response = await api.get('/reports/popular-items', { params });
        return response.data;
    },
    getRevenueTrend: async (params) => {
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
    update: async (settingsData) => {
        const response = await api.put('/settings', settingsData);
        return response.data;
    },
};
// ==================== Profile API ====================
export const profileApi = {
    get: async () => {
        const response = await api.get('/profile');
        return response.data;
    },
    update: async (profileData) => {
        const response = await api.put('/profile', profileData);
        return response.data;
    },
    changePassword: async (passwordData) => {
        const response = await api.put('/profile/password', passwordData);
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
