import React from 'react';
import { Card } from '../../common/Card';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { useCart } from '../cart/CartContext';
import { Link } from 'react-router-dom';

export const OrderHistory: React.FC = () => {
  const { getOrders } = useCart();
  const orders = getOrders();

  if (orders.length === 0) return <div style={{ color: THEME.colors.text.tertiary }}>No orders yet.</div>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold" style={{ color: THEME.colors.text.primary }}>Order History</h2>
      <div className="space-y-3">
        {orders.map((o) => (
          <Card key={o.id} padding="md" style={{ backgroundColor: THEME.colors.background.tertiary, borderColor: THEME.colors.border.DEFAULT, color: THEME.colors.text.primary }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium" style={{ color: THEME.colors.text.primary }}>Order #{o.id}</div>
                <div className="text-sm" style={{ color: THEME.colors.text.tertiary }}>{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-sm font-bold" style={{ color: THEME.colors.text.primary }}>${o.total.toFixed(2)}</div>
                <Link to={`/client/track/${o.id}`} className="text-sm" style={{ color: THEME.colors.primary.DEFAULT }}>Track</Link>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
