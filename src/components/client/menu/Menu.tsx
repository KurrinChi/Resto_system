import React from 'react';
import { MenuItemCard } from './MenuItemCard';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';

const sampleMenu = [
  { id: 1, name: 'Burger Deluxe', price: 8.99, desc: 'Juicy beef patty with cheese', category: 'Burgers' },
  { id: 2, name: 'Classic Pizza', price: 12.5, desc: 'Tomato, mozzarella, basil', category: 'Pizza' },
  { id: 3, name: 'Caesar Salad', price: 7.2, desc: 'Fresh romaine, parmesan', category: 'Salads' },
  { id: 4, name: 'Pasta Carbonara', price: 11.3, desc: 'Creamy sauce, pancetta', category: 'Pasta' },
  { id: 5, name: 'Veggie Wrap', price: 6.5, desc: 'Grilled veg, hummus', category: 'Wraps' },
];

const categories = ['All', 'Burgers', 'Pizza', 'Salads', 'Pasta', 'Wraps'];

export const Menu: React.FC = () => {
  const [filter, setFilter] = React.useState('All');

  const items = filter === 'All' ? sampleMenu : sampleMenu.filter((m) => m.category === filter);

  return (
    <div className="space-y-6">
      <div className="rounded-3xl p-4" style={{ backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }}>
        <h2 className="text-xl font-semibold" style={{ color: THEME.colors.text.primary }}>Menu</h2>
        <div className="mt-3 flex gap-2 flex-wrap">
          {categories.map((c) => (
            <button key={c} onClick={() => setFilter(c)} className={`px-3 py-1 rounded-full text-sm ${filter === c ? 'font-semibold' : ''}`} style={{ backgroundColor: filter === c ? THEME.colors.background.hover : 'transparent', color: THEME.colors.text.primary }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item) => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
};

export default Menu;
