import React from 'react';
import { Card } from '../../common/Card';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';

export const Favorites: React.FC = () => {
  // Placeholder favorites data (in-memory). You can wire this to a user 'favorites' store later.
  const favs = [
    { id: 1, name: 'Burger Deluxe', price: 8.99 },
    { id: 2, name: 'Classic Pizza', price: 12.5 },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold" style={{ color: THEME.colors.text.primary }}>Favorites</h2>

      {favs.length === 0 && <div style={{ color: THEME.colors.text.tertiary }}>You have no favorites yet.</div>}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {favs.map((f) => (
          <Card key={f.id} padding="md" style={{ backgroundColor: THEME.colors.background.tertiary, borderColor: THEME.colors.border.DEFAULT, color: THEME.colors.text.primary }}>
            <div className="flex items-center justify-between">
              <div style={{ color: THEME.colors.text.primary }} className="font-medium">{f.name}</div>
              <div style={{ color: THEME.colors.text.tertiary }}>${f.price.toFixed(2)}</div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
