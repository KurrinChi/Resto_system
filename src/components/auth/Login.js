import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CLIENT_THEME as THEME } from '../../constants/clientTheme';
import { Mail, Lock, ArrowRight } from 'lucide-react';
export const Login = () => {
    const [user, setUser] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [error, setError] = React.useState(null);
    const [loading, setLoading] = React.useState(false);
    const navigate = useNavigate();
    const [sessionUser, setSessionUser] = React.useState(null);
    const [checkingSession, setCheckingSession] = React.useState(true);
    // If a session exists, offer to continue or switch accounts instead of auto-redirecting
    React.useEffect(() => {
        try {
            const raw = sessionStorage.getItem('rs_current_user') || localStorage.getItem('rs_current_user');
            setSessionUser(raw ? JSON.parse(raw) : null);
        }
        catch {
            setSessionUser(null);
        }
        finally {
            setCheckingSession(false);
        }
    }, []);
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setLoading(true);
        // Basic validation
        if (!user.trim() || !password.trim()) {
            setError('Please fill in all fields');
            setLoading(false);
            return;
        }
        try {
            const response = await fetch('http://localhost:8000/api/auth/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    email: user,
                    password: password,
                }),
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.error || 'Login failed. Please try again.');
                setLoading(false);
                return;
            }
            if (data.success) {
                // Build session user object from response (with fallbacks)
                const sessionUser = {
                    id: data.id || data.userId || `user_${Date.now()}`,
                    name: data.name || data.fullName || data.username || user,
                    email: data.email || user,
                    role: data.role || 'Customer',
                    phoneNumber: data.phoneNumber || data.phone || '',
                    avatar: data.avatar || ''
                };
                try {
                    sessionStorage.setItem('rs_current_user', JSON.stringify(sessionUser));
                    // Keep localStorage for legacy components that still read it (optional)
                    localStorage.setItem('rs_current_user', JSON.stringify(sessionUser));
                }
                catch (storageErr) {
                    console.warn('Failed to persist session user:', storageErr);
                }
                // Route based on role
                if (sessionUser.role === 'ADMIN') {
                    navigate('/admin');
                }
                else if (sessionUser.role === 'Customer') {
                    navigate('/client');
                }
                else {
                    setError('Invalid user role');
                }
            }
            else {
                setError('Login failed. Please check your credentials.');
            }
        }
        catch (err) {
            console.error('Login error:', err);
            setError('Unable to connect to server. Please try again later.');
        }
        finally {
            setLoading(false);
        }
    };
    return (_jsx("div", { style: { position: 'fixed', inset: 0, overflow: 'auto' }, children: _jsxs("div", { className: "min-h-screen flex", children: [_jsxs("div", { className: "hidden lg:flex w-1/2 relative", style: {
                        backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200&h=1200&fit=crop)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }, children: [_jsx("div", { className: "absolute inset-0", style: {
                                background: `linear-gradient(135deg, ${THEME.colors.primary.DEFAULT}dd, ${THEME.colors.primary.dark}dd)`
                            } }), _jsxs("div", { className: "relative z-10 w-full flex flex-col justify-center items-center text-center px-12 text-white", children: [_jsx("img", { src: "/logo.png", alt: "Logo", className: "h-24 w-auto mb-4" }), _jsx("h1", { className: "text-3xl font-bold mb-3", children: "Sili & Sarsa" }), _jsx("p", { className: "text-base opacity-90", children: "Sign in to continue your culinary journey" })] })] }), _jsx("div", { className: "flex-1 flex items-center justify-center px-8 py-12", style: { backgroundColor: '#FFFFFF' }, children: _jsxs("div", { className: "w-full max-w-md", children: [!checkingSession && sessionUser && (_jsxs("div", { className: "mb-6 rounded-lg p-4", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: [_jsxs("div", { className: "mb-3", children: [_jsx("div", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: "You are signed in as" }), _jsxs("div", { className: "text-base font-medium", style: { color: THEME.colors.text.primary }, children: [sessionUser.name || sessionUser.email, " (", sessionUser.role, ")"] })] }), _jsxs("div", { className: "flex gap-2", children: [_jsx("button", { type: "button", onClick: () => {
                                                    if (sessionUser.role === 'Admin')
                                                        navigate('/admin');
                                                    else
                                                        navigate('/client');
                                                }, className: "px-4 py-2 rounded-lg font-semibold", style: { backgroundColor: THEME.colors.primary.DEFAULT, color: '#fff' }, children: "Continue" }), _jsx("button", { type: "button", onClick: () => {
                                                    try {
                                                        sessionStorage.removeItem('rs_current_user');
                                                        localStorage.removeItem('rs_current_user');
                                                    }
                                                    catch { }
                                                    setSessionUser(null);
                                                }, className: "px-4 py-2 rounded-lg font-semibold border", style: {
                                                    backgroundColor: THEME.colors.background.primary,
                                                    borderColor: THEME.colors.border.DEFAULT,
                                                    color: THEME.colors.text.primary
                                                }, children: "Switch account" })] })] })), _jsxs("div", { className: "mb-8", children: [_jsx("h2", { className: "text-3xl font-bold mb-2", style: { color: THEME.colors.text.primary }, children: "Sign In" }), _jsx("p", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: "Enter your credentials to access your account" })] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", style: { color: THEME.colors.text.secondary }, children: "Email" }), _jsxs("div", { className: "relative", children: [_jsx(Mail, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5", style: { color: THEME.colors.text.tertiary } }), _jsx("input", { type: "email", value: user, onChange: (e) => setUser(e.target.value), placeholder: "Enter your email", className: "w-full pl-11 pr-4 py-3 rounded-lg border outline-none focus:ring-2 transition-all", style: {
                                                            backgroundColor: THEME.colors.background.secondary,
                                                            borderColor: THEME.colors.border.DEFAULT,
                                                            color: THEME.colors.text.primary,
                                                            '--tw-ring-color': THEME.colors.primary.DEFAULT
                                                        }, required: true })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", style: { color: THEME.colors.text.secondary }, children: "Password" }), _jsxs("div", { className: "relative", children: [_jsx(Lock, { className: "absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5", style: { color: THEME.colors.text.tertiary } }), _jsx("input", { type: "password", value: password, onChange: (e) => setPassword(e.target.value), placeholder: "Enter your password", className: "w-full pl-11 pr-4 py-3 rounded-lg border outline-none focus:ring-2 transition-all", style: {
                                                            backgroundColor: THEME.colors.background.secondary,
                                                            borderColor: THEME.colors.border.DEFAULT,
                                                            color: THEME.colors.text.primary,
                                                            '--tw-ring-color': THEME.colors.primary.DEFAULT
                                                        }, required: true })] })] }), error && (_jsx("div", { className: "p-3 rounded-lg text-sm", style: { backgroundColor: '#fee2e2', color: '#dc2626' }, children: error })), _jsxs("button", { type: "submit", disabled: loading, className: "w-full py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 disabled:cursor-not-allowed", style: {
                                            backgroundColor: THEME.colors.primary.DEFAULT,
                                            color: '#FFFFFF'
                                        }, children: [loading ? 'Signing in...' : 'Sign In', !loading && _jsx(ArrowRight, { className: "w-5 h-5" })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx("div", { className: "w-full border-t", style: { borderColor: THEME.colors.border.DEFAULT } }) }), _jsx("div", { className: "relative flex justify-center text-sm", children: _jsx("span", { className: "px-2", style: {
                                                        backgroundColor: THEME.colors.background.primary,
                                                        color: THEME.colors.text.tertiary
                                                    }, children: "Don't have an account?" }) })] }), _jsx("button", { type: "button", onClick: () => navigate('/register'), className: "w-full py-3 rounded-lg font-semibold border-2 transition-all hover:border-opacity-80", style: {
                                            borderColor: THEME.colors.primary.DEFAULT,
                                            color: THEME.colors.primary.DEFAULT,
                                            backgroundColor: 'transparent'
                                        }, children: "Create an Account" })] })] }) })] }) }));
};
export default Login;
