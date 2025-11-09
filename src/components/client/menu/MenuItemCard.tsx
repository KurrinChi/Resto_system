import React from 'react';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { useCart } from '../cart/CartContext';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';

type Item = {
  id: number | string;
  name: string;
  desc?: string;
  price: number;
  category?: string;
  image?: string;
};

export const MenuItemCard: React.FC<{ item: Item }> = ({ item }) => {
  const { addItem } = useCart();

  return (
    <Card padding="md" className="flex flex-col justify-between" style={{ backgroundColor: THEME.colors.background.tertiary, borderColor: THEME.colors.border.DEFAULT, color: THEME.colors.text.primary }}>
      <div>
        <div className="h-36 rounded-lg mb-3" style={{ background: '#2a1f1a' }}>
          {/* image placeholder */}
        </div>
        <h4 className="text-lg font-medium" style={{ color: THEME.colors.text.primary }}>{item.name}</h4>
        <p className="text-sm mt-1" style={{ color: THEME.colors.text.tertiary }}>{item.desc}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-bold" style={{ color: THEME.colors.text.primary }}>${item.price.toFixed(2)}</span>
        <Button size="sm" onClick={() => addItem({ id: item.id, name: item.name, price: item.price })}>Add</Button>
      </div>
    </Card>
  );
};

export default MenuItemCard;
