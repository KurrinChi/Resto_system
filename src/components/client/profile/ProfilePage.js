import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { Button } from '../../common/Button';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, CreditCard, Calendar, User, Edit } from 'lucide-react';
export const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = React.useState(null);
    React.useEffect(() => {
        try {
            const raw = localStorage.getItem('rs_current_user');
            let userData = raw ? JSON.parse(raw) : null;
            // If no user found, create a demo user for display
            if (!userData) {
                userData = {
                    id: 'demo-user',
                    name: 'John Doe',
                    email: 'john.doe@example.com',
                    avatar: '',
                    contactNumber: '+63 912 345 6789',
                    paymentMethod: 'gcash',
                    gender: 'male',
                    birthday: '1990-05-15',
                    address: localStorage.getItem('userAddress') || 'Manila, Philippines'
                };
            }
            setUser(userData);
        }
        catch {
            // Fallback demo user
            setUser({
                id: 'demo-user',
                name: 'John Doe',
                email: 'john.doe@example.com',
                avatar: '',
                contactNumber: '+63 912 345 6789',
                paymentMethod: 'gcash',
                gender: 'male',
                birthday: '1990-05-15',
                address: localStorage.getItem('userAddress') || 'Manila, Philippines'
            });
        }
    }, []);
    // Listen for address updates
    React.useEffect(() => {
        const handleAddressUpdate = () => {
            const savedAddress = localStorage.getItem('userAddress');
            if (user) {
                setUser({ ...user, address: savedAddress });
            }
        };
        window.addEventListener('addressUpdated', handleAddressUpdate);
        return () => window.removeEventListener('addressUpdated', handleAddressUpdate);
    }, [user]);
    const handleOpenMapModal = () => {
        window.dispatchEvent(new Event('openMapModal'));
    };
    const getPaymentMethodLabel = (method) => {
        switch (method) {
            case 'cod': return 'Cash on Delivery';
            case 'gcash': return 'GCash';
            case 'paymaya': return 'PayMaya';
            default: return 'Not set';
        }
    };
    if (!user) {
        return _jsx("div", { style: { color: THEME.colors.text.tertiary }, children: "Loading..." });
    }
    const address = user.address || localStorage.getItem('userAddress') || 'No address set';
    const contactNumber = user.contactNumber || user.phone || 'Not set';
    const paymentMethod = user.paymentMethod || 'cod';
    const gender = user.gender || 'Not set';
    const birthday = user.birthday || 'Not set';
    const avatar = user.avatar || '';
    return (_jsxs("div", { className: "space-y-6 max-w-4xl mx-auto", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h2", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: "Profile" }), _jsxs(Button, { onClick: () => navigate('/client/profile/edit'), style: { backgroundColor: THEME.colors.primary.DEFAULT, color: 'white' }, children: [_jsx(Edit, { className: "w-4 h-4 mr-2" }), "Edit Profile"] })] }), _jsx("div", { className: "rounded-lg p-6", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: _jsxs("div", { className: "flex items-center gap-6", children: [_jsx("div", { className: "flex-shrink-0", children: avatar ? (_jsx("img", { src: avatar, alt: user.name, className: "w-24 h-24 rounded-full object-cover", style: { border: `3px solid ${THEME.colors.primary.DEFAULT}` } })) : (_jsx("div", { className: "w-24 h-24 rounded-full flex items-center justify-center", style: { backgroundColor: THEME.colors.background.tertiary, border: `3px solid ${THEME.colors.primary.DEFAULT}` }, children: _jsx(User, { className: "w-12 h-12", style: { color: THEME.colors.text.tertiary } }) })) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-2xl font-bold mb-1", style: { color: THEME.colors.text.primary }, children: user.name || user.username || 'Guest User' }), _jsx("p", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: user.email || 'No email provided' })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx("div", { className: "rounded-lg p-5", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "p-2 rounded-lg flex-shrink-0", style: { backgroundColor: THEME.colors.primary.DEFAULT + '20' }, children: _jsx(MapPin, { className: "w-5 h-5", style: { color: THEME.colors.primary.DEFAULT } }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h4", { className: "text-sm font-semibold mb-1", style: { color: THEME.colors.text.secondary }, children: "Address" }), _jsx("p", { className: "text-base break-words mb-3", style: { color: THEME.colors.text.primary }, children: address }), _jsxs(Button, { variant: "secondary", onClick: handleOpenMapModal, className: "text-sm", style: {
                                                backgroundColor: THEME.colors.background.tertiary,
                                                color: THEME.colors.text.primary,
                                                padding: '0.5rem 1rem'
                                            }, children: [_jsx(MapPin, { className: "w-4 h-4 mr-2" }), "Change Address"] })] })] }) }), _jsx("div", { className: "rounded-lg p-5", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "p-2 rounded-lg flex-shrink-0", style: { backgroundColor: THEME.colors.primary.DEFAULT + '20' }, children: _jsx(Phone, { className: "w-5 h-5", style: { color: THEME.colors.primary.DEFAULT } }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-sm font-semibold mb-1", style: { color: THEME.colors.text.secondary }, children: "Contact Number" }), _jsx("p", { className: "text-base", style: { color: THEME.colors.text.primary }, children: contactNumber })] })] }) }), _jsx("div", { className: "rounded-lg p-5", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "p-2 rounded-lg flex-shrink-0", style: { backgroundColor: THEME.colors.primary.DEFAULT + '20' }, children: _jsx(CreditCard, { className: "w-5 h-5", style: { color: THEME.colors.primary.DEFAULT } }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-sm font-semibold mb-1", style: { color: THEME.colors.text.secondary }, children: "Saved Payment Method" }), _jsx("p", { className: "text-base", style: { color: THEME.colors.text.primary }, children: getPaymentMethodLabel(paymentMethod) })] })] }) }), _jsx("div", { className: "rounded-lg p-5", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "p-2 rounded-lg flex-shrink-0", style: { backgroundColor: THEME.colors.primary.DEFAULT + '20' }, children: _jsx(User, { className: "w-5 h-5", style: { color: THEME.colors.primary.DEFAULT } }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-sm font-semibold mb-1", style: { color: THEME.colors.text.secondary }, children: "Gender" }), _jsx("p", { className: "text-base capitalize", style: { color: THEME.colors.text.primary }, children: gender })] })] }) }), _jsx("div", { className: "rounded-lg p-5 md:col-span-2", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "p-2 rounded-lg flex-shrink-0", style: { backgroundColor: THEME.colors.primary.DEFAULT + '20' }, children: _jsx(Calendar, { className: "w-5 h-5", style: { color: THEME.colors.primary.DEFAULT } }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-sm font-semibold mb-1", style: { color: THEME.colors.text.secondary }, children: "Birthday" }), _jsx("p", { className: "text-base", style: { color: THEME.colors.text.primary }, children: birthday !== 'Not set' ? new Date(birthday).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            }) : birthday })] })] }) })] }), _jsx("div", { className: "flex justify-center pt-4", children: _jsx(Button, { variant: "danger", onClick: () => {
                        if (confirm('Are you sure you want to logout?')) {
                            localStorage.removeItem('rs_current_user');
                            navigate('/client');
                            window.location.reload();
                        }
                    }, style: {
                        backgroundColor: '#ef4444',
                        color: 'white',
                        padding: '0.75rem 2rem'
                    }, children: "Logout" }) })] }));
};
export default ProfilePage;
