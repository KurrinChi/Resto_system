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
  const [adminUser, setAdminUser] = useState<AdminUser | null>({
    id: '1',
    name: 'Admin User',
    email: 'admin@restauranthub.com',
    role: 'Administrator',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=3b82f6&color=fff',
  });

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
      }
    } catch (error) {
      console.error('Failed to refresh profile:', error);
    }
  };

  // Load profile on mount
  useEffect(() => {
    refreshProfile();
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
