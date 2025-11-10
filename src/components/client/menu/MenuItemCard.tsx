import React from 'react';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Heart } from 'lucide-react';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';

const PLACEHOLDER_IMG = new URL('../../../assets/placeholder.png', import.meta.url).href;

type Item = {
  id: number | string;
  name: string;
  desc?: string;
  price: number;
  category?: string;
  image?: string;
  isBestSeller?: boolean;
  isNewOffer?: boolean;
};

type MenuItemCardProps = {
  item: Item;
  onAddToOrder?: (item: { id: number | string; name: string; price: number }) => void;
  onToggleFavorite?: (itemId: number | string) => void;
  isFavorite?: boolean;
  index?: number;
};

export const MenuItemCard: React.FC<MenuItemCardProps> = ({ item, onAddToOrder, onToggleFavorite, isFavorite = false, index = 0 }) => {
  const handleAdd = () => {
    if (onAddToOrder) {
      onAddToOrder({ id: item.id, name: item.name, price: item.price });
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onToggleFavorite) {
      onToggleFavorite(item.id);
    }
  };

  return (
    <Card 
      padding="md" 
      className="flex flex-col justify-between menu-card-hover-zoom" 
      style={{ 
        backgroundColor: THEME.colors.background.tertiary, 
        borderColor: THEME.colors.border.DEFAULT, 
        color: THEME.colors.text.primary,
        animation: `fadeInUp 0.5s ease-in-out forwards`,
        animationDelay: `${index * 100}ms`,
        opacity: 0
      }}
    >
      <div>
        <div className="h-36 rounded-lg mb-3 relative overflow-hidden">
          <img 
            src={item.image || PLACEHOLDER_IMG} 
            alt={item.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = PLACEHOLDER_IMG;
            }}
          />
          {/* Heart Icon */}
          {onToggleFavorite && (
            <button
              onClick={handleToggleFavorite}
              className="absolute top-2 right-2 p-1.5 rounded-full transition-all"
              style={{ 
                backgroundColor: 'rgba(255,255,255,0.9)',
                border: isFavorite ? '2px solid #ef4444' : '2px solid transparent'
              }}
            >
              <Heart 
                className="w-4 h-4 transition-colors" 
                style={{ color: isFavorite ? '#ef4444' : '#9ca3af' }}
                fill={isFavorite ? '#ef4444' : 'none'}
              />
            </button>
          )}
          {item.isBestSeller && (
            <span className="absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold" style={{ backgroundColor: THEME.colors.primary.DEFAULT, color: 'white' }}>
              Best Seller
            </span>
          )}
          {item.isNewOffer && (
            <span className="absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-semibold bg-green-600 text-white">
              New
            </span>
          )}
        </div>
        <h4 className="text-lg font-medium" style={{ color: THEME.colors.text.primary }}>{item.name}</h4>
        <p className="text-sm mt-1" style={{ color: THEME.colors.text.tertiary }}>{item.desc}</p>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <span className="text-lg font-bold" style={{ color: THEME.colors.text.primary }}>₱{item.price.toFixed(2)}</span>
        <Button 
          size="sm" 
          onClick={handleAdd}
          style={{ backgroundColor: THEME.colors.primary.DEFAULT, color: '#FFFFFF' }}
        >
          Add
        </Button>
      </div>
    </Card>
  );
};

export default MenuItemCard;
