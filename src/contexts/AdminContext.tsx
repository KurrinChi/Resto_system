import React, { createContext, useContext, useState} from 'react';
import type { AdminUser } from '../types';
import type { ReactNode } from 'react';

interface AdminContextType {
  // Current page tracking
  currentPage: string;
  setCurrentPage: (page: string) => void;
  
  // Admin user data
  adminUser: AdminUser | null;
  setAdminUser: (user: AdminUser | null) => void;
  
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

  return (
    <AdminContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        adminUser,
        setAdminUser,
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
