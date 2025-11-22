import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { Button } from '../../common/Button';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, User, Edit } from 'lucide-react';
export const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    React.useEffect(() => {
        const loadUser = async () => {
            try {
                const raw = sessionStorage.getItem('rs_current_user') || localStorage.getItem('rs_current_user');
                if (!raw) {
                    setUser(null);
                    return;
                }
                const parsed = JSON.parse(raw);
                if (!parsed.id) {
                    setUser(parsed);
                    return;
                }
                const res = await fetch(`http://localhost:8000/api/auth/user/${parsed.id}/`);
                if (res.ok) {
                    const data = await res.json();
                    setUser(data);
                    // refresh session storage with latest data
                    const merged = { ...parsed, ...data };
                    sessionStorage.setItem('rs_current_user', JSON.stringify(merged));
                    localStorage.setItem('rs_current_user', JSON.stringify(merged));
                }
                else {
                    setUser(parsed);
                }
            }
            catch {
                setUser(null);
            }
            finally {
                setLoading(false);
            }
        };
        loadUser();
    }, []);
    // Listen for address updates
    React.useEffect(() => {
        const handleAddressUpdate = async () => {
            try {
                const raw = sessionStorage.getItem('rs_current_user') || localStorage.getItem('rs_current_user');
                if (!raw)
                    return;
                const parsed = JSON.parse(raw);
                if (!parsed.id)
                    return;
                const res = await fetch(`http://localhost:8000/api/auth/user/${parsed.id}/`);
                if (res.ok) {
                    const data = await res.json();
                    setUser(prev => ({ ...(prev || {}), ...data }));
                    const merged = { ...parsed, ...data };
                    sessionStorage.setItem('rs_current_user', JSON.stringify(merged));
                    localStorage.setItem('rs_current_user', JSON.stringify(merged));
                }
            }
            catch { /* ignore */ }
        };
        window.addEventListener('addressUpdated', handleAddressUpdate);
        return () => window.removeEventListener('addressUpdated', handleAddressUpdate);
    }, []);
    const handleOpenMapModal = () => {
        window.dispatchEvent(new Event('openMapModal'));
    };
    // Removed payment method helper (feature deprecated)
    if (loading) {
        return _jsx("div", { style: { color: THEME.colors.text.tertiary }, children: "Loading profile..." });
    }
    if (!user) {
        return (_jsxs("div", { className: "space-y-4 max-w-xl mx-auto", children: [_jsx("h2", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: "Profile" }), _jsxs("div", { className: "rounded-lg p-6 text-center", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: [_jsx("p", { className: "mb-4", style: { color: THEME.colors.text.tertiary }, children: "You are not logged in." }), _jsx(Button, { onClick: () => navigate('/login'), style: { backgroundColor: THEME.colors.primary.DEFAULT, color: 'white' }, children: "Go to Login" })] })] }));
    }
    const address = user.address || 'No address set';
    const contactNumber = user.contactNumber || user.phoneNumber || user.phone || 'Not set';
    // Removed paymentMethod and gender (deprecated fields)
    const avatar = user.avatar || '';
    return (_jsxs("div", { className: "space-y-6 max-w-4xl mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: "Profile" }), _jsxs(Button, { onClick: () => navigate('/client/profile/edit'), style: { backgroundColor: THEME.colors.primary.DEFAULT, color: 'white' }, children: [_jsx(Edit, { className: "w-4 h-4 mr-2" }), "Edit Profile"] })] }), _jsx("div", { className: "rounded-lg p-6", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: _jsxs("div", { className: "flex items-center gap-6", children: [_jsx("div", { className: "flex-shrink-0", children: avatar ? (_jsx("img", { src: avatar, alt: user.fullName || 'Avatar', className: "w-24 h-24 rounded-full object-cover", style: { border: `3px solid ${THEME.colors.primary.DEFAULT}` } })) : (_jsx("div", { className: "w-24 h-24 rounded-full flex items-center justify-center", style: { backgroundColor: THEME.colors.background.tertiary, border: `3px solid ${THEME.colors.primary.DEFAULT}` }, children: _jsx(User, { className: "w-12 h-12", style: { color: THEME.colors.text.tertiary } }) })) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-2xl font-bold mb-1", style: { color: THEME.colors.text.primary }, children: user.fullName }), _jsx("p", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: user.email || 'No email provided' })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx("div", { className: "rounded-lg p-5", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "p-2 rounded-lg flex-shrink-0", style: { backgroundColor: THEME.colors.primary.DEFAULT + '20' }, children: _jsx(MapPin, { className: "w-5 h-5", style: { color: THEME.colors.primary.DEFAULT } }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h4", { className: "text-sm font-semibold mb-1", style: { color: THEME.colors.text.secondary }, children: "Address" }), _jsx("p", { className: "text-base break-words mb-3", style: { color: THEME.colors.text.primary }, children: address })] })] }) }), _jsx("div", { className: "rounded-lg p-5", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "p-2 rounded-lg flex-shrink-0", style: { backgroundColor: THEME.colors.primary.DEFAULT + '20' }, children: _jsx(Phone, { className: "w-5 h-5", style: { color: THEME.colors.primary.DEFAULT } }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-sm font-semibold mb-1", style: { color: THEME.colors.text.secondary }, children: "Contact Number" }), _jsx("p", { className: "text-base", style: { color: THEME.colors.text.primary }, children: contactNumber })] })] }) })] })] }));
};
export default ProfilePage;
