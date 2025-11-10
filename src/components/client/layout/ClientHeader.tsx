import React from 'react';
import { Search, MapPin, X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { BRANDING } from '../../../constants/branding';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { Avatar } from '../../common/Avatar';
import { CartIndicator } from '../components/CartIndicator';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../cart/CartContext';
import { Button } from '../../common/Button';

export const ClientHeader: React.FC = () => {
  const [search, setSearch] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [showAddressTooltip, setShowAddressTooltip] = React.useState(false);
  const [showCartPanel, setShowCartPanel] = React.useState(false);
  const [orderType, setOrderType] = React.useState<'delivery' | 'pickup'>(() => {
    return (localStorage.getItem('orderType') as 'delivery' | 'pickup') || 'delivery';
  });
  const navigate = useNavigate();
  const location = useLocation();
  const { items, updateQty, removeItem, total, count } = useCart();

  // Check if current page should hide search field
  const hideSearchOnPages = ['/client/favorites', '/client/profile', '/client/orders'];
  const shouldHideSearch = hideSearchOnPages.includes(location.pathname);

  // Update localStorage when order type changes
  React.useEffect(() => {
    localStorage.setItem('orderType', orderType);
  }, [orderType]);

  // Dispatch search query event
  const handleSearchChange = (value: string) => {
    setSearch(value);
    window.dispatchEvent(new CustomEvent('searchQuery', { detail: value }));
  };

  // Load address from localStorage on mount
  React.useEffect(() => {
    const savedAddress = localStorage.getItem('userAddress');
    setAddress(savedAddress || 'Select delivery address');
  }, []);

  // Listen for address updates
  React.useEffect(() => {
    const handleAddressUpdate = () => {
      const savedAddress = localStorage.getItem('userAddress');
      setAddress(savedAddress || 'Select delivery address');
    };
    
    window.addEventListener('addressUpdated', handleAddressUpdate);
    return () => window.removeEventListener('addressUpdated', handleAddressUpdate);
  }, []);

  return (
    <>
      <style>{`
        @keyframes slideIn {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }
        .animate-slide-in {
          animation: slideIn 0.3s ease-out;
        }
      `}</style>
      <header className="h-16 sticky top-0 z-20 px-4" style={{ backgroundColor: THEME.colors.background.primary, borderBottom: `1px solid ${THEME.colors.border.dark}` }}>
        <div className="h-full flex items-center justify-between gap-3">
        {/* Left - Logo */}
        <div className="flex items-center flex-shrink-0">
          <img 
            src="/logohorizontal.png" 
            alt={BRANDING.logo.alt} 
            className="h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity" 
            onClick={() => navigate('/client')}
          />
        </div>

        {/* Center - Address */}
        <div className="flex-1 flex justify-center min-w-0">
          <div 
            className="flex items-center gap-2 cursor-pointer transition-colors group relative max-w-md min-w-0" 
            onClick={() => window.dispatchEvent(new Event('openMapModal'))}
            onMouseEnter={() => setShowAddressTooltip(true)}
            onMouseLeave={() => setShowAddressTooltip(false)}
          >
            <MapPin className="w-4 h-4 flex-shrink-0 group-hover:text-red-600 transition-colors" style={{ color: THEME.colors.primary.DEFAULT }} />
            <span className="text-xs truncate group-hover:text-red-600 transition-colors" style={{ color: THEME.colors.text.primary }}>
              {address}
            </span>
            
            {/* Tooltip */}
            {showAddressTooltip && (
              <div 
                className="absolute top-full left-1/2 -translate-x-1/2 mt-2 p-3 rounded-lg shadow-lg z-50 min-w-[250px] max-w-[350px]"
                style={{ 
                  backgroundColor: THEME.colors.background.secondary,
                  border: `1px solid ${THEME.colors.border.dark}`,
                  color: THEME.colors.text.primary
                }}
              >
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" style={{ color: THEME.colors.primary.DEFAULT }} />
                  <div>
                    <p className="text-xs font-medium mb-1" style={{ color: THEME.colors.text.secondary }}>Delivery Address</p>
                    <p className="text-sm break-words" style={{ color: THEME.colors.text.tertiary }}>{address}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right - Search, Cart, Avatar */}
        <div className="flex items-center gap-3 flex-shrink-0">

          {!shouldHideSearch && (
            <div className="hidden md:flex items-center rounded-lg px-3 h-10 w-72 transition-all" style={{ backgroundColor: THEME.colors.background.tertiary, border: `1px solid ${THEME.colors.border.dark}` }}>
              <Search className="w-4 h-4" style={{ color: THEME.colors.text.tertiary }} />
              <input 
                aria-label="Search menu" 
                type="text" 
                placeholder="Search dishes, categories..." 
                value={search} 
                onChange={(e) => handleSearchChange(e.target.value)} 
                className="ml-2 bg-transparent border-none outline-none text-sm w-full" 
                style={{ color: THEME.colors.text.primary }} 
              />
            </div>
          )}

          <CartIndicator onClick={() => setShowCartPanel(true)} />

          <div className="hidden sm:flex items-center gap-2">
            <Avatar size="sm" name="Guest" />
          </div>
        </div>
      </div>

      {/* Cart Side Panel */}
      {showCartPanel && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black z-40 transition-opacity"
            style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}
            onClick={() => setShowCartPanel(false)}
          />
          
          {/* Side Panel */}
          <div 
            className="fixed top-0 right-0 h-full w-full sm:w-96 z-50 shadow-2xl flex flex-col animate-slide-in"
            style={{ backgroundColor: THEME.colors.background.primary }}
          >
            {/* Header */}
            <div 
              className="flex items-center justify-between p-4 border-b"
              style={{ borderColor: THEME.colors.border.dark }}
            >
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5" style={{ color: THEME.colors.primary.DEFAULT }} />
                <h2 className="text-lg font-semibold" style={{ color: THEME.colors.text.primary }}>
                  Your Cart ({count})
                </h2>
              </div>
              <button
                onClick={() => setShowCartPanel(false)}
                className="p-2 rounded-lg hover:bg-opacity-80 transition"
                style={{ backgroundColor: THEME.colors.background.tertiary }}
              >
                <X className="w-5 h-5" style={{ color: THEME.colors.text.primary }} />
              </button>
            </div>

            {/* Order Type Toggle */}
            <div className="p-4 border-b" style={{ borderColor: THEME.colors.border.dark }}>
              <div className="flex gap-2">
                <button
                  onClick={() => setOrderType('delivery')}
                  className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: orderType === 'delivery' ? THEME.colors.primary.DEFAULT : THEME.colors.background.tertiary,
                    color: orderType === 'delivery' ? '#FFFFFF' : THEME.colors.text.primary,
                    borderWidth: 2,
                    borderColor: orderType === 'delivery' ? THEME.colors.primary.DEFAULT : 'transparent',
                  }}
                >
                  Delivery
                </button>
                <button
                  onClick={() => setOrderType('pickup')}
                  className="flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all"
                  style={{
                    backgroundColor: orderType === 'pickup' ? THEME.colors.primary.DEFAULT : THEME.colors.background.tertiary,
                    color: orderType === 'pickup' ? '#FFFFFF' : THEME.colors.text.primary,
                    borderWidth: 2,
                    borderColor: orderType === 'pickup' ? THEME.colors.primary.DEFAULT : 'transparent',
                  }}
                >
                  Pick-up
                </button>
              </div>
            </div>

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto p-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full">
                  <div className="rounded-full p-6 mb-4" style={{ backgroundColor: THEME.colors.background.tertiary }}>
                    <ShoppingBag className="w-12 h-12" style={{ color: THEME.colors.text.tertiary }} />
                  </div>
                  <h3 className="text-lg font-semibold mb-2" style={{ color: THEME.colors.text.primary }}>
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-center" style={{ color: THEME.colors.text.tertiary }}>
                    Add items to get started
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="p-3 rounded-lg"
                      style={{ backgroundColor: THEME.colors.background.tertiary }}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium" style={{ color: THEME.colors.text.primary }}>
                            {item.name}
                          </h4>
                          <p className="text-xs mt-1" style={{ color: THEME.colors.text.tertiary }}>
                            ₱{item.price.toFixed(2)} each
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-1 rounded hover:bg-opacity-80"
                          style={{ backgroundColor: THEME.colors.background.hover }}
                        >
                          <Trash2 className="w-4 h-4" style={{ color: '#ef4444' }} />
                        </button>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => updateQty(item.id, item.qty - 1)}
                            className="p-1 rounded hover:bg-opacity-80"
                            style={{ backgroundColor: THEME.colors.background.hover }}
                          >
                            <Minus className="w-3 h-3" style={{ color: THEME.colors.text.primary }} />
                          </button>
                          <span className="text-sm font-medium w-8 text-center" style={{ color: THEME.colors.text.primary }}>
                            {item.qty}
                          </span>
                          <button
                            onClick={() => updateQty(item.id, item.qty + 1)}
                            className="p-1 rounded hover:bg-opacity-80"
                            style={{ backgroundColor: THEME.colors.background.hover }}
                          >
                            <Plus className="w-3 h-3" style={{ color: THEME.colors.text.primary }} />
                          </button>
                        </div>
                        <span className="text-sm font-bold" style={{ color: THEME.colors.primary.DEFAULT }}>
                          ₱{(item.price * item.qty).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer with Total and Checkout */}
            {items.length > 0 && (
              <div 
                className="p-4 border-t"
                style={{ borderColor: THEME.colors.border.dark }}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-base font-semibold" style={{ color: THEME.colors.text.primary }}>
                    Total
                  </span>
                  <span className="text-xl font-bold" style={{ color: THEME.colors.primary.DEFAULT }}>
                    ₱{total.toFixed(2)}
                  </span>
                </div>
                <Button
                  variant="primary"
                  className="w-full"
                  onClick={() => {
                    setShowCartPanel(false);
                    navigate('/client/checkout');
                  }}
                  style={{
                    backgroundColor: THEME.colors.primary.DEFAULT,
                    color: 'white',
                    padding: '0.75rem'
                  }}
                >
                  Checkout
                </Button>
              </div>
            )}
          </div>
        </>
      )}
      </header>
    </>
  );
};

export default ClientHeader;
