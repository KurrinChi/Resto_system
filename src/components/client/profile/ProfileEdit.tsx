import React from 'react';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { Button } from '../../common/Button';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, Calendar, User, Save, Upload } from 'lucide-react';
import { Toast } from '../../common/Toast';

export const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [toastVariant, setToastVariant] = React.useState<'success' | 'error'>('success');

  // Form state
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [avatar, setAvatar] = React.useState('');
  const [contactNumber, setContactNumber] = React.useState('');
  // Removed paymentMethod and gender (deprecated fields)
  const [birthday, setBirthday] = React.useState('');
  
  // Validation error states
  const [emailError, setEmailError] = React.useState('');
  const [phoneError, setPhoneError] = React.useState('');
  const [birthdayError, setBirthdayError] = React.useState('');
  
  // Load user data
  const [user, setUser] = React.useState<any>(null);

  React.useEffect(() => {
    try {
      const raw = localStorage.getItem('rs_current_user');
      let userData = raw ? JSON.parse(raw) : null;
      
      // If no user found, use demo user data
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
      setName(userData.name || '');
      setEmail(userData.email || '');
      setAvatar(userData.avatar || '');
      setContactNumber(userData.contactNumber || '');
      // paymentMethod / gender no longer used
      setBirthday(userData.birthday || '');
    } catch {
      // Fallback
    }
  }, []);

  const handleOpenMapModal = () => {
    window.dispatchEvent(new Event('openMapModal'));
  };

  const handleUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    try {
      // Clear previous errors
      setEmailError('');
      setPhoneError('');
      setBirthdayError('');

      let hasError = false;

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('Please enter valid email address');
        hasError = true;
      }

      // Validate phone number (must start with +63 9 and have 7 digits after, ignoring spaces)
      const cleanedPhone = contactNumber.replace(/\s/g, ''); // Remove all spaces
      const phoneRegex = /^\+639\d{7}$/;
      if (!phoneRegex.test(cleanedPhone)) {
        setPhoneError('Please enter valid contact number');
        hasError = true;
      }

      // Validate age (must be 16 or above)
      if (birthday) {
        const birthDate = new Date(birthday);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
          age--;
        }

        if (age < 16) {
          setBirthdayError('Please enter valid birthday (must be 16 years or older)');
          hasError = true;
        }
      }

      // If any validation failed, show toast and return
      if (hasError) {
        setToastVariant('error');
        setToastMessage('Please fix the errors in the form');
        return;
      }

      const updatedUser = {
        ...user,
        name,
        email,
        avatar,
        contactNumber,
        birthday,
        address: localStorage.getItem('userAddress') || user?.address
      };

      // Save to localStorage
      localStorage.setItem('rs_current_user', JSON.stringify(updatedUser));
      
      // Also update in users array if exists
      const usersRaw = localStorage.getItem('rs_users_v1');
      if (usersRaw) {
        const users = JSON.parse(usersRaw);
        const idx = users.findIndex((u: any) => u.id === user?.id);
        if (idx !== -1) {
          users[idx] = updatedUser;
          localStorage.setItem('rs_users_v1', JSON.stringify(users));
        }
      }

      setToastVariant('success');
      setToastMessage('Profile Updated Successfully');
      setTimeout(() => {
        navigate('/client/profile');
      }, 1500);
    } catch {
      setToastVariant('error');
      setToastMessage('Failed to save profile');
    }
  };

  const handleCancel = () => {
    navigate('/client/profile');
  };

  if (!user) {
    return <div style={{ color: THEME.colors.text.tertiary }}>Loading...</div>;
  }

  const address = localStorage.getItem('userAddress') || user.address || 'No address set';

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold" style={{ color: THEME.colors.text.primary }}>Edit Profile</h2>
      </div>

      {/* Profile Picture and Name Section */}
      <div 
        className="rounded-lg p-6"
        style={{ backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }}
      >
        <div className="flex items-start gap-6">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <div className="relative">
              {avatar ? (
                <img 
                  src={avatar} 
                  alt={name}
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
              
              {/* Upload button */}
              <label 
                htmlFor="avatar-upload"
                className="absolute bottom-0 right-0 p-2 rounded-full cursor-pointer"
                style={{ backgroundColor: THEME.colors.primary.DEFAULT }}
              >
                <Upload className="w-4 h-4" style={{ color: 'white' }} />
                <input 
                  id="avatar-upload"
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => handleUpload(e.target.files?.[0])}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Name and Email */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: THEME.colors.text.secondary }}>
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2"
                style={{
                  backgroundColor: THEME.colors.background.tertiary,
                  borderColor: THEME.colors.border.DEFAULT,
                  color: THEME.colors.text.primary,
                  '--tw-ring-color': THEME.colors.primary.DEFAULT
                } as React.CSSProperties}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: THEME.colors.text.secondary }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(''); // Clear error on change
                }}
                className="w-full px-4 py-2 rounded-lg border outline-none focus:ring-2"
                style={{
                  backgroundColor: emailError ? '#fee2e2' : THEME.colors.background.tertiary,
                  borderColor: emailError ? '#ef4444' : THEME.colors.border.DEFAULT,
                  color: THEME.colors.text.primary,
                  '--tw-ring-color': THEME.colors.primary.DEFAULT
                } as React.CSSProperties}
              />
              {emailError && (
                <p className="text-sm mt-1" style={{ color: '#ef4444' }}>
                  {emailError}
                </p>
              )}
            </div>
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
              <h4 className="text-sm font-semibold mb-2" style={{ color: THEME.colors.text.secondary }}>
                Address
              </h4>
              <p className="text-sm break-words mb-3" style={{ color: THEME.colors.text.primary }}>
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
              <h4 className="text-sm font-semibold mb-2" style={{ color: THEME.colors.text.secondary }}>
                Contact Number
              </h4>
              <input
                type="tel"
                value={contactNumber}
                onChange={(e) => {
                  // Remove all letters (A-Z, a-z) from input
                  const cleaned = e.target.value.replace(/[A-Za-z]/g, '');
                  setContactNumber(cleaned);
                  setPhoneError(''); // Clear error on change
                }}
                placeholder="+63 9XX XXX XXXX"
                className="w-full px-3 py-2 rounded-lg border outline-none focus:ring-2"
                style={{
                  backgroundColor: phoneError ? '#fee2e2' : THEME.colors.background.tertiary,
                  borderColor: phoneError ? '#ef4444' : THEME.colors.border.DEFAULT,
                  color: THEME.colors.text.primary,
                  '--tw-ring-color': THEME.colors.primary.DEFAULT
                } as React.CSSProperties}
              />
              {phoneError && (
                <p className="text-sm mt-1" style={{ color: '#ef4444' }}>
                  {phoneError}
                </p>
              )}
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
              <h4 className="text-sm font-semibold mb-2" style={{ color: THEME.colors.text.secondary }}>
                Birthday
              </h4>
              <input
                type="date"
                value={birthday}
                onChange={(e) => {
                  setBirthday(e.target.value);
                  setBirthdayError(''); // Clear error on change
                }}
                className="w-full px-3 py-2 rounded-lg border outline-none focus:ring-2"
                style={{
                  backgroundColor: birthdayError ? '#fee2e2' : THEME.colors.background.tertiary,
                  borderColor: birthdayError ? '#ef4444' : THEME.colors.border.DEFAULT,
                  color: THEME.colors.text.primary,
                  '--tw-ring-color': THEME.colors.primary.DEFAULT
                } as React.CSSProperties}
              />
              {birthdayError && (
                <p className="text-sm mt-1" style={{ color: '#ef4444' }}>
                  {birthdayError}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Save/Cancel Buttons at Bottom */}
      <div className="flex justify-center gap-4 pt-4">
        <Button 
          onClick={handleCancel}
          style={{ 
            backgroundColor: THEME.colors.background.tertiary, 
            color: THEME.colors.text.primary,
            padding: '0.75rem 2rem'
          }}
        >
          Cancel
        </Button>
        <Button 
          onClick={handleSave}
          style={{ 
            backgroundColor: THEME.colors.primary.DEFAULT, 
            color: 'white',
            padding: '0.75rem 2rem'
          }}
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          variant={toastVariant}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default ProfileEdit;
