import React from 'react';
import { useCart } from './CartContext';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { useNavigate } from 'react-router-dom';

export const CartPage: React.FC = () => {
  const { items, updateQty, removeItem, total } = useCart();
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold" style={{ color: THEME.colors.text.primary }}>Your Cart</h2>

      <div className="space-y-3">
        {items.length === 0 && <Card padding="md" style={{ backgroundColor: THEME.colors.background.tertiary, borderColor: THEME.colors.border.DEFAULT, color: THEME.colors.text.primary }}><p style={{ color: THEME.colors.text.tertiary }}>Your cart is empty.</p></Card>}
        {items.map((it) => (
          <Card key={it.id} padding="md" style={{ backgroundColor: THEME.colors.background.tertiary, borderColor: THEME.colors.border.DEFAULT, color: THEME.colors.text.primary }}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-lg font-medium" style={{ color: THEME.colors.text.primary }}>{it.name}</div>
                <div className="text-sm" style={{ color: THEME.colors.text.tertiary }}>${it.price.toFixed(2)}</div>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min={1} value={it.qty} onChange={(e) => updateQty(it.id, Number(e.target.value) || 1)} className="w-20 px-2 py-1 rounded-md bg-transparent border" style={{ borderColor: THEME.colors.border.DEFAULT, color: THEME.colors.text.primary }} />
                <Button variant="ghost" onClick={() => removeItem(it.id)}>Remove</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm" style={{ color: THEME.colors.text.tertiary }}>Total</div>
          <div className="text-2xl font-bold" style={{ color: THEME.colors.text.primary }}>${total.toFixed(2)}</div>
        </div>
        <div>
          <Button onClick={() => navigate('/client/checkout')} disabled={items.length === 0}>Proceed to Checkout</Button>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
