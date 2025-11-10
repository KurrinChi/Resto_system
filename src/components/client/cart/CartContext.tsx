import React from 'react';

type CartItem = {
  id: number | string;
  name: string;
  price: number;
  qty: number;
};

type Order = {
  id: string;
  items: CartItem[];
  total: number;
  type: 'dine-in' | 'delivery' | 'pickup';
  status: 'received' | 'preparing' | 'ready' | 'out_for_delivery' | 'completed';
  createdAt: string;
};

type CartContextType = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  updateQty: (id: CartItem['id'], qty: number) => void;
  removeItem: (id: CartItem['id']) => void;
  clearCart: () => void;
  count: number;
  total: number;
  createOrder: (type: Order['type']) => Order;
  getOrders: () => Order[];
};

const StorageKey = 'rs_cart_v1';
const OrdersKey = 'rs_orders_v1';

const CartContext = React.createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = React.useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(StorageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  React.useEffect(() => {
    try {
      localStorage.setItem(StorageKey, JSON.stringify(items));
    } catch {}
  }, [items]);

  const addItem = (item: Omit<CartItem, 'qty'>, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((p) => p.id === item.id);
      if (found) {
        return prev.map((p) => (p.id === item.id ? { ...p, qty: p.qty + qty } : p));
      }
      return [...prev, { ...item, qty }];
    });
  };

  const updateQty = (id: CartItem['id'], qty: number) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, qty } : p)).filter((p) => p.qty > 0));
  };

  const removeItem = (id: CartItem['id']) => setItems((prev) => prev.filter((p) => p.id !== id));

  const clearCart = () => setItems([]);

  const count = items.reduce((s, i) => s + i.qty, 0);
  const total = items.reduce((s, i) => s + i.qty * i.price, 0);

  const generateId = () => `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

  const createOrder = (type: Order['type']) => {
    const order: Order = {
      id: generateId(),
      items,
      total,
      type,
      status: 'received',
      createdAt: new Date().toISOString(),
    };
    try {
      const raw = localStorage.getItem(OrdersKey);
      const arr: Order[] = raw ? JSON.parse(raw) : [];
      arr.unshift(order);
      localStorage.setItem(OrdersKey, JSON.stringify(arr));
    } catch {}
    clearCart();
    return order;
  };

  const getOrders = (): Order[] => {
    try {
      const raw = localStorage.getItem(OrdersKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  return (
    <CartContext.Provider value={{ items, addItem, updateQty, removeItem, clearCart, count, total, createOrder, getOrders }}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
