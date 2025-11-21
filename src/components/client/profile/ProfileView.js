import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { Button } from '../../common/Button';
import { useNavigate } from 'react-router-dom';
export const ProfileView = () => {
    const navigate = useNavigate();
    const user = React.useMemo(() => {
        try {
            const raw = localStorage.getItem('rs_current_user');
            return raw ? JSON.parse(raw) : null;
        }
        catch {
            return null;
        }
    }, []);
    if (!user)
        return _jsx("div", { style: { color: THEME.colors.text.tertiary }, children: "Not signed in." });
    return (_jsxs("div", { className: "space-y-4 max-w-md", children: [_jsx("h2", { className: "text-2xl font-semibold", style: { color: THEME.colors.text.primary }, children: "Profile" }), _jsxs("div", { className: "rounded-lg p-4", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: [_jsxs("div", { className: "mb-3", children: [_jsx("div", { className: "text-lg font-medium", style: { color: THEME.colors.text.primary }, children: user.name || user.username }), _jsx("div", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: user.email })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Button, { onClick: () => navigate('/client/profile/edit'), children: "Edit Profile" }), _jsx(Button, { variant: "danger", onClick: () => {
                                    if (confirm('Are you sure you want to logout?')) {
                                        localStorage.removeItem('rs_current_user');
                                        navigate('/client');
                                    }
                                }, children: "Logout" })] })] })] }));
};
export default ProfileView;
