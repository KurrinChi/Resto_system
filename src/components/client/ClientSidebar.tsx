import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Menu, ShoppingCart, User, LogOut } from 'lucide-react';
import { THEME } from '../../constants/theme';
import { setSessionUser } from '../../services/sessionService';
import { BRANDING } from '../../constants/branding';

const clientMenu = [
  { path: '/client', label: 'Home', icon: <Home className="w-5 h-5" /> },
  { path: '/client/menu', label: 'Menu', icon: <Menu className="w-5 h-5" /> },
  { path: '/client/orders', label: 'Orders', icon: <ShoppingCart className="w-5 h-5" /> },
  { path: '/client/profile', label: 'Profile', icon: <User className="w-5 h-5" /> },
];

export const ClientSidebar: React.FC = () => {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear any stored user data
    try {
      // centralize logout
      setSessionUser(null as any);
      localStorage.removeItem('userAddress');
      localStorage.removeItem('orderType');
      localStorage.removeItem('rs_cart_v1');
    } catch {}
    
    // Force full page reload to reset login state
    window.location.href = '/login';
  };

  return (
    <aside
      className={`hidden md:flex md:flex-col will-change-[width] ${isExpanded ? 'w-64' : 'w-20'}`}
      style={{
        backgroundColor: THEME.colors.background.secondary,
        transition: 'width 0.3s ease',
      }}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div className="h-16 flex items-center justify-center px-4" style={{ borderBottom: `1px solid ${THEME.colors.border.dark}` }}>
        {BRANDING.logo.url ? (
          <img src={BRANDING.logo.url} alt={BRANDING.logo.alt} className="h-8 w-auto" />
        ) : (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: THEME.colors.primary.DEFAULT }}>
              <span className="text-white font-bold text-sm">{BRANDING.logo.text.charAt(0)}</span>
            </div>
            <span className="font-semibold text-sm" style={{ color: THEME.colors.text.primary, opacity: isExpanded ? 1 : 0 }}>{BRANDING.logo.text}</span>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden">
        {clientMenu.map((item) => (
              <NavLink
            key={item.path}
            to={item.path}
                end={item.path === '/client'}
            className={({ isActive }) => `relative flex items-center gap-3 px-3 h-11 rounded-lg ${isActive ? 'text-white font-medium' : 'hover:text-white'} ${!isExpanded && 'justify-center'}`}
            style={({ isActive }) => ({
              backgroundColor: isActive ? THEME.colors.primary.DEFAULT : 'transparent',
              color: isActive ? THEME.colors.text.primary : THEME.colors.text.secondary,
              transition: 'all 0.2s ease',
            })}
            title={!isExpanded ? item.label : undefined}
          >
            <span className="flex-shrink-0">{item.icon}</span>
            {isExpanded && <span className="text-sm font-medium flex-1 truncate" style={{ color: THEME.colors.text.primary }}>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Logout Button */}
      <div className="p-3 border-t" style={{ borderColor: THEME.colors.border.dark }}>
        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 h-11 rounded-lg hover:bg-opacity-80 transition-all ${!isExpanded && 'justify-center'}`}
          style={{
            backgroundColor: 'transparent',
            color: THEME.colors.text.secondary,
          }}
          title={!isExpanded ? 'Logout' : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {isExpanded && <span className="text-sm font-medium flex-1 truncate text-left" style={{ color: THEME.colors.text.primary }}>Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default ClientSidebar;
