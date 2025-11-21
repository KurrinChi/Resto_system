import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
const StorageKey = 'rs_cart_v1';
const OrdersKey = 'rs_orders_v1';
const CartContext = React.createContext(undefined);
export const useCart = () => {
    const ctx = React.useContext(CartContext);
    if (!ctx)
        throw new Error('useCart must be used within CartProvider');
    return ctx;
};
export const CartProvider = ({ children }) => {
    const [items, setItems] = React.useState(() => {
        try {
            const raw = localStorage.getItem(StorageKey);
            return raw ? JSON.parse(raw) : [];
        }
        catch {
            return [];
        }
    });
    React.useEffect(() => {
        try {
            localStorage.setItem(StorageKey, JSON.stringify(items));
        }
        catch { }
    }, [items]);
    const addItem = (item, qty = 1) => {
        setItems((prev) => {
            const found = prev.find((p) => p.id === item.id);
            if (found) {
                return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + qty } : p));
            }
            return [...prev, { ...item, qty }];
        });
    };
    const updateQty = (id, qty) => {
        setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)).filter((p) => p.qty > 0));
    };
    const removeItem = (id) => setItems((prev) => prev.filter((p) => p.id !== id));
    const clearCart = () => setItems([]);
    const count = items.reduce((s, i) => s + i.qty, 0);
    const total = items.reduce((s, i) => s + i.qty * i.price, 0);
    const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const createOrder = (type) => {
        const order = {
            id: generateId(),
            items,
            total,
            type,
            status: 'received',
            createdAt: new Date().toISOString(),
        };
        try {
            const raw = localStorage.getItem(OrdersKey);
            const arr = raw ? JSON.parse(raw) : [];
            arr.unshift(order);
            localStorage.setItem(OrdersKey, JSON.stringify(arr));
        }
        catch { }
        clearCart();
        return order;
    };
    const getOrders = () => {
        try {
            const raw = localStorage.getItem(OrdersKey);
            return raw ? JSON.parse(raw) : [];
        }
        catch {
            return [];
        }
    };
    return (_jsx(CartContext.Provider, { value: { items, addItem, updateQty, removeItem, clearCart, count, total, createOrder, getOrders }, children: children }));
};
export default CartContext;
