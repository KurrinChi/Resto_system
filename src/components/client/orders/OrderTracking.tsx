import React from 'react';
import { useParams } from 'react-router-dom';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { useCart } from '../cart/CartContext';

const OrdersKey = 'rs_orders_v1';

const nextStatus = (s: string) => {
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

export const OrderTracking: React.FC = () => {
  const { id } = useParams();
  const { getOrders } = useCart();
  const [order, setOrder] = React.useState<any | null>(null);

  React.useEffect(() => {
    const arr = getOrders();
    const found = arr.find((o) => o.id === id);
    setOrder(found || null);
  }, [id]);

  const advance = () => {
    try {
      const raw = localStorage.getItem(OrdersKey);
      const arr = raw ? JSON.parse(raw) : [];
      const idx = arr.findIndex((o: any) => o.id === id);
      if (idx === -1) return;
      arr[idx].status = nextStatus(arr[idx].status);
      localStorage.setItem(OrdersKey, JSON.stringify(arr));
      setOrder(arr[idx]);
    } catch {}
  };

  if (!order) return <div style={{ color: THEME.colors.text.tertiary }}>Order not found</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold" style={{ color: THEME.colors.text.primary }}>Order #{order.id}</h2>
      <div className="rounded-lg p-4" style={{ backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }}>
        <div className="mb-3">
          <div className="text-sm" style={{ color: THEME.colors.text.tertiary }}>Status</div>
          <div className="text-lg font-bold" style={{ color: THEME.colors.text.primary, textTransform: 'capitalize' }}>{order.status.replace(/_/g, ' ')}</div>
        </div>

        <div className="text-sm mb-3" style={{ color: THEME.colors.text.tertiary }}>Placed: {new Date(order.createdAt).toLocaleString()}</div>

        <div className="space-y-2">
          {order.items.map((it: any) => (
            <div key={it.id} className="flex items-center justify-between">
              <div style={{ color: THEME.colors.text.primary }}>{it.name} x{it.qty}</div>
              <div style={{ color: THEME.colors.text.tertiary }}>${(it.price * it.qty).toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button onClick={advance} className="px-4 py-2 rounded-md" style={{ backgroundColor: THEME.colors.primary.DEFAULT, color: '#fff' }}>Simulate progress</button>
      </div>
    </div>
  );
};

export default OrderTracking;
