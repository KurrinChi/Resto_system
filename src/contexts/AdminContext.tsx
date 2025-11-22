import React, { createContext, useContext, useState, useEffect} from 'react';
import type { AdminUser } from '../types';
import type { ReactNode } from 'react';
import { profileApi } from '../services/apiservice';

interface AdminContextType {
  // Current page tracking
  currentPage: string;
  setCurrentPage: (page: string) => void;
  
  // Admin user data
  adminUser: AdminUser | null;
  setAdminUser: (user: AdminUser | null) => void;
  
  // Profile refresh function
  refreshProfile: () => Promise<void>;
  
  // Mobile menu state
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Initialize adminUser from sessionStorage
  const getInitialUser = (): AdminUser | null => {
    try {
      const storedUser = sessionStorage.getItem('rs_current_user');
      if (storedUser) {
        const user = JSON.parse(storedUser);
        return {
          id: user.id || '1',
          name: user.name || 'Admin User',
          email: user.email || 'admin@restauranthub.com',
          role: user.role || 'Administrator',
          avatar: user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'Admin User')}&background=3b82f6&color=fff`,
        };
      }
    } catch (error) {
      console.error('Error loading user from sessionStorage:', error);
    }
    return {
      id: '1',
      name: 'Admin User',
      email: 'admin@restauranthub.com',
      role: 'Administrator',
      avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff',
    };
  };

  const [adminUser, setAdminUser] = useState<AdminUser | null>(getInitialUser());

  // Function to refresh profile from API
  const refreshProfile = async () => {
    try {
      const response = await profileApi.get();
      console.log('Profile API response:', response);
      
      if (response.success && response.data) {
        const profileData = response.data;
        const updatedUser = {
          id: profileData.id || '1',
          name: profileData.name || 'Admin User',
          email: profileData.email || 'admin@restauranthub.com',
          role: profileData.role || 'Administrator',
          avatar: profileData.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(profileData.name || 'Admin User')}&background=3b82f6&color=fff`,
        };
        console.log('Setting admin user to:', updatedUser);
        setAdminUser(updatedUser);
        
        // Also update sessionStorage to keep it in sync
        sessionStorage.setItem('rs_current_user', JSON.stringify({
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          phoneNumber: profileData.phone || '',
          avatar: updatedUser.avatar,
        }));
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  // Load profile on mount and when sessionStorage changes
  useEffect(() => {
    // Load from sessionStorage first
    const user = getInitialUser();
    setAdminUser(user);
    
    // Then sync with API
    refreshProfile();
    
    // Listen for storage changes (when user logs in/out)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'rs_current_user' && e.newValue) {
        const user = getInitialUser();
        setAdminUser(user);
        refreshProfile();
      }
    };
    
    // Custom event for same-tab storage updates
    const handleCustomStorageChange = () => {
      const user = getInitialUser();
      setAdminUser(user);
      refreshProfile();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('rs_user_updated', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('rs_user_updated', handleCustomStorageChange);
    };
  }, []);

  return (
    <AdminContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        adminUser,
        setAdminUser,
        refreshProfile,
        mobileMenuOpen,
        setMobileMenuOpen,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
