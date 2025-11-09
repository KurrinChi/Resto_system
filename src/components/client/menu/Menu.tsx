import React from 'react';
import { MenuItemCard } from './MenuItemCard';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../common/Button';

const PLACEHOLDER_IMG = new URL('../../../assets/placeholder.png', import.meta.url).href;

const sampleMenu = [
  { id: 1, name: 'Burger Deluxe', price: 8.99, desc: 'Juicy beef patty with cheese', category: 'Burgers', isBestSeller: true, isNewOffer: false },
  { id: 2, name: 'Classic Pizza', price: 12.5, desc: 'Tomato, mozzarella, basil', category: 'Pizza', isBestSeller: false, isNewOffer: true },
  { id: 3, name: 'Caesar Salad', price: 7.2, desc: 'Fresh romaine, parmesan', category: 'Salads', isBestSeller: false, isNewOffer: false },
  { id: 4, name: 'Pasta Carbonara', price: 11.3, desc: 'Creamy sauce, pancetta', category: 'Pasta', isBestSeller: true, isNewOffer: false },
  { id: 5, name: 'Veggie Wrap', price: 6.5, desc: 'Grilled veg, hummus', category: 'Wraps', isBestSeller: false, isNewOffer: true },
  { id: 6, name: 'Chicken Wings', price: 9.99, desc: 'Spicy buffalo wings', category: 'Burgers', isBestSeller: true, isNewOffer: false },
  { id: 7, name: 'Margherita Pizza', price: 10.99, desc: 'Fresh mozzarella and basil', category: 'Pizza', isBestSeller: false, isNewOffer: false },
  { id: 8, name: 'Greek Salad', price: 8.5, desc: 'Feta, olives, cucumber', category: 'Salads', isBestSeller: false, isNewOffer: true },
];

const categories = ['All', 'Burgers', 'Pizza', 'Salads', 'Pasta', 'Wraps'];

type OrderItem = {
  id: number | string;
  name: string;
  price: number;
  quantity: number;
};

export const Menu: React.FC = () => {
  const [filter, setFilter] = React.useState('All');
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 20]);
  const [showDiscounts, setShowDiscounts] = React.useState(false);
  const [showBestSellers, setShowBestSellers] = React.useState(false);
  const [showNewOffers, setShowNewOffers] = React.useState(false);
  const [orderType, setOrderType] = React.useState<'delivery' | 'pickup'>('delivery');
  const [orderItems, setOrderItems] = React.useState<OrderItem[]>([]);

  // Filter items based on all criteria
  let filteredItems = filter === 'All' ? sampleMenu : sampleMenu.filter((m) => m.category === filter);
  
  // Apply price range filter
  filteredItems = filteredItems.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);
  
  // Apply checkbox filters
  if (showBestSellers) {
    filteredItems = filteredItems.filter(item => item.isBestSeller);
  }
  if (showNewOffers) {
    filteredItems = filteredItems.filter(item => item.isNewOffer);
  }

  const addToOrder = (item: { id: number | string; name: string; price: number }) => {
    setOrderItems(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: number | string, delta: number) => {
    setOrderItems(prev => {
      const updated = prev.map(item => 
        item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
      ).filter(item => item.quantity > 0);
      return updated;
    });
  };

  const removeItem = (id: number | string) => {
    setOrderItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = orderItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const smallOrderFee = subtotal < 109 ? 20 : 0;
  const deliveryFee = orderType === 'delivery' ? 74 : 0;
  const serviceFee = subtotal * 0.05;
  const total = subtotal + smallOrderFee + deliveryFee + serviceFee;

  return (
    <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 h-auto lg:h-[calc(100vh-8rem)]">
      {/* Left Panel - Filters */}
      <div className="w-full lg:w-64 flex-shrink-0 flex flex-col overflow-hidden">
        <div className="flex flex-col h-auto lg:h-full overflow-y-auto rounded-2xl p-4" style={{ backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }}>
          <h3 className="text-lg font-semibold mb-4 flex-shrink-0" style={{ color: THEME.colors.text.primary }}>Filters</h3>
          
          {/* Price Range */}
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2" style={{ color: THEME.colors.text.primary }}>
              Price Range
            </label>
            <div className="space-y-2">
              <input
                type="range"
                min="0"
                max="20"
                step="0.5"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([0, parseFloat(e.target.value)])}
                className="w-full"
              />
              <div className="flex justify-between text-xs" style={{ color: THEME.colors.text.tertiary }}>
                <span>₱{priceRange[0]}</span>
                <span>₱{priceRange[1]}</span>
              </div>
            </div>
          </div>

          {/* Discounts */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showDiscounts}
                onChange={(e) => setShowDiscounts(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm" style={{ color: THEME.colors.text.primary }}>Discounts</span>
            </label>
          </div>

          {/* Best Sellers */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showBestSellers}
                onChange={(e) => setShowBestSellers(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm" style={{ color: THEME.colors.text.primary }}>Best Sellers</span>
            </label>
          </div>

          {/* New Offers */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showNewOffers}
                onChange={(e) => setShowNewOffers(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm" style={{ color: THEME.colors.text.primary }}>New Offers</span>
            </label>
          </div>
        </div>
      </div>

      {/* Center Panel - Menu Items */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-[400px] lg:min-h-0">
        <div className="flex-shrink-0 rounded-2xl p-4" style={{ backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }}>
          <h2 className="text-xl font-semibold" style={{ color: THEME.colors.text.primary }}>Menu</h2>
          <div className="mt-3 flex gap-2 flex-wrap">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3 py-1 rounded-full text-sm ${filter === c ? 'font-semibold' : ''}`}
                style={{
                  backgroundColor: filter === c ? THEME.colors.background.hover : 'transparent',
                  color: THEME.colors.text.primary
                }}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mt-6 pr-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <MenuItemCard key={item.id} item={item} onAddToOrder={addToOrder} />
            ))}
          </div>
        </div>
      </div>

      {/* Right Panel - Order Summary */}
      <div className="w-full lg:w-80 flex-shrink-0 flex flex-col">
        <div className="flex flex-col h-auto lg:h-full rounded-2xl p-4" style={{ backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }}>
          {/* Header - Fixed at top */}
          <div className="flex-shrink-0">
            <h3 className="text-lg font-semibold mb-4" style={{ color: THEME.colors.text.primary }}>Your Order</h3>
            
            {/* Delivery/Pickup Toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setOrderType('delivery')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors`}
                style={{
                  backgroundColor: orderType === 'delivery' ? THEME.colors.primary.DEFAULT : THEME.colors.background.tertiary,
                  color: orderType === 'delivery' ? 'white' : THEME.colors.text.primary
                }}
              >
                Delivery
              </button>
              <button
                onClick={() => setOrderType('pickup')}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors`}
                style={{
                  backgroundColor: orderType === 'pickup' ? THEME.colors.primary.DEFAULT : THEME.colors.background.tertiary,
                  color: orderType === 'pickup' ? 'white' : THEME.colors.text.primary
                }}
              >
                Pick-up
              </button>
            </div>
          </div>

          {/* Order Items - Scrollable middle section */}
          <div className="flex-1 overflow-y-auto pr-2 mb-4 max-h-[300px] lg:max-h-none">
            <div className="space-y-3">
              {orderItems.length === 0 ? (
                <p className="text-sm text-center py-8" style={{ color: THEME.colors.text.tertiary }}>
                  No items in order
                </p>
              ) : (
                orderItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-2 p-2 rounded-lg"
                    style={{ backgroundColor: THEME.colors.background.tertiary }}
                  >
                    <div className="flex-1">
                      <p className="text-sm font-medium" style={{ color: THEME.colors.text.primary }}>
                        {item.name}
                      </p>
                      <p className="text-xs" style={{ color: THEME.colors.text.tertiary }}>
                        ₱{item.price.toFixed(2)}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-0.5 rounded hover:bg-opacity-80"
                        style={{ backgroundColor: THEME.colors.background.hover }}
                      >
                        <Minus className="w-3 h-3" style={{ color: THEME.colors.text.primary }} />
                      </button>
                      <span className="text-xs font-medium w-5 text-center" style={{ color: THEME.colors.text.primary }}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-0.5 rounded hover:bg-opacity-80"
                        style={{ backgroundColor: THEME.colors.background.hover }}
                      >
                        <Plus className="w-3 h-3" style={{ color: THEME.colors.text.primary }} />
                      </button>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-0.5 rounded hover:bg-opacity-80 ml-0.5"
                        style={{ backgroundColor: THEME.colors.background.hover }}
                      >
                        <Trash2 className="w-3 h-3" style={{ color: '#ef4444' }} />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Order Summary & Submit Button - Fixed at bottom */}
          {orderItems.length > 0 && (
            <div className="flex-shrink-0 border-t pt-4" style={{ borderColor: THEME.colors.border.DEFAULT }}>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span style={{ color: THEME.colors.text.tertiary }}>Subtotal</span>
                  <span style={{ color: THEME.colors.text.primary }}>₱{subtotal.toFixed(2)}</span>
                </div>
                
                {smallOrderFee > 0 && (
                  <div className="flex justify-between text-sm">
                    <div>
                      <span style={{ color: THEME.colors.text.tertiary }}>Small order fee</span>
                      <p className="text-xs" style={{ color: THEME.colors.text.tertiary }}>
                        Spend at least ₱109 to avoid this fee
                      </p>
                    </div>
                    <span style={{ color: THEME.colors.text.primary }}>₱{smallOrderFee.toFixed(2)}</span>
                  </div>
                )}
                
                {orderType === 'delivery' && (
                  <div className="flex justify-between text-sm">
                    <span style={{ color: THEME.colors.text.tertiary }}>Standard delivery</span>
                    <span style={{ color: THEME.colors.text.primary }}>₱{deliveryFee.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span style={{ color: THEME.colors.text.tertiary }}>Service Fee</span>
                  <span style={{ color: THEME.colors.text.primary }}>₱{serviceFee.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-base font-bold pt-2 border-t" style={{ borderColor: THEME.colors.border.DEFAULT }}>
                  <span style={{ color: THEME.colors.text.primary }}>Total (incl. fees and tax)</span>
                  <span style={{ color: THEME.colors.primary.DEFAULT }}>₱{total.toFixed(2)}</span>
                </div>
              </div>

              <Button
                variant="primary"
                className="w-full"
                style={{
                  backgroundColor: THEME.colors.primary.DEFAULT,
                  color: 'white',
                  padding: '0.75rem'
                }}
              >
                Place Order
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;
