import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useState, useEffect } from 'react';
import { profileApi } from '../services/apiservice';
const AdminContext = createContext(undefined);
export const AdminProvider = ({ children }) => {
    const [currentPage, setCurrentPage] = useState('Dashboard');
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [adminUser, setAdminUser] = useState({
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
        }
        catch (error) {
            console.error('Failed to refresh profile:', error);
        }
    };
    // Load profile on mount
    useEffect(() => {
        refreshProfile();
    }, []);
    return (_jsx(AdminContext.Provider, { value: {
            currentPage,
            setCurrentPage,
            adminUser,
            setAdminUser,
            refreshProfile,
            mobileMenuOpen,
            setMobileMenuOpen,
        }, children: children }));
};
export const useAdmin = () => {
    const context = useContext(AdminContext);
    if (context === undefined) {
        throw new Error('useAdmin must be used within an AdminProvider');
    }
    return context;
};
