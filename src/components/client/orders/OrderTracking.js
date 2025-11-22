import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useParams } from 'react-router-dom';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { useCart } from '../cart/CartContext';
const OrdersKey = 'rs_orders_v1';
const nextStatus = (s) => {
    switch (s) {
        case 'received':
            return 'preparing';
        case 'preparing':
            return 'ready';
        case 'ready':
            return 'out_for_delivery';
        case 'out_for_delivery':
            return 'completed';
        default:
            return s;
    }
};
export const OrderTracking = () => {
    const { id } = useParams();
    const { getOrders } = useCart();
    const [order, setOrder] = React.useState(null);
    React.useEffect(() => {
        const arr = getOrders();
        const found = arr.find((o) => o.id === id);
        setOrder(found || null);
    }, [id]);
    const advance = () => {
        try {
            const raw = localStorage.getItem(OrdersKey);
            const arr = raw ? JSON.parse(raw) : [];
            const idx = arr.findIndex((o) => o.id === id);
            if (idx === -1)
                return;
            arr[idx].status = nextStatus(arr[idx].status);
            localStorage.setItem(OrdersKey, JSON.stringify(arr));
            setOrder(arr[idx]);
        }
        catch { }
    };
    if (!order)
        return _jsx("div", { style: { color: THEME.colors.text.tertiary }, children: "Order not found" });
    return (_jsxs("div", { className: "space-y-4", children: [_jsxs("h2", { className: "text-2xl font-semibold", style: { color: THEME.colors.text.primary }, children: ["Order #", order.id] }), _jsxs("div", { className: "rounded-lg p-4", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: [_jsxs("div", { className: "mb-3", children: [_jsx("div", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: "Status" }), _jsx("div", { className: "text-lg font-bold", style: { color: THEME.colors.text.primary, textTransform: 'capitalize' }, children: order.status.replace(/_/g, ' ') })] }), _jsxs("div", { className: "text-sm mb-3", style: { color: THEME.colors.text.tertiary }, children: ["Placed: ", new Date(order.createdAt).toLocaleString()] }), _jsx("div", { className: "space-y-2", children: order.items.map((it) => (_jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { style: { color: THEME.colors.text.primary }, children: [it.name, " x", it.qty] }), _jsxs("div", { style: { color: THEME.colors.text.tertiary }, children: ["$", (it.price * it.qty).toFixed(2)] })] }, it.id))) })] }), _jsx("div", { className: "flex gap-2", children: _jsx("button", { onClick: advance, className: "px-4 py-2 rounded-md", style: { backgroundColor: THEME.colors.primary.DEFAULT, color: '#fff' }, children: "Simulate progress" }) })] }));
};
export default OrderTracking;
