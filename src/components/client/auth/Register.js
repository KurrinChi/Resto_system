import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { User as UserIcon, Mail, Lock, ArrowRight } from 'lucide-react';
const UsersKey = 'rs_users_v1';
export const Register = () => {
    const [username, setUsername] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();
    const handleSubmit = (e) => {
        e.preventDefault();
        setError(null);
        if (!username || !email || !password)
            return setError('Please fill all fields');
        try {
            const raw = localStorage.getItem(UsersKey);
            const users = raw ? JSON.parse(raw) : [];
            if (users.find((u) => u.username === username))
                return setError('Username already exists');
            if (users.find((u) => u.email === email))
                return setError('Email already registered');
            const user = { id: Date.now().toString(), username, email, password };
            users.push(user);
            localStorage.setItem(UsersKey, JSON.stringify(users));
            // Simple auto-login by saving current user
            localStorage.setItem('rs_current_user', JSON.stringify(user));
            navigate('/client');
        }
        catch (err) {
            setError('Failed to register');
        }
    };
    return (_jsx("div", { style: { position: 'fixed', inset: 0, overflow: 'auto' }, children: _jsxs("div", { className: "min-h-screen flex", children: [_jsxs("div", { className: "hidden lg:flex w-1/2 relative", style: {
                        backgroundImage: 'url(https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=1200&h=1200&fit=crop)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }, children: [_jsx("div", { className: "absolute inset-0", style: {
                                background: `linear-gradient(135deg, ${THEME.colors.primary.DEFAULT}dd, ${THEME.colors.primary.dark}dd)`
                            } }), _jsxs("div", { className: "relative z-10 w-full flex flex-col justify-center items-center text-center px-12 text-white", children: [_jsx("img", { src: "/logo.png", alt: "Logo", className: "h-24 w-auto mb-4" }), _jsx("h1", { className: "text-3xl font-bold mb-3", children: "Join Us Today!" }), _jsx("p", { className: "text-base opacity-90", children: "Create an account and start ordering delicious food" })] })] }), _jsx("div", { className: "flex-1 flex items-center justify-center px-8 py-12", style: { backgroundColor: '#FFFFFF' }, children: _jsxs("div", { className: "w-full max-w-md", children: [_jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-3xl font-bold mb-2", style: { color: THEME.colors.text.primary }, children: "Create Account" }), _jsx("p", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: "Fill in your details to get started" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", style: { color: THEME.colors.text.secondary }, children: "Username" }), _jsxs("div", { className: "relative", children: [_jsx(UserIcon, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5", style: { color: THEME.colors.text.tertiary } }), _jsx("input", { type: "text", value: username, onChange: (e) => setUsername(e.target.value), placeholder: "Choose a username", className: "w-full pl-11 pr-4 py-3 rounded-lg border outline-none focus:ring-2 transition-all", style: {
                                                            backgroundColor: THEME.colors.background.secondary,
                                                            borderColor: THEME.colors.border.DEFAULT,
                                                            color: THEME.colors.text.primary,
                                                            '--tw-ring-color': THEME.colors.primary.DEFAULT
                                                        }, required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", style: { color: THEME.colors.text.secondary }, children: "Email" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5", style: { color: THEME.colors.text.tertiary } }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "Enter your email", className: "w-full pl-11 pr-4 py-3 rounded-lg border outline-none focus:ring-2 transition-all", style: {
                                                            backgroundColor: THEME.colors.background.secondary,
                                                            borderColor: THEME.colors.border.DEFAULT,
                                                            color: THEME.colors.text.primary,
                                                            '--tw-ring-color': THEME.colors.primary.DEFAULT
                                                        }, required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", style: { color: THEME.colors.text.secondary }, children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5", style: { color: THEME.colors.text.tertiary } }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Create a password", className: "w-full pl-11 pr-4 py-3 rounded-lg border outline-none focus:ring-2 transition-all", style: {
                                                            backgroundColor: THEME.colors.background.secondary,
                                                            borderColor: THEME.colors.border.DEFAULT,
                                                            color: THEME.colors.text.primary,
                                                            '--tw-ring-color': THEME.colors.primary.DEFAULT
                                                        }, required: true })] })] }), error && (_jsx("div", { className: "p-3 rounded-lg text-sm", style: { backgroundColor: '#fee2e2', color: '#dc2626' }, children: error })), _jsxs("button", { type: "submit", className: "w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90", style: {
                                            backgroundColor: THEME.colors.primary.DEFAULT,
                                            color: '#FFFFFF'
                                        }, children: ["Create Account", _jsx(ArrowRight, { className: "w-5 h-5" })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t", style: { borderColor: THEME.colors.border.DEFAULT } }) }), _jsx("div", { className: "relative flex justify-center text-sm", children: _jsx("span", { className: "px-2", style: {
                                                        backgroundColor: THEME.colors.background.primary,
                                                        color: THEME.colors.text.tertiary
                                                    }, children: "Already have an account?" }) })] }), _jsx("button", { type: "button", onClick: () => navigate('/login'), className: "w-full py-3 rounded-lg font-semibold border-2 transition-all hover:border-opacity-80", style: {
                                            borderColor: THEME.colors.primary.DEFAULT,
                                            color: THEME.colors.primary.DEFAULT,
                                            backgroundColor: 'transparent'
                                        }, children: "Sign In Instead" })] })] }) })] }) }));
};
export default Register;
