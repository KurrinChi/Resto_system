import React from 'react';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { Button } from '../../common/Button';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, CreditCard, Calendar, User, Save, Upload } from 'lucide-react';
import { Toast } from '../../common/Toast';
import { usersApi } from '../../../services/apiservice';

export const ProfileEdit: React.FC = () => {
  const navigate = useNavigate();
  const [toastMessage, setToastMessage] = React.useState<string | null>(null);
  const [toastVariant, setToastVariant] = React.useState<'success' | 'error'>('success');

  // Form state
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [avatar, setAvatar] = React.useState('');
  const [contactNumber, setContactNumber] = React.useState('');
  const [paymentMethod, setPaymentMethod] = React.useState('cod');
  const [gender, setGender] = React.useState('');
  const [birthday, setBirthday] = React.useState('');
  const [address, setAddress] = React.useState('');
  
  // Validation error states
  const [emailError, setEmailError] = React.useState('');
  const [phoneError, setPhoneError] = React.useState('');
  const [birthdayError, setBirthdayError] = React.useState('');
  
  // Load user data
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const loadUserData = async () => {
      try {
        setLoading(true);
        
        // Get user ID from localStorage
        const userId = localStorage.getItem('rs_user_id');
        const raw = localStorage.getItem('rs_current_user');
        let userData = raw ? JSON.parse(raw) : null;
        
        // If we have a user ID, try to load from Firebase
        if (userId) {
          try {
            const response = await usersApi.getById(userId);
            if (response.success && response.data) {
              userData = response.data;
            }
          } catch (err) {
            console.error('Failed to load user from Firebase:', err);
            // Fall back to localStorage data
          }
        }
        
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
        
        // Map Firebase user fields to form fields
        // Firebase: first_name, last_name, username -> name
        const fullName = userData.first_name && userData.last_name 
          ? `${userData.first_name} ${userData.last_name}`
          : userData.name || userData.username || '';
        
        setName(fullName);
        setEmail(userData.email || '');
        setAvatar(userData.avatar || '');
        // Load and format phone number from database
        const rawPhone = userData.contact_number || userData.contactNumber || userData.phone || '';
        const formattedPhone = rawPhone ? phoneToDisplayFormat(rawPhone) : '';
        setContactNumber(formattedPhone);
        setPaymentMethod(userData.payment_method || userData.paymentMethod || 'cod');
        setGender(userData.gender || '');
        setBirthday(userData.birthday || userData.birth_date || '');
        
        // Load address from Firebase or localStorage
        const userAddress = userData.address || localStorage.getItem('userAddress') || 'No address set';
        setAddress(userAddress);
      } catch (err) {
        console.error('Error loading user data:', err);
      } finally {
        setLoading(false);
      }
    };
    
    loadUserData();
  }, []);
  
  // Listen for address updates from map
  React.useEffect(() => {
    const handleAddressUpdate = () => {
      const updatedAddress = localStorage.getItem('userAddress');
      if (updatedAddress) {
        setAddress(updatedAddress);
      }
    };
    
    window.addEventListener('addressUpdated', handleAddressUpdate);
    return () => {
      window.removeEventListener('addressUpdated', handleAddressUpdate);
    };
  }, []);

  // Phone number formatting utility
  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters except +
    let cleaned = value.replace(/[^\d+]/g, '');
    
    // Get current cleaned value for comparison
    const currentCleaned = contactNumber.replace(/[^\d+]/g, '');
    
    // If user types "0" first (and field is empty or just has +63), convert to +63 9 immediately
    if (cleaned === '0' || (cleaned.startsWith('0') && currentCleaned.length <= 3)) {
      cleaned = '+639';
    }
    // If user starts with 0, convert to +63 9 (remove the 0)
    else if (cleaned.startsWith('0')) {
      // Remove the leading 0 and add +63 9
      cleaned = '+639' + cleaned.substring(1);
    }
    // If user types digits without +63, add +63 9
    else if (cleaned && !cleaned.startsWith('+63')) {
      // If starts with 9, add +63 before it
      if (cleaned.startsWith('9')) {
        cleaned = '+63' + cleaned;
      } else if (/^\d/.test(cleaned)) {
        // If starts with other digit, assume it's after 9
        cleaned = '+639' + cleaned;
      } else {
        // Empty or invalid, start with +63 9
        cleaned = '+639';
      }
    }
    
    // Ensure it starts with +63
    if (!cleaned.startsWith('+63')) {
      cleaned = '+63' + cleaned;
    }
    
    // Extract only digits after +63
    const match = cleaned.match(/^\+63(.*)$/);
    if (match) {
      let digits = match[1].replace(/\D/g, '');
      
      // Ensure first digit is 9
      if (digits.length > 0 && digits[0] !== '9') {
        digits = '9' + digits;
      }
      
      // Limit to 10 digits total (9 + 9 more digits)
      digits = digits.substring(0, 10);
      
      // Format: +63 9XX XXX XXXX
      if (digits.length === 0) {
        return '+63 9';
      } else if (digits.length === 1) {
        return `+63 ${digits}`;
      } else if (digits.length <= 4) {
        return `+63 ${digits.substring(0, 1)}${digits.substring(1)}`;
      } else if (digits.length <= 7) {
        return `+63 ${digits.substring(0, 1)}${digits.substring(1, 4)} ${digits.substring(4)}`;
      } else {
        return `+63 ${digits.substring(0, 1)}${digits.substring(1, 4)} ${digits.substring(4, 7)} ${digits.substring(7)}`;
      }
    }
    
    return '+63 9';
  };
  
  // Convert formatted phone to database format (+639XXXXXXXXX - no spaces)
  const phoneToDatabaseFormat = (formatted: string): string => {
    // Remove all spaces, keep only + and digits
    return formatted.replace(/\s/g, '');
  };
  
  // Convert database format to display format
  const phoneToDisplayFormat = (dbFormat: string): string => {
    if (!dbFormat) return '';
    
    // Remove all non-digits except +
    let cleaned = dbFormat.replace(/[^\d+]/g, '');
    
    // If starts with 0, convert to +63
    if (cleaned.startsWith('0')) {
      cleaned = '+63' + cleaned.substring(1);
    }
    
    // If doesn't start with +63, add it
    if (!cleaned.startsWith('+63')) {
      if (cleaned.startsWith('9')) {
        cleaned = '+63' + cleaned;
      } else if (cleaned.length > 0) {
        cleaned = '+639' + cleaned;
      } else {
        cleaned = '+639';
      }
    }
    
    // Extract digits after +63
    const match = cleaned.match(/^\+63(.*)$/);
    if (match) {
      let digits = match[1].replace(/\D/g, '');
      
      // Ensure first digit is 9
      if (digits.length > 0 && digits[0] !== '9') {
        digits = '9' + digits;
      }
      
      // Limit to 10 digits
      digits = digits.substring(0, 10);
      
      // Format: +63 9XX XXX XXXX
      if (digits.length === 0) {
        return '+63 9';
      } else if (digits.length === 1) {
        return `+63 ${digits}`;
      } else if (digits.length <= 4) {
        return `+63 ${digits.substring(0, 1)}${digits.substring(1)}`;
      } else if (digits.length <= 7) {
        return `+63 ${digits.substring(0, 1)}${digits.substring(1, 4)} ${digits.substring(4)}`;
      } else {
        return `+63 ${digits.substring(0, 1)}${digits.substring(1, 4)} ${digits.substring(4, 7)} ${digits.substring(7)}`;
      }
    }
    
    return '+63 9';
  };

  const handleOpenMapModal = () => {
    window.dispatchEvent(new Event('openMapModal'));
  };

  const handleUpload = (file?: File) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatar(String(reader.result));
    reader.readAsDataURL(file);
  };
  
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value;
    const formatted = formatPhoneNumber(input);
    setContactNumber(formatted);
    setPhoneError(''); // Clear error on change
  };

  const handleSave = async () => {
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

      // Validate phone number (must start with +63 9 and have 9 more digits, total 12 digits)
      const cleanedPhone = phoneToDatabaseFormat(contactNumber);
      const phoneRegex = /^\+639\d{9}$/; // +63 9 + 9 more digits = 12 total
      if (!phoneRegex.test(cleanedPhone)) {
        setPhoneError('Please enter valid contact number (+63 9XX XXX XXXX)');
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

      // Get user ID
      const userId = localStorage.getItem('rs_user_id') || user?.id;
      
      if (!userId || userId === 'demo-user') {
        // If no real user ID, just save to localStorage
        const updatedUser = {
          ...user,
          name,
          email,
          avatar,
          contactNumber,
          paymentMethod,
          gender,
          birthday,
          address: address || localStorage.getItem('userAddress') || user?.address
        };
        // Update address in localStorage
        if (address) {
          localStorage.setItem('userAddress', address);
        }
        localStorage.setItem('rs_current_user', JSON.stringify(updatedUser));
        setToastVariant('success');
        setToastMessage('Profile Updated Successfully');
        setTimeout(() => {
          navigate('/client/profile');
        }, 1500);
        return;
      }

      // Split name into first_name and last_name
      const nameParts = name.trim().split(' ');
      const first_name = nameParts[0] || '';
      const last_name = nameParts.slice(1).join(' ') || '';

      // Get current address from state or localStorage
      const currentAddress = address || localStorage.getItem('userAddress') || user?.address || '';
      
      // Convert phone to database format (no spaces, with +63)
      const dbPhoneFormat = phoneToDatabaseFormat(contactNumber);
      
      // Prepare update data for Firebase
      const updateData: any = {
        email,
        avatar,
        contact_number: dbPhoneFormat, // Save as +639XXXXXXXXX format
        payment_method: paymentMethod,
        gender,
        birthday,
        address: currentAddress,
      };

      // Only add first_name and last_name if name is provided
      if (first_name) {
        updateData.first_name = first_name;
      }
      if (last_name) {
        updateData.last_name = last_name;
      }

      // Remove undefined/null values
      Object.keys(updateData).forEach(key => {
        if (updateData[key] === undefined || updateData[key] === null || updateData[key] === '') {
          delete updateData[key];
        }
      });

      // Save to Firebase
      const response = await usersApi.update(userId, updateData);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to update profile');
      }

      // Get updated user data from response
      const updatedUserData = response.data || {};
      
      // Update localStorage with new data
      // Map Firebase fields back to expected format
      const updatedUser = {
        ...user,
        ...updatedUserData,
        id: userId,
        name: updatedUserData.first_name && updatedUserData.last_name
          ? `${updatedUserData.first_name} ${updatedUserData.last_name}`
          : updatedUserData.username || name,
        contactNumber: updatedUserData.contact_number 
          ? phoneToDisplayFormat(updatedUserData.contact_number)
          : updatedUserData.contactNumber || contactNumber,
        paymentMethod: updatedUserData.payment_method || updatedUserData.paymentMethod || paymentMethod,
        address: updatedUserData.address || address || localStorage.getItem('userAddress') || user?.address
      };
      
      // Update address in localStorage if it was updated
      if (updatedUserData.address) {
        localStorage.setItem('userAddress', updatedUserData.address);
        setAddress(updatedUserData.address);
      }
      
      localStorage.setItem('rs_current_user', JSON.stringify(updatedUser));

      setToastVariant('success');
      setToastMessage('Profile Updated Successfully');
      setTimeout(() => {
        navigate('/client/profile');
      }, 1500);
    } catch (err: any) {
      console.error('Error saving profile:', err);
      setToastVariant('error');
      setToastMessage(err?.message || 'Failed to save profile');
    }
  };

  const handleCancel = () => {
    navigate('/client/profile');
  };

  if (loading || !user) {
    return <div style={{ color: THEME.colors.text.tertiary }}>Loading...</div>;
  }

  // Use address from state, fallback to localStorage or user data
  const displayAddress = address || localStorage.getItem('userAddress') || user.address || 'No address set';

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
                {displayAddress}
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
                onChange={handlePhoneChange}
                onFocus={() => {
                  // If empty, start with +63 9
                  if (!contactNumber || contactNumber === '') {
                    setContactNumber('+63 9');
                  }
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
              <h4 className="text-sm font-semibold mb-2" style={{ color: THEME.colors.text.secondary }}>
                Saved Payment Method
              </h4>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border outline-none focus:ring-2"
                style={{
                  backgroundColor: THEME.colors.background.tertiary,
                  borderColor: THEME.colors.border.DEFAULT,
                  color: THEME.colors.text.primary,
                  '--tw-ring-color': THEME.colors.primary.DEFAULT
                } as React.CSSProperties}
              >
                <option value="cod">Cash on Delivery</option>
                <option value="gcash">GCash</option>
                <option value="paymaya">PayMaya</option>
              </select>
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
              <h4 className="text-sm font-semibold mb-2" style={{ color: THEME.colors.text.secondary }}>
                Gender
              </h4>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border outline-none focus:ring-2"
                style={{
                  backgroundColor: THEME.colors.background.tertiary,
                  borderColor: THEME.colors.border.DEFAULT,
                  color: THEME.colors.text.primary,
                  '--tw-ring-color': THEME.colors.primary.DEFAULT
                } as React.CSSProperties}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
                <option value="prefer_not_to_say">Prefer not to say</option>
              </select>
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
