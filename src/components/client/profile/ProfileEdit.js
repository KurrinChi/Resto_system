import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { Button } from '../../common/Button';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, User, Save, Upload } from 'lucide-react';
import { Toast } from '../../common/Toast';
export const ProfileEdit = () => {
    const navigate = useNavigate();
    const [toastMessage, setToastMessage] = React.useState(null);
    const [toastVariant, setToastVariant] = React.useState('success');
    // Form state
    const [name, setName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [avatar, setAvatar] = React.useState('');
    const [contactNumber, setContactNumber] = React.useState('');
    // Removed paymentMethod and gender (deprecated fields)
    // Validation error states
    const [emailError, setEmailError] = React.useState('');
    const [phoneError, setPhoneError] = React.useState('');
    // Load user data
    const [user, setUser] = React.useState(null);
    // Address tracking
    const [originalAddress, setOriginalAddress] = React.useState('');
    const [newAddress, setNewAddress] = React.useState('');
    React.useEffect(() => {
        try {
            const rawSession = sessionStorage.getItem('rs_current_user');
            const rawLocal = !rawSession ? localStorage.getItem('rs_current_user') : null;
            const userData = rawSession ? JSON.parse(rawSession) : (rawLocal ? JSON.parse(rawLocal) : null);
            if (!userData) {
                navigate('/login');
                return;
            }
            setUser(userData);
            setName(userData.name || userData.fullName || '');
            setEmail(userData.email || '');
            setAvatar(userData.avatar || '');
            setContactNumber(userData.contactNumber || userData.phoneNumber || userData.phone || '');
            setOriginalAddress(userData.address || '');
            const storedAddress = localStorage.getItem('userAddress');
            if (storedAddress && storedAddress !== (userData.address || '')) {
                setNewAddress(storedAddress);
            }
        }
        catch {
            navigate('/login');
        }
    }, [navigate]);
    // Listen for external address updates (map modal)
    React.useEffect(() => {
        const handleAddressUpdate = () => {
            const storedAddress = localStorage.getItem('userAddress') || '';
            if (storedAddress && storedAddress !== originalAddress) {
                setNewAddress(storedAddress);
            }
        };
        window.addEventListener('addressUpdated', handleAddressUpdate);
        return () => window.removeEventListener('addressUpdated', handleAddressUpdate);
    }, [originalAddress]);
    const handleOpenMapModal = () => {
        window.dispatchEvent(new Event('openMapModal'));
    };
    const handleUpload = (file) => {
        if (!file)
            return;
        const MAX_SIZE_BYTES = 2 * 1024 * 1024; // 2MB limit
        if (file.size > MAX_SIZE_BYTES) {
            setToastVariant('error');
            setToastMessage('Image too large. Maximum size is 2MB.');
            return;
        }
        const reader = new FileReader();
        reader.onload = () => setAvatar(String(reader.result));
        reader.readAsDataURL(file);
    };
    const handleSave = async () => {
        try {
            // Clear previous errors
            setEmailError('');
            setPhoneError('');
            let hasError = false;
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                setEmailError('Please enter valid email address');
                hasError = true;
            }
            // Validate phone number: must be 11 digits starting with 09 (e.g., 09XXXXXXXXX)
            const cleanedPhone = contactNumber.replace(/\D/g, ''); // Keep digits only
            const phoneRegex = /^09\d{9}$/; // 09 + 9 more digits = 11 total
            if (!phoneRegex.test(cleanedPhone)) {
                setPhoneError('Contact number must start with 09 and be 11 digits');
                hasError = true;
            }
            // Validate age (must be 16 or above)
            // If any validation failed, show toast and return
            if (hasError) {
                setToastVariant('error');
                setToastMessage('Please fix the errors in the form');
                return;
            }
            const currentAddress = newAddress || originalAddress || '';
            // Update backend
            try {
                const response = await fetch('http://localhost:8000/api/auth/update-profile/', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: user.id,
                        name,
                        email,
                        avatar,
                        contactNumber: cleanedPhone,
                        address: currentAddress
                    })
                });
                const contentType = response.headers.get('Content-Type') || '';
                if (!response.ok) {
                    if (contentType.includes('application/json')) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || 'Failed to update profile');
                    }
                    else {
                        const text = await response.text();
                        throw new Error(text.slice(0, 200) || 'Failed to update profile');
                    }
                }
                const result = contentType.includes('application/json') ? await response.json() : {};
                // Update local session storage
                const updatedUser = {
                    ...user,
                    name,
                    fullName: name,
                    email,
                    avatar,
                    contactNumber: cleanedPhone,
                    phoneNumber: cleanedPhone,
                    address: currentAddress
                };
                sessionStorage.setItem('rs_current_user', JSON.stringify(updatedUser));
                localStorage.setItem('rs_current_user', JSON.stringify(updatedUser));
                setToastVariant('success');
                setToastMessage('Profile Updated Successfully');
                setOriginalAddress(currentAddress);
                setNewAddress('');
                setTimeout(() => {
                    navigate('/client/profile');
                }, 1500);
            }
            catch (err) {
                console.error('Update profile error:', err);
                setToastVariant('error');
                setToastMessage(err.message || 'Failed to update profile');
            }
        }
        catch {
            setToastVariant('error');
            setToastMessage('Failed to save profile');
        }
    };
    const handleCancel = () => {
        navigate('/client/profile');
    };
    if (!user) {
        return _jsx("div", { style: { color: THEME.colors.text.tertiary }, children: "Loading..." });
    }
    const displayAddress = originalAddress || 'No address set';
    return (_jsxs("div", { className: "space-y-6 max-w-4xl mx-auto", children: [_jsx("div", { children: _jsx("h2", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: "Edit Profile" }) }), _jsx("div", { className: "rounded-lg p-6", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: _jsxs("div", { className: "flex items-start gap-6", children: [_jsx("div", { className: "flex-shrink-0", children: _jsxs("div", { className: "relative", children: [avatar ? (_jsx("img", { src: avatar, alt: name, className: "w-24 h-24 rounded-full object-cover", style: { border: `3px solid ${THEME.colors.primary.DEFAULT}` } })) : (_jsx("div", { className: "w-24 h-24 rounded-full flex items-center justify-center", style: { backgroundColor: THEME.colors.background.tertiary, border: `3px solid ${THEME.colors.primary.DEFAULT}` }, children: _jsx(User, { className: "w-12 h-12", style: { color: THEME.colors.text.tertiary } }) })), _jsxs("label", { htmlFor: "avatar-upload", className: "absolute bottom-0 right-0 p-2 rounded-full cursor-pointer", style: { backgroundColor: THEME.colors.primary.DEFAULT }, children: [_jsx(Upload, { className: "w-4 h-4", style: { color: 'white' } }), _jsx("input", { id: "avatar-upload", type: "file", accept: "image/*", onChange: (e) => handleUpload(e.target.files?.[0]), className: "hidden" })] })] }) }), _jsxs("div", { className: "flex-1 space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", style: { color: THEME.colors.text.secondary }, children: "Name" }), _jsx("input", { type: "text", value: name, onChange: (e) => setName(e.target.value), className: "w-full px-4 py-2 rounded-lg border outline-none focus:ring-2", style: {
                                                backgroundColor: THEME.colors.background.tertiary,
                                                borderColor: THEME.colors.border.DEFAULT,
                                                color: THEME.colors.text.primary,
                                                '--tw-ring-color': THEME.colors.primary.DEFAULT
                                            } })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", style: { color: THEME.colors.text.secondary }, children: "Email" }), _jsx("input", { type: "email", value: email, onChange: (e) => {
                                                setEmail(e.target.value);
                                                setEmailError(''); // Clear error on change
                                            }, className: "w-full px-4 py-2 rounded-lg border outline-none focus:ring-2", style: {
                                                backgroundColor: emailError ? '#fee2e2' : THEME.colors.background.tertiary,
                                                borderColor: emailError ? '#ef4444' : THEME.colors.border.DEFAULT,
                                                color: THEME.colors.text.primary,
                                                '--tw-ring-color': THEME.colors.primary.DEFAULT
                                            } }), emailError && (_jsx("p", { className: "text-sm mt-1", style: { color: '#ef4444' }, children: emailError }))] })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx("div", { className: "rounded-lg p-5", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "p-2 rounded-lg flex-shrink-0", style: { backgroundColor: THEME.colors.primary.DEFAULT + '20' }, children: _jsx(MapPin, { className: "w-5 h-5", style: { color: THEME.colors.primary.DEFAULT } }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h4", { className: "text-sm font-semibold mb-2", style: { color: THEME.colors.text.secondary }, children: "Address" }), _jsx("p", { className: "text-sm break-words mb-1", style: { color: THEME.colors.text.primary }, children: displayAddress }), newAddress && newAddress !== originalAddress && (_jsxs("p", { className: "text-xs break-words mb-3", style: { color: THEME.colors.primary.DEFAULT }, children: ["NEW: ", newAddress] })), _jsxs(Button, { variant: "secondary", onClick: handleOpenMapModal, className: "text-sm", style: {
                                                backgroundColor: THEME.colors.background.tertiary,
                                                color: THEME.colors.text.primary,
                                                padding: '0.5rem 1rem'
                                            }, children: [_jsx(MapPin, { className: "w-4 h-4 mr-2" }), "Change Address"] })] })] }) }), _jsx("div", { className: "rounded-lg p-5", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "p-2 rounded-lg flex-shrink-0", style: { backgroundColor: THEME.colors.primary.DEFAULT + '20' }, children: _jsx(Phone, { className: "w-5 h-5", style: { color: THEME.colors.primary.DEFAULT } }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-sm font-semibold mb-2", style: { color: THEME.colors.text.secondary }, children: "Contact Number" }), _jsx("input", { type: "tel", value: contactNumber, onChange: (e) => {
                                                // Keep only digits, limit to 11
                                                let digits = e.target.value.replace(/\D/g, '');
                                                if (digits.length > 11)
                                                    digits = digits.slice(0, 11);
                                                setContactNumber(digits);
                                                setPhoneError('');
                                            }, placeholder: "09XXXXXXXXX", className: "w-full px-3 py-2 rounded-lg border outline-none focus:ring-2", style: {
                                                backgroundColor: phoneError ? '#fee2e2' : THEME.colors.background.tertiary,
                                                borderColor: phoneError ? '#ef4444' : THEME.colors.border.DEFAULT,
                                                color: THEME.colors.text.primary,
                                                '--tw-ring-color': THEME.colors.primary.DEFAULT
                                            } }), phoneError && (_jsx("p", { className: "text-sm mt-1", style: { color: '#ef4444' }, children: phoneError }))] })] }) })] }), _jsxs("div", { className: "flex justify-center gap-4 pt-4", children: [_jsx(Button, { onClick: handleCancel, style: {
                            backgroundColor: THEME.colors.background.tertiary,
                            color: THEME.colors.text.primary,
                            padding: '0.75rem 2rem'
                        }, children: "Cancel" }), _jsxs(Button, { onClick: handleSave, style: {
                            backgroundColor: THEME.colors.primary.DEFAULT,
                            color: 'white',
                            padding: '0.75rem 2rem'
                        }, children: [_jsx(Save, { className: "w-4 h-4 mr-2" }), "Save Changes"] })] }), toastMessage && (_jsx(Toast, { message: toastMessage, variant: toastVariant, onClose: () => setToastMessage(null) }))] }));
};
export default ProfileEdit;
