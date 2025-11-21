import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { Mail, Lock, ArrowRight } from 'lucide-react';
const UsersKey = 'rs_users_v1';
export const Login = () => {
    const [user, setUser] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        const raw = localStorage.getItem(UsersKey);
        const users = raw ? JSON.parse(raw) : [];
        const found = users.find((u) => u.username === user || u.email === user);
        if (!found)
            return setError('User not found');
        if (found.password !== password)
            return setError('Incorrect password');
        localStorage.setItem('rs_current_user', JSON.stringify(found));
        navigate('/client');
    };
    return (_jsx("div", { style: { position: 'fixed', inset: 0, overflow: 'auto' }, children: _jsxs("div", { className: "min-h-screen flex", children: [_jsxs("div", { className: "hidden lg:flex w-1/2 relative", style: {
                        backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=1200&fit=crop)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }, children: [_jsx("div", { className: "absolute inset-0", style: {
                                background: `linear-gradient(135deg, ${THEME.colors.primary.DEFAULT}dd, ${THEME.colors.primary.dark}dd)`
                            } }), _jsxs("div", { className: "relative z-10 w-full flex flex-col justify-center items-center text-center px-12 text-white", children: [_jsx("img", { src: "/logo.png", alt: "Logo", className: "h-24 w-auto mb-4" }), _jsx("h1", { className: "text-3xl font-bold mb-3", children: "Sili & Sarsa" }), _jsx("p", { className: "text-base opacity-90", children: "Sign in to continue your culinary journey" })] })] }), _jsx("div", { className: "flex-1 flex items-center justify-center px-8 py-12", style: { backgroundColor: '#FFFFFF' }, children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-3xl font-bold mb-2", style: { color: THEME.colors.text.primary }, children: "Sign In" }), _jsx("p", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: "Enter your credentials to access your account" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", style: { color: THEME.colors.text.secondary }, children: "Username or Email" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5", style: { color: THEME.colors.text.tertiary } }), _jsx("input", { type: "text", value: user, onChange: (e) => setUser(e.target.value), placeholder: "Enter your username or email", className: "w-full pl-11 pr-4 py-3 rounded-lg border outline-none focus:ring-2 transition-all", style: {
                                                            backgroundColor: THEME.colors.background.secondary,
                                                            borderColor: THEME.colors.border.DEFAULT,
                                                            color: THEME.colors.text.primary,
                                                            '--tw-ring-color': THEME.colors.primary.DEFAULT
                                                        }, required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", style: { color: THEME.colors.text.secondary }, children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5", style: { color: THEME.colors.text.tertiary } }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Enter your password", className: "w-full pl-11 pr-4 py-3 rounded-lg border outline-none focus:ring-2 transition-all", style: {
                                                            backgroundColor: THEME.colors.background.secondary,
                                                            borderColor: THEME.colors.border.DEFAULT,
                                                            color: THEME.colors.text.primary,
                                                            '--tw-ring-color': THEME.colors.primary.DEFAULT
                                                        }, required: true })] })] }), error && (_jsx("div", { className: "p-3 rounded-lg text-sm", style: { backgroundColor: '#fee2e2', color: '#dc2626' }, children: error })), _jsxs("button", { type: "submit", className: "w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90", style: {
                                            backgroundColor: THEME.colors.primary.DEFAULT,
                                            color: '#FFFFFF'
                                        }, children: ["Sign In", _jsx(ArrowRight, { className: "w-5 h-5" })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t", style: { borderColor: THEME.colors.border.DEFAULT } }) }), _jsx("div", { className: "relative flex justify-center text-sm", children: _jsx("span", { className: "px-2", style: {
                                                        backgroundColor: THEME.colors.background.primary,
                                                        color: THEME.colors.text.tertiary
                                                    }, children: "Don't have an account?" }) })] }), _jsx("button", { type: "button", onClick: () => navigate('/register'), className: "w-full py-3 rounded-lg font-semibold border-2 transition-all hover:border-opacity-80", style: {
                                            borderColor: THEME.colors.primary.DEFAULT,
                                            color: THEME.colors.primary.DEFAULT,
                                            backgroundColor: 'transparent'
                                        }, children: "Create an Account" })] })] }) })] }) }));
};
export default Login;
