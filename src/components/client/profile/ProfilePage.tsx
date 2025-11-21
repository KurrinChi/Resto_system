import React from 'react';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { Button } from '../../common/Button';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Calendar, User, Edit } from 'lucide-react';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    try {
      const rawSession = sessionStorage.getItem('rs_current_user');
      const rawLocal = !rawSession ? localStorage.getItem('rs_current_user') : null;
      const userData = rawSession ? JSON.parse(rawSession) : (rawLocal ? JSON.parse(rawLocal) : null);
      setUser(userData);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Listen for address updates
  React.useEffect(() => {
    const handleAddressUpdate = () => {
      const savedAddress = localStorage.getItem('userAddress');
      if (user) {
        setUser({ ...user, address: savedAddress });
      }
    };
    
    window.addEventListener('addressUpdated', handleAddressUpdate);
    return () => window.removeEventListener('addressUpdated', handleAddressUpdate);
  }, [user]);

  const handleOpenMapModal = () => {
    window.dispatchEvent(new Event('openMapModal'));
  };

  // Removed payment method helper (feature deprecated)

  if (loading) {
    return <div style={{ color: THEME.colors.text.tertiary }}>Loading profile...</div>;
  }

  if (!user) {
    return (
      <div className="space-y-4 max-w-xl mx-auto">
        <h2 className="text-2xl font-bold" style={{ color: THEME.colors.text.primary }}>Profile</h2>
        <div className="rounded-lg p-6 text-center" style={{ backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }}>
          <p className="mb-4" style={{ color: THEME.colors.text.tertiary }}>You are not logged in.</p>
          <Button onClick={() => navigate('/login')} style={{ backgroundColor: THEME.colors.primary.DEFAULT, color: 'white' }}>Go to Login</Button>
        </div>
      </div>
    );
  }

  const address = user.address || localStorage.getItem('userAddress') || 'No address set';
  const contactNumber = user.contactNumber || user.phoneNumber || user.phone || 'Not set';
  // Removed paymentMethod and gender (deprecated fields)
  const birthday = user.birthday || 'Not set';
  const avatar = user.avatar || '';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold" style={{ color: THEME.colors.text.primary }}>Profile</h2>
        <Button 
          onClick={() => navigate('/client/profile/edit')}
          style={{ backgroundColor: THEME.colors.primary.DEFAULT, color: 'white' }}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </Button>
      </div>

      {/* Profile Picture and Name Section */}
      <div 
        className="rounded-lg p-6"
        style={{ backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }}
      >
        <div className="flex items-center gap-6">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            {avatar ? (
              <img 
                src={avatar} 
                alt={user.name}
                className="w-24 h-24 rounded-full object-cover"
                style={{ border: `3px solid ${THEME.colors.primary.DEFAULT}` }}
              />
            ) : (
              <div 
                className="w-24 h-24 rounded-full flex items-center justify-center"
                style={{ backgroundColor: THEME.colors.background.tertiary, border: `3px solid ${THEME.colors.primary.DEFAULT}` }}
              >
                <User className="w-12 h-12" style={{ color: THEME.colors.text.tertiary }} />
              </div>
            )}
          </div>

          {/* Name */}
          <div className="flex-1">
            <h3 className="text-2xl font-bold mb-1" style={{ color: THEME.colors.text.primary }}>
              {user.name || user.username || 'Guest User'}
            </h3>
            <p className="text-sm" style={{ color: THEME.colors.text.tertiary }}>
              {user.email || 'No email provided'}
            </p>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Address */}
        <div 
          className="rounded-lg p-5"
          style={{ backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }}
        >
          <div className="flex items-start gap-3">
            <div 
              className="p-2 rounded-lg flex-shrink-0"
              style={{ backgroundColor: THEME.colors.primary.DEFAULT + '20' }}
            >
              <MapPin className="w-5 h-5" style={{ color: THEME.colors.primary.DEFAULT }} />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-semibold mb-1" style={{ color: THEME.colors.text.secondary }}>
                Address
              </h4>
              <p className="text-base break-words mb-3" style={{ color: THEME.colors.text.primary }}>
                {address}
              </p>
              <Button 
                variant="secondary"
                onClick={handleOpenMapModal}
                className="text-sm"
                style={{
                  backgroundColor: THEME.colors.background.tertiary,
                  color: THEME.colors.text.primary,
                  padding: '0.5rem 1rem'
                }}
              >
                <MapPin className="w-4 h-4 mr-2" />
                Change Address
              </Button>
            </div>
          </div>
        </div>

        {/* Contact Number */}
        <div 
          className="rounded-lg p-5"
          style={{ backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }}
        >
          <div className="flex items-start gap-3">
            <div 
              className="p-2 rounded-lg flex-shrink-0"
              style={{ backgroundColor: THEME.colors.primary.DEFAULT + '20' }}
            >
              <Phone className="w-5 h-5" style={{ color: THEME.colors.primary.DEFAULT }} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold mb-1" style={{ color: THEME.colors.text.secondary }}>
                Contact Number
              </h4>
              <p className="text-base" style={{ color: THEME.colors.text.primary }}>
                {contactNumber}
              </p>
            </div>
          </div>
        </div>

        {/* Deprecated sections (Payment Method, Gender) removed */}

        {/* Birthday */}
        <div 
          className="rounded-lg p-5 md:col-span-2"
          style={{ backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }}
        >
          <div className="flex items-start gap-3">
            <div 
              className="p-2 rounded-lg flex-shrink-0"
              style={{ backgroundColor: THEME.colors.primary.DEFAULT + '20' }}
            >
              <Calendar className="w-5 h-5" style={{ color: THEME.colors.primary.DEFAULT }} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold mb-1" style={{ color: THEME.colors.text.secondary }}>
                Birthday
              </h4>
              <p className="text-base" style={{ color: THEME.colors.text.primary }}>
                {birthday !== 'Not set' ? new Date(birthday).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                }) : birthday}
              </p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default ProfilePage;
