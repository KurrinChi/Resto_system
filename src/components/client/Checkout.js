import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useCart } from './cart/CartContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { CLIENT_THEME as THEME } from '../../constants/clientTheme';
import { useNavigate } from 'react-router-dom';
export const Checkout = () => {
    const { total, createOrder } = useCart();
    const [type, setType] = React.useState('delivery');
    const [address, setAddress] = React.useState('');
    const [phone, setPhone] = React.useState('');
    const [error, setError] = React.useState(null);
    const navigate = useNavigate();
    const handlePlace = () => {
        setError(null);
        if (type === 'delivery' && !address)
            return setError('Please provide delivery address');
        const order = createOrder(type);
        // Navigate to tracking
        navigate(`/client/track/${order.id}`);
    };
    return (_jsxs("div", { className: "max-w-2xl mx-auto space-y-6", children: [_jsx("h2", { className: "text-2xl font-semibold", style: { color: THEME.colors.text.primary }, children: "Checkout" }), _jsx(Card, { padding: "md", style: { backgroundColor: THEME.colors.background.tertiary, borderColor: THEME.colors.border.DEFAULT, color: THEME.colors.text.primary }, children: _jsxs("div", { className: "space-y-3", children: [_jsxs("div", { children: [_jsx("label", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: "Order type" }), _jsxs("div", { className: "mt-2 flex gap-2", children: [_jsx("button", { onClick: () => setType('delivery'), className: `px-3 py-1 rounded-md ${type === 'delivery' ? 'font-semibold' : ''}`, style: { backgroundColor: type === 'delivery' ? THEME.colors.background.hover : 'transparent', color: THEME.colors.text.primary }, children: "Delivery" }), _jsx("button", { onClick: () => setType('dine-in'), className: `px-3 py-1 rounded-md ${type === 'dine-in' ? 'font-semibold' : ''}`, style: { backgroundColor: type === 'dine-in' ? THEME.colors.background.hover : 'transparent', color: THEME.colors.text.primary }, children: "Dine-in" }), _jsx("button", { onClick: () => setType('pickup'), className: `px-3 py-1 rounded-md ${type === 'pickup' ? 'font-semibold' : ''}`, style: { backgroundColor: type === 'pickup' ? THEME.colors.background.hover : 'transparent', color: THEME.colors.text.primary }, children: "Pickup" })] })] }), type === 'delivery' && (_jsxs("div", { children: [_jsx("label", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: "Delivery address" }), _jsx("input", { value: address, onChange: (e) => setAddress(e.target.value), className: "mt-1 w-full px-3 py-2 rounded-md bg-transparent border", style: { borderColor: THEME.colors.border.DEFAULT, color: THEME.colors.text.primary } })] })), _jsxs("div", { children: [_jsx("label", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: "Phone" }), _jsx("input", { value: phone, onChange: (e) => setPhone(e.target.value), className: "mt-1 w-full px-3 py-2 rounded-md bg-transparent border", style: { borderColor: THEME.colors.border.DEFAULT, color: THEME.colors.text.primary } })] }), error && _jsx("div", { className: "text-sm text-red-400", children: error }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("div", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: "Total" }), _jsxs("div", { className: "text-xl font-bold", style: { color: THEME.colors.text.primary }, children: ["$", total.toFixed(2)] })] }), _jsx("div", { children: _jsx(Button, { onClick: handlePlace, children: "Place Order" }) })] })] }) })] }));
};
export default Checkout;
