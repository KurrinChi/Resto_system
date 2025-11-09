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
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-3">
            {BRANDING.logo.url ? (
              <img src={BRANDING.logo.url} alt={BRANDING.logo.alt} className="h-8 w-auto" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: THEME.colors.primary.DEFAULT }}>
                  <span className="text-white font-bold">{BRANDING.logo.text.charAt(0)}</span>
                </div>
                <span className="font-semibold text-sm" style={{ color: THEME.colors.text.primary }}>{BRANDING.appName}</span>
              </div>
            )}
          </div>
        </div>

          <div className="flex items-center gap-3">
          {/* Address Display - Clickable to open map */}
          <div 
            className="hidden lg:flex items-center gap-2 cursor-pointer transition-colors group" 
            style={{ maxWidth: '250px' }}
            onClick={() => window.dispatchEvent(new Event('openMapModal'))}
          >
            <MapPin className="w-4 h-4 flex-shrink-0 group-hover:text-red-600 transition-colors" style={{ color: THEME.colors.primary.DEFAULT }} />
            <span className="text-xs truncate group-hover:text-red-600 transition-colors" style={{ color: THEME.colors.text.primary }} title={address}>
              {address}
            </span>
          </div>

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
