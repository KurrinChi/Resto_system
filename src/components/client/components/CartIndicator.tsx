import React from 'react';
import { useCart } from '../cart/CartContext';
import { ShoppingCart } from 'lucide-react';

export const CartIndicator: React.FC<{ onClick?: () => void }> = ({ onClick }) => {
  const { count } = useCart();

  return (
    <button aria-label="Open cart" onClick={onClick} className="relative p-2 rounded-md transition-colors" style={{ color: '#140302' }}>
      <ShoppingCart className="w-5 h-5" />
      {count > 0 && (
        <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full" style={{ backgroundColor: '#8B0000', color: '#fff' }}>
          {count}
        </span>
      )}
    </button>
  );
};

export default CartIndicator;
