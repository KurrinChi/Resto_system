import React from 'react';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { Button } from '../../common/Button';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, CreditCard, Calendar, User, Edit } from 'lucide-react';
import { clearSession } from '../../../services/authService';

export const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('rs_current_user');
      let userData = raw ? JSON.parse(raw) : null;
      
      // If no user found, create a demo user for display
      if (!userData) {
        userData = {
          id: 'demo-user',
          name: 'John Doe',
          email: 'john.doe@example.com',
          avatar: '',
          contactNumber: '+63 912 345 6789',
          paymentMethod: 'gcash',
          gender: 'male',
          birthday: '1990-05-15',
          address: localStorage.getItem('userAddress') || 'Manila, Philippines'
        };
      }
      
      setUser(userData);
    } catch {
      // Fallback demo user
      setUser({
        id: 'demo-user',
        name: 'John Doe',
        email: 'john.doe@example.com',
        avatar: '',
        contactNumber: '+63 912 345 6789',
        paymentMethod: 'gcash',
        gender: 'male',
        birthday: '1990-05-15',
        address: localStorage.getItem('userAddress') || 'Manila, Philippines'
      });
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

  const getPaymentMethodLabel = (method: string) => {
    switch (method) {
      case 'cod': return 'Cash on Delivery';
      case 'gcash': return 'GCash';
      case 'paymaya': return 'PayMaya';
      default: return 'Not set';
    }
  };

  if (!user) {
    return <div style={{ color: THEME.colors.text.tertiary }}>Loading...</div>;
  }

  const address = user.address || localStorage.getItem('userAddress') || 'No address set';
  const contactNumber = user.contactNumber || user.phone || 'Not set';
  const paymentMethod = user.paymentMethod || 'cod';
  const gender = user.gender || 'Not set';
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

        {/* Payment Method */}
        <div 
          className="rounded-lg p-5"
          style={{ backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }}
        >
          <div className="flex items-start gap-3">
            <div 
              className="p-2 rounded-lg flex-shrink-0"
              style={{ backgroundColor: THEME.colors.primary.DEFAULT + '20' }}
            >
              <CreditCard className="w-5 h-5" style={{ color: THEME.colors.primary.DEFAULT }} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold mb-1" style={{ color: THEME.colors.text.secondary }}>
                Saved Payment Method
              </h4>
              <p className="text-base" style={{ color: THEME.colors.text.primary }}>
                {getPaymentMethodLabel(paymentMethod)}
              </p>
            </div>
          </div>
        </div>

        {/* Gender */}
        <div 
          className="rounded-lg p-5"
          style={{ backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }}
        >
          <div className="flex items-start gap-3">
            <div 
              className="p-2 rounded-lg flex-shrink-0"
              style={{ backgroundColor: THEME.colors.primary.DEFAULT + '20' }}
            >
              <User className="w-5 h-5" style={{ color: THEME.colors.primary.DEFAULT }} />
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold mb-1" style={{ color: THEME.colors.text.secondary }}>
                Gender
              </h4>
              <p className="text-base capitalize" style={{ color: THEME.colors.text.primary }}>
                {gender}
              </p>
            </div>
          </div>
        </div>

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

      {/* Logout Button */}
      <div className="flex justify-center pt-4">
        <Button 
          variant="danger"
          onClick={() => {
            if (confirm('Are you sure you want to logout?')) {
              clearSession();
              navigate('/client');
              window.location.reload();
            }
          }}
          style={{
            backgroundColor: '#ef4444',
            color: 'white',
            padding: '0.75rem 2rem'
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  );
};

export default ProfilePage;
