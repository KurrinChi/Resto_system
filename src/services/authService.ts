import axios from 'axios';

const BASE_URL = import.meta.env.VITE_BACKEND_API_URL || 'http://localhost:8000';

// Use admin API for Firebase-based auth
const client = axios.create({
  baseURL: `${BASE_URL}/api/admin`,
  headers: {
    'Content-Type': 'application/json',
  },
});

export type AuthResponse = {
  access: string;
  refresh: string;
  user: {
    id: string;
    username: string;
    email: string;
    first_name?: string;
    last_name?: string;
    avatar?: string;
    role?: string;
  };
};

export const authService = {
  login: async (identifier: string, password: string) => {
    try {
      const response = await client.post<{ success: boolean; data?: AuthResponse; error?: string }>('/auth/login', {
        username: identifier,
        password,
      });
      
      if (!response.data.success) {
        const error = new Error(response.data.error || 'Login failed');
        (error as any).response = { data: { error: response.data.error } };
        throw error;
      }
      
      // Transform Firebase response to match expected format
      return {
        access: response.data.data!.access,
        refresh: response.data.data!.refresh,
        user: response.data.data!.user,
      };
    } catch (err: any) {
      // If axios throws an error, preserve the response for error handling
      if (err.response && err.response.data) {
        // Ensure error message is accessible
        if (err.response.data.error && !err.message.includes(err.response.data.error)) {
          err.message = err.response.data.error;
        }
      }
      throw err;
    }
  },
  register: async (payload: {
    username: string;
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
  }) => {
    const response = await client.post<{ success: boolean; data: AuthResponse }>('/auth/register', payload);
    
    if (!response.data.success) {
      throw new Error(response.data.error || 'Registration failed');
    }
    
    // Transform Firebase response to match expected format
    return {
      access: response.data.data.access,
      refresh: response.data.data.refresh,
      user: response.data.data.user,
    };
  },
  createGuestSession: async () => {
    // Guest session can still use simple endpoint
    const response = await axios.post<{ guest_id: string; expires_at: string }>(
      `${BASE_URL}/api/auth/guest/`
    );
    return response.data;
  },
  getCurrentUser: async (userId: string) => {
    try {
      const response = await client.get<{ success: boolean; data?: any; error?: string }>(`/auth/me`, {
        params: { user_id: userId }
      });
      
      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to get user');
      }
      
      return response.data.data;
    } catch (err: any) {
      if (err.response && err.response.data) {
        if (err.response.data.error && !err.message.includes(err.response.data.error)) {
          err.message = err.response.data.error;
        }
      }
      throw err;
    }
  },
};

export const persistSession = (data: AuthResponse) => {
  localStorage.setItem(
    'rs_tokens',
    JSON.stringify({ access: data.access, refresh: data.refresh }),
  );
  localStorage.setItem('rs_current_user', JSON.stringify(data.user));
  localStorage.setItem('rs_user_id', data.user.id); // Store user ID for API calls
  localStorage.removeItem('rs_guest_id');
};

export const clearSession = () => {
  localStorage.removeItem('rs_tokens');
  localStorage.removeItem('rs_current_user');
  localStorage.removeItem('rs_user_id');
  localStorage.removeItem('rs_guest_id');
};

