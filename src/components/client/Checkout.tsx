import React from 'react';
import { useCart } from './cart/CartContext';
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { CLIENT_THEME as THEME } from '../../constants/clientTheme';
import { useNavigate } from 'react-router-dom';

export const Checkout: React.FC = () => {
  const { total, createOrder } = useCart();
  const [type, setType] = React.useState<'delivery' | 'dine-in' | 'pickup'>('delivery');
  const [address, setAddress] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const handlePlace = () => {
    setError(null);
    if (type === 'delivery' && !address) return setError('Please provide delivery address');
    const order = createOrder(type);
    // Navigate to tracking
    navigate(`/client/track/${order.id}`);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h2 className="text-2xl font-semibold" style={{ color: THEME.colors.text.primary }}>Checkout</h2>

  <Card padding="md" style={{ backgroundColor: THEME.colors.background.tertiary, borderColor: THEME.colors.border.DEFAULT, color: THEME.colors.text.primary }}>
        <div className="space-y-3">
          <div>
            <label className="text-sm" style={{ color: THEME.colors.text.tertiary }}>Order type</label>
            <div className="mt-2 flex gap-2">
              <button onClick={() => setType('delivery')} className={`px-3 py-1 rounded-md ${type === 'delivery' ? 'font-semibold' : ''}`} style={{ backgroundColor: type === 'delivery' ? THEME.colors.background.hover : 'transparent', color: THEME.colors.text.primary }}>Delivery</button>
              <button onClick={() => setType('dine-in')} className={`px-3 py-1 rounded-md ${type === 'dine-in' ? 'font-semibold' : ''}`} style={{ backgroundColor: type === 'dine-in' ? THEME.colors.background.hover : 'transparent', color: THEME.colors.text.primary }}>Dine-in</button>
              <button onClick={() => setType('pickup')} className={`px-3 py-1 rounded-md ${type === 'pickup' ? 'font-semibold' : ''}`} style={{ backgroundColor: type === 'pickup' ? THEME.colors.background.hover : 'transparent', color: THEME.colors.text.primary }}>Pickup</button>
            </div>
          </div>

          {type === 'delivery' && (
            <div>
              <label className="text-sm" style={{ color: THEME.colors.text.tertiary }}>Delivery address</label>
              <input value={address} onChange={(e) => setAddress(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md bg-transparent border" style={{ borderColor: THEME.colors.border.DEFAULT, color: THEME.colors.text.primary }} />
            </div>
          )}

          <div>
            <label className="text-sm" style={{ color: THEME.colors.text.tertiary }}>Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-md bg-transparent border" style={{ borderColor: THEME.colors.border.DEFAULT, color: THEME.colors.text.primary }} />
          </div>

          {error && <div className="text-sm text-red-400">{error}</div>}

          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm" style={{ color: THEME.colors.text.tertiary }}>Total</div>
              <div className="text-xl font-bold" style={{ color: THEME.colors.text.primary }}>${total.toFixed(2)}</div>
            </div>
            <div>
              <Button onClick={handlePlace}>Place Order</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Checkout;
