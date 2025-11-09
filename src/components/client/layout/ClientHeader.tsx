import React from 'react';
import { Search, MapPin } from 'lucide-react';
import { BRANDING } from '../../../constants/branding';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { Avatar } from '../../common/Avatar';
import { CartIndicator } from '../components/CartIndicator';
import { useNavigate } from 'react-router-dom';

export const ClientHeader: React.FC = () => {
  const [search, setSearch] = React.useState('');
  const [address, setAddress] = React.useState('');
  const [showAddressTooltip, setShowAddressTooltip] = React.useState(false);
  const navigate = useNavigate();

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
    <header className="h-16 sticky top-0 z-20 px-4" style={{ backgroundColor: THEME.colors.background.primary, borderBottom: `1px solid ${THEME.colors.border.dark}` }}>
      <div className="h-full flex items-center justify-between gap-3">
        {/* Left - Logo */}
        <div className="flex items-center flex-shrink-0">
          <img src="/logohorizontal.png" alt={BRANDING.logo.alt} className="h-8 w-auto" />
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

          <div className="hidden md:flex items-center rounded-lg px-3 h-10 w-72 transition-all" style={{ backgroundColor: THEME.colors.background.tertiary, border: `1px solid ${THEME.colors.border.dark}` }}>
            <Search className="w-4 h-4" style={{ color: THEME.colors.text.tertiary }} />
            <input aria-label="Search menu" type="text" placeholder="Search dishes, categories..." value={search} onChange={(e) => setSearch(e.target.value)} className="ml-2 bg-transparent border-none outline-none text-sm w-full" style={{ color: THEME.colors.text.primary }} />
          </div>

          <CartIndicator onClick={() => navigate('/client/cart')} />

          <div className="hidden sm:flex items-center gap-2">
            <Avatar size="sm" name="Guest" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default ClientHeader;
