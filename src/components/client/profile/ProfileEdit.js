import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { Button } from '../../common/Button';
import { useNavigate } from 'react-router-dom';
import { MapPin, Phone, CreditCard, Calendar, User, Save, Upload } from 'lucide-react';
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
    const [paymentMethod, setPaymentMethod] = React.useState('cod');
    const [gender, setGender] = React.useState('');
    const [birthday, setBirthday] = React.useState('');
    // Validation error states
    const [emailError, setEmailError] = React.useState('');
    const [phoneError, setPhoneError] = React.useState('');
    const [birthdayError, setBirthdayError] = React.useState('');
    // Load user data
    const [user, setUser] = React.useState(null);
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
            setPaymentMethod(userData.paymentMethod || 'cod');
            setGender(userData.gender || '');
            setBirthday(userData.birthday || '');
        }
        catch {
            // Fallback
        }
    }, []);
    const handleOpenMapModal = () => {
        window.dispatchEvent(new Event('openMapModal'));
    };
    const handleUpload = (file) => {
        if (!file)
            return;
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
                paymentMethod,
                gender,
                birthday,
                address: localStorage.getItem('userAddress') || user?.address
            };
            // Save to localStorage
            localStorage.setItem('rs_current_user', JSON.stringify(updatedUser));
            // Also update in users array if exists
            const usersRaw = localStorage.getItem('rs_users_v1');
            if (usersRaw) {
                const users = JSON.parse(usersRaw);
                const idx = users.findIndex((u) => u.id === user?.id);
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
    const address = localStorage.getItem('userAddress') || user.address || 'No address set';
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
                                            } }), emailError && (_jsx("p", { className: "text-sm mt-1", style: { color: '#ef4444' }, children: emailError }))] })] })] }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx("div", { className: "rounded-lg p-5", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "p-2 rounded-lg flex-shrink-0", style: { backgroundColor: THEME.colors.primary.DEFAULT + '20' }, children: _jsx(MapPin, { className: "w-5 h-5", style: { color: THEME.colors.primary.DEFAULT } }) }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h4", { className: "text-sm font-semibold mb-2", style: { color: THEME.colors.text.secondary }, children: "Address" }), _jsx("p", { className: "text-sm break-words mb-3", style: { color: THEME.colors.text.primary }, children: address }), _jsxs(Button, { variant: "secondary", onClick: handleOpenMapModal, className: "text-sm", style: {
                                                backgroundColor: THEME.colors.background.tertiary,
                                                color: THEME.colors.text.primary,
                                                padding: '0.5rem 1rem'
                                            }, children: [_jsx(MapPin, { className: "w-4 h-4 mr-2" }), "Change Address"] })] })] }) }), _jsx("div", { className: "rounded-lg p-5", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "p-2 rounded-lg flex-shrink-0", style: { backgroundColor: THEME.colors.primary.DEFAULT + '20' }, children: _jsx(Phone, { className: "w-5 h-5", style: { color: THEME.colors.primary.DEFAULT } }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-sm font-semibold mb-2", style: { color: THEME.colors.text.secondary }, children: "Contact Number" }), _jsx("input", { type: "tel", value: contactNumber, onChange: (e) => {
                                                // Remove all letters (A-Z, a-z) from input
                                                const cleaned = e.target.value.replace(/[A-Za-z]/g, '');
                                                setContactNumber(cleaned);
                                                setPhoneError(''); // Clear error on change
                                            }, placeholder: "+63 9XX XXX XXXX", className: "w-full px-3 py-2 rounded-lg border outline-none focus:ring-2", style: {
                                                backgroundColor: phoneError ? '#fee2e2' : THEME.colors.background.tertiary,
                                                borderColor: phoneError ? '#ef4444' : THEME.colors.border.DEFAULT,
                                                color: THEME.colors.text.primary,
                                                '--tw-ring-color': THEME.colors.primary.DEFAULT
                                            } }), phoneError && (_jsx("p", { className: "text-sm mt-1", style: { color: '#ef4444' }, children: phoneError }))] })] }) }), _jsx("div", { className: "rounded-lg p-5", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "p-2 rounded-lg flex-shrink-0", style: { backgroundColor: THEME.colors.primary.DEFAULT + '20' }, children: _jsx(CreditCard, { className: "w-5 h-5", style: { color: THEME.colors.primary.DEFAULT } }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-sm font-semibold mb-2", style: { color: THEME.colors.text.secondary }, children: "Saved Payment Method" }), _jsxs("select", { value: paymentMethod, onChange: (e) => setPaymentMethod(e.target.value), className: "w-full px-3 py-2 rounded-lg border outline-none focus:ring-2", style: {
                                                backgroundColor: THEME.colors.background.tertiary,
                                                borderColor: THEME.colors.border.DEFAULT,
                                                color: THEME.colors.text.primary,
                                                '--tw-ring-color': THEME.colors.primary.DEFAULT
                                            }, children: [_jsx("option", { value: "cod", children: "Cash on Delivery" }), _jsx("option", { value: "gcash", children: "GCash" }), _jsx("option", { value: "paymaya", children: "PayMaya" })] })] })] }) }), _jsx("div", { className: "rounded-lg p-5", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "p-2 rounded-lg flex-shrink-0", style: { backgroundColor: THEME.colors.primary.DEFAULT + '20' }, children: _jsx(User, { className: "w-5 h-5", style: { color: THEME.colors.primary.DEFAULT } }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-sm font-semibold mb-2", style: { color: THEME.colors.text.secondary }, children: "Gender" }), _jsxs("select", { value: gender, onChange: (e) => setGender(e.target.value), className: "w-full px-3 py-2 rounded-lg border outline-none focus:ring-2", style: {
                                                backgroundColor: THEME.colors.background.tertiary,
                                                borderColor: THEME.colors.border.DEFAULT,
                                                color: THEME.colors.text.primary,
                                                '--tw-ring-color': THEME.colors.primary.DEFAULT
                                            }, children: [_jsx("option", { value: "", children: "Select Gender" }), _jsx("option", { value: "male", children: "Male" }), _jsx("option", { value: "female", children: "Female" }), _jsx("option", { value: "other", children: "Other" }), _jsx("option", { value: "prefer_not_to_say", children: "Prefer not to say" })] })] })] }) }), _jsx("div", { className: "rounded-lg p-5 md:col-span-2", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: _jsxs("div", { className: "flex items-start gap-3", children: [_jsx("div", { className: "p-2 rounded-lg flex-shrink-0", style: { backgroundColor: THEME.colors.primary.DEFAULT + '20' }, children: _jsx(Calendar, { className: "w-5 h-5", style: { color: THEME.colors.primary.DEFAULT } }) }), _jsxs("div", { className: "flex-1", children: [_jsx("h4", { className: "text-sm font-semibold mb-2", style: { color: THEME.colors.text.secondary }, children: "Birthday" }), _jsx("input", { type: "date", value: birthday, onChange: (e) => {
                                                setBirthday(e.target.value);
                                                setBirthdayError(''); // Clear error on change
                                            }, className: "w-full px-3 py-2 rounded-lg border outline-none focus:ring-2", style: {
                                                backgroundColor: birthdayError ? '#fee2e2' : THEME.colors.background.tertiary,
                                                borderColor: birthdayError ? '#ef4444' : THEME.colors.border.DEFAULT,
                                                color: THEME.colors.text.primary,
                                                '--tw-ring-color': THEME.colors.primary.DEFAULT
                                            } }), birthdayError && (_jsx("p", { className: "text-sm mt-1", style: { color: '#ef4444' }, children: birthdayError }))] })] }) })] }), _jsxs("div", { className: "flex justify-center gap-4 pt-4", children: [_jsx(Button, { onClick: handleCancel, style: {
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
