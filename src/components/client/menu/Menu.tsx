import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItemCard } from './MenuItemCard';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../common/Button';
import { useCart } from '../cart/CartContext';
import { Toast } from '../../common/Toast';
import { menuApi } from '../../../services/apiservice';

type MenuItem = {
  id: string;
  name: string;
  price: number;
  description?: string;
  category?: string;
  image?: string;
  available?: boolean;
};

export const Menu: React.FC = () => {
  const navigate = useNavigate();
  const { addItem, items, updateQty, removeItem } = useCart();
  const [filter, setFilter] = React.useState('All');
  const [priceRange, setPriceRange] = React.useState<[number, number]>([0, 1000]);
  const [showDiscounts, setShowDiscounts] = React.useState(false);
  const [showBestSellers, setShowBestSellers] = React.useState(false);
  const [showNewOffers, setShowNewOffers] = React.useState(false);
  const [orderType, setOrderType] = React.useState<'delivery' | 'pickup'>('delivery');
  const [searchQuery, setSearchQuery] = React.useState('');
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [favorites, setFavorites] = React.useState<Set<string>>(new Set());
  const [menuItems, setMenuItems] = React.useState<MenuItem[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [categories, setCategories] = React.useState<string[]>(['All']);

  // Fetch menu items from Firebase
  React.useEffect(() => {
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const response = await menuApi.getAll();
        if (response.success && response.data) {
          const items = response.data.map((item: any) => ({
            id: item.id || item.name,
            name: item.name || 'Unnamed Item',
            price: parseFloat(item.price || item.pricePerUnit || 0),
            description: item.description || '',
            category: item.category || 'Uncategorized',
            image: item.image || item.imageUrl || '',
            available: item.available !== false,
          }));
          setMenuItems(items);
          
          // Extract unique categories
          const uniqueCategories = ['All', ...new Set(items.map((i: MenuItem) => i.category).filter(Boolean))];
          setCategories(uniqueCategories as string[]);
        }
      } catch (error) {
        console.error('Failed to fetch menu:', error);
        setToastMessage('Failed to load menu items');
      } finally {
        setLoading(false);
      }
    };
    fetchMenu();
  }, []);

  // Add keyframe animations on mount
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }

      /* Smooth zoom effect */
      .menu-card-hover-zoom {
        position: relative;
        overflow: hidden;
        transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1),
                    box-shadow 0.3s ease;
        will-change: transform;
      }

      .menu-card-hover-zoom img {
        transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        will-change: transform;
      }

      .menu-card-hover-zoom:hover {
        transform: translateY(-6px);
      }

      .menu-card-hover-zoom:hover img {
        transform: scale(1.08);
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Listen for search events from header
  React.useEffect(() => {
    const handleSearch = (event: Event) => {
      const customEvent = event as CustomEvent<string>;
      setSearchQuery(customEvent.detail);
    };

    window.addEventListener('searchQuery', handleSearch);
    return () => window.removeEventListener('searchQuery', handleSearch);
  }, []);

  // Filter items based on all criteria
  let filteredItems = filter === 'All' 
    ? menuItems.filter(item => item.available !== false)
    : menuItems.filter((m) => m.category === filter && m.available !== false);
  
  // Apply search query filter (search in name, description, category)
  if (searchQuery.trim()) {
    const query = searchQuery.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.name.toLowerCase().includes(query) ||
      (item.description || '').toLowerCase().includes(query) ||
      (item.category || '').toLowerCase().includes(query)
    );
  }
  
  // Apply price range filter
  filteredItems = filteredItems.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.id,
      name: item.name,
      price: item.price
    });
    setToastMessage('Added to Cart Successfully');
  };

  const handleUpdateQuantity = (id: number | string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
    } else {
      updateQty(id, newQuantity);
    }
  };

  const handleRemoveItem = (id: number | string) => {
    removeItem(id);
  };

  const handleToggleFavorite = (itemId: string) => {
    setFavorites(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(itemId)) {
        newFavorites.delete(itemId);
        setToastMessage('Removed from Favorites');
      } else {
        newFavorites.add(itemId);
        setToastMessage('Added to Favorites');
      }
      return newFavorites;
    });
  };

  const handlePlaceOrder = () => {
    if (items.length === 0) {
      setToastMessage('Please add items to your cart');
      return;
    }
    // Save order type to localStorage before navigating
    localStorage.setItem('orderType', orderType);
    navigate('/client/checkout');
  };

  // Function to get count of items per category
  const getCategoryCount = (category: string) => {
    if (category === 'All') {
      return menuItems.filter(item => item.available !== false).length;
    }
    return menuItems.filter(item => item.category === category && item.available !== false).length;
  };

  const subtotal = items.reduce((sum: number, item) => sum + (item.price * item.qty), 0);
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
                max="1000"
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
                {c} ({getCategoryCount(c)})
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto mt-6 pr-2">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderColor: THEME.colors.primary.DEFAULT }}></div>
              <p className="text-sm" style={{ color: THEME.colors.text.tertiary }}>Loading menu items...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="rounded-full p-6 mb-6" style={{ backgroundColor: THEME.colors.background.tertiary }}>
                <svg
                  className="w-16 h-16"
                  fill="none"
                  stroke={THEME.colors.text.tertiary}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: THEME.colors.text.primary }}>
                No menu items found
              </h3>
              <p className="text-sm text-center max-w-md mb-6" style={{ color: THEME.colors.text.tertiary }}>
                We couldn't find any items matching your search or filters. Try adjusting your criteria or clearing some filters.
              </p>
              <Button
                variant="primary"
                onClick={() => {
                  setFilter('All');
                  setPriceRange([0, 1000]);
                  setShowDiscounts(false);
                  setShowBestSellers(false);
                  setShowNewOffers(false);
                  window.dispatchEvent(new CustomEvent('searchQuery', { detail: '' }));
                }}
                style={{
                  backgroundColor: THEME.colors.primary.DEFAULT,
                  color: 'white'
                }}
              >
                Clear all filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredItems.map((item, index) => (
                <MenuItemCard 
                  key={item.id} 
                  item={{
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    desc: item.description,
                    image: item.image,
                    category: item.category,
                    isBestSeller: false,
                    isNewOffer: false
                  }} 
                  onAddToOrder={handleAddToCart} 
                  index={index} 
                />
              ))}
            </div>
          )}
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
              {items.length === 0 ? (
                <p className="text-sm text-center py-8" style={{ color: THEME.colors.text.tertiary }}>
                  No items in order
                </p>
              ) : (
                items.map((item) => (
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
                        onClick={() => handleUpdateQuantity(item.id, item.qty - 1)}
                        className="p-0.5 rounded hover:bg-opacity-80"
                        style={{ backgroundColor: THEME.colors.background.hover }}
                      >
                        <Minus className="w-3 h-3" style={{ color: THEME.colors.text.primary }} />
                      </button>
                      <span className="text-xs font-medium w-5 text-center" style={{ color: THEME.colors.text.primary }}>
                        {item.qty}
                      </span>
                      <button
                        onClick={() => handleUpdateQuantity(item.id, item.qty + 1)}
                        className="p-0.5 rounded hover:bg-opacity-80"
                        style={{ backgroundColor: THEME.colors.background.hover }}
                      >
                        <Plus className="w-3 h-3" style={{ color: THEME.colors.text.primary }} />
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
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
          {items.length > 0 && (
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
                onClick={handlePlaceOrder}
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

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default Menu;
