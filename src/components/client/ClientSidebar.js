import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Menu, ShoppingCart, User, LogOut } from 'lucide-react';
import { THEME } from '../../constants/theme';
import { BRANDING } from '../../constants/branding';
const clientMenu = [
    { path: '/client', label: 'Home', icon: _jsx(Home, { className: "w-5 h-5" }) },
    { path: '/client/menu', label: 'Menu', icon: _jsx(Menu, { className: "w-5 h-5" }) },
    { path: '/client/orders', label: 'Orders', icon: _jsx(ShoppingCart, { className: "w-5 h-5" }) },
    { path: '/client/profile', label: 'Profile', icon: _jsx(User, { className: "w-5 h-5" }) },
];
export const ClientSidebar = () => {
    const [isExpanded, setIsExpanded] = React.useState(true);
    const navigate = useNavigate();
    const handleLogout = () => {
        // Clear any stored user data
        try {
            sessionStorage.removeItem('rs_current_user');
            localStorage.removeItem('rs_current_user');
            localStorage.removeItem('userAddress');
            localStorage.removeItem('orderType');
            localStorage.removeItem('rs_cart_v1');
        }
        catch { }
        // Force full page reload to reset login state
        window.location.href = '/login';
    };
    return (_jsxs("aside", { className: `hidden md:flex md:flex-col will-change-[width] ${isExpanded ? 'w-64' : 'w-20'}`, style: {
            backgroundColor: THEME.colors.background.secondary,
            transition: 'width 0.3s ease',
        }, onMouseEnter: () => setIsExpanded(true), onMouseLeave: () => setIsExpanded(false), children: [_jsx("div", { className: "h-16 flex items-center justify-center px-4", style: { borderBottom: `1px solid ${THEME.colors.border.dark}` }, children: BRANDING.logo.url ? (_jsx("img", { src: BRANDING.logo.url, alt: BRANDING.logo.alt, className: "h-8 w-auto" })) : (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 rounded-lg flex items-center justify-center", style: { background: THEME.colors.primary.DEFAULT }, children: _jsx("span", { className: "text-white font-bold text-sm", children: BRANDING.logo.text.charAt(0) }) }), _jsx("span", { className: "font-semibold text-sm", style: { color: THEME.colors.text.primary, opacity: isExpanded ? 1 : 0 }, children: BRANDING.logo.text })] })) }), _jsx("nav", { className: "flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden", children: clientMenu.map((item) => (_jsxs(NavLink, { to: item.path, end: item.path === '/client', className: ({ isActive }) => `relative flex items-center gap-3 px-3 h-11 rounded-lg ${isActive ? 'text-white font-medium' : 'hover:text-white'} ${!isExpanded && 'justify-center'}`, style: ({ isActive }) => ({
                        backgroundColor: isActive ? THEME.colors.primary.DEFAULT : 'transparent',
                        color: isActive ? THEME.colors.text.primary : THEME.colors.text.secondary,
                        transition: 'all 0.2s ease',
                    }), title: !isExpanded ? item.label : undefined, children: [_jsx("span", { className: "flex-shrink-0", children: item.icon }), isExpanded && _jsx("span", { className: "text-sm font-medium flex-1 truncate", style: { color: THEME.colors.text.primary }, children: item.label })] }, item.path))) }), _jsx("div", { className: "p-3 border-t", style: { borderColor: THEME.colors.border.dark }, children: _jsxs("button", { onClick: handleLogout, className: `w-full flex items-center gap-3 px-3 h-11 rounded-lg hover:bg-opacity-80 transition-all ${!isExpanded && 'justify-center'}`, style: {
                        backgroundColor: 'transparent',
                        color: THEME.colors.text.secondary,
                    }, title: !isExpanded ? 'Logout' : undefined, children: [_jsx(LogOut, { className: "w-5 h-5 flex-shrink-0" }), isExpanded && _jsx("span", { className: "text-sm font-medium flex-1 truncate text-left", style: { color: THEME.colors.text.primary }, children: "Logout" })] }) })] }));
};
export default ClientSidebar;
