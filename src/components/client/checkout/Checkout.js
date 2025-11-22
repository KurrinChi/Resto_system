import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Wallet, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { Toast } from '../../common/Toast';
import { useCart } from '../cart/CartContext';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
const PLACEHOLDER_IMG = new URL('../../../assets/placeholder.png', import.meta.url).href;
const Checkout = () => {
    const navigate = useNavigate();
    const { items, total, clearCart } = useCart();
    // Order Type - Read from localStorage (set from Menu page)
    const orderType = localStorage.getItem('orderType') || 'delivery';
    // Delivery Address
    const [deliveryAddress, setDeliveryAddress] = useState('');
    const [noteToDriver, setNoteToDriver] = useState('');
    // Delivery Options
    const [deliveryOption, setDeliveryOption] = useState('standard');
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
    // Payment
    const [paymentMethod, setPaymentMethod] = useState('cod');
    // Calendar
    const [currentMonth, setCurrentMonth] = useState(new Date());
    // Toast
    const [toastMessage, setToastMessage] = useState(null);
    // Fetch address from header on mount
    useEffect(() => {
        const addressUpdateHandler = (e) => {
            const customEvent = e;
            if (customEvent.detail) {
                setDeliveryAddress(customEvent.detail);
            }
        };
        window.addEventListener('addressUpdated', addressUpdateHandler);
        // Try to get initial address from localStorage (same key as ClientHeader uses)
        const savedAddress = localStorage.getItem('userAddress') || 'Set your delivery address';
        setDeliveryAddress(savedAddress);
        return () => {
            window.removeEventListener('addressUpdated', addressUpdateHandler);
        };
    }, []);
    // Time slots
    const timeSlots = [
        '9:00 AM - 10:00 AM',
        '10:00 AM - 11:00 AM',
        '11:00 AM - 12:00 PM',
        '12:00 PM - 1:00 PM',
        '1:00 PM - 2:00 PM',
        '2:00 PM - 3:00 PM',
        '3:00 PM - 4:00 PM',
        '4:00 PM - 5:00 PM',
        '5:00 PM - 6:00 PM',
        '6:00 PM - 7:00 PM',
        '7:00 PM - 8:00 PM',
        '8:00 PM - 9:00 PM',
    ];
    // Calendar functions
    const getDaysInMonth = (date) => {
        const year = date.getFullYear();
        const month = date.getMonth();
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const daysInMonth = lastDay.getDate();
        const startingDayOfWeek = firstDay.getDay();
        return { daysInMonth, startingDayOfWeek };
    };
    const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentMonth);
    const goToPreviousMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
    };
    const goToNextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
    };
    const isDateDisabled = (day) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return date < today;
    };
    const isDateSelected = (day) => {
        if (!selectedDate)
            return false;
        return (selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentMonth.getMonth() &&
            selectedDate.getFullYear() === currentMonth.getFullYear());
    };
    const handleDateSelect = (day) => {
        if (isDateDisabled(day))
            return;
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        setSelectedDate(date);
    };
    const handlePlaceOrder = () => {
        if (items.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        // Only validate delivery address if order type is delivery
        if (orderType === 'delivery') {
            if (!deliveryAddress || deliveryAddress === 'Set your delivery address') {
                alert('Please set a delivery address!');
                return;
            }
            if (deliveryOption === 'scheduled' && (!selectedDate || !selectedTimeSlot)) {
                alert('Please select a date and time slot for scheduled delivery!');
                return;
            }
        }
        // Prepare order data
        const orderData = {
            items,
            deliveryAddress,
            noteToDriver,
            deliveryOption,
            scheduledDate: deliveryOption === 'scheduled' ? selectedDate : null,
            scheduledTime: deliveryOption === 'scheduled' ? selectedTimeSlot : null,
            paymentMethod,
            subtotal: total,
            total: total,
            orderDate: new Date().toISOString(),
        };
        console.log('Order placed:', orderData);
        // Clear cart
        clearCart();
        // Show success toast
        setToastMessage('Order Successfully Created');
        // Navigate to orders page after delay
        setTimeout(() => {
            navigate('/client/orders');
        }, 2000);
    };
    const subtotal = total;
    const deliveryFee = 0; // Can be calculated based on delivery option
    const finalTotal = subtotal + deliveryFee;
    if (items.length === 0) {
        return (_jsx("div", { className: "min-h-screen p-6", style: { backgroundColor: THEME.colors.background.primary }, children: _jsx("div", { className: "max-w-7xl mx-auto", children: _jsxs("div", { className: "flex flex-col items-center justify-center py-16", children: [_jsx("div", { className: "rounded-full p-6 mb-4", style: { backgroundColor: THEME.colors.background.tertiary }, children: _jsx(Wallet, { className: "w-16 h-16", style: { color: THEME.colors.text.tertiary } }) }), _jsx("h2", { className: "text-2xl font-bold mb-2", style: { color: THEME.colors.text.primary }, children: "Your cart is empty" }), _jsx("p", { className: "text-center mb-6", style: { color: THEME.colors.text.tertiary }, children: "Add some items to your cart before checking out" }), _jsx(Button, { onClick: () => navigate('/client/menu'), style: { backgroundColor: THEME.colors.primary.DEFAULT }, children: "Browse Menu" })] }) }) }));
    }
    return (_jsxs("div", { className: "min-h-screen p-4 md:p-6", style: {}, children: [_jsxs("div", { className: "max-w-7xl mx-auto", children: [_jsx("h1", { className: "text-3xl font-bold mb-6", style: { color: THEME.colors.text.primary }, children: "Checkout" }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-3 gap-6", children: [_jsxs("div", { className: "lg:col-span-2 space-y-6", children: [orderType === 'delivery' && (_jsxs(Card, { style: { backgroundColor: THEME.colors.background.secondary, borderColor: THEME.colors.border.DEFAULT }, children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "p-2 rounded-lg", style: { backgroundColor: THEME.colors.primary.DEFAULT + '20' }, children: _jsx(MapPin, { className: "w-5 h-5", style: { color: THEME.colors.primary.DEFAULT } }) }), _jsx("h2", { className: "text-xl font-semibold", style: { color: THEME.colors.text.primary }, children: "Delivery Address" })] }), _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", style: { color: THEME.colors.text.secondary }, children: "Address" }), _jsxs("div", { className: "flex gap-2", children: [_jsx(Input, { value: deliveryAddress, onChange: (e) => setDeliveryAddress(e.target.value), placeholder: "Enter your delivery address", className: "flex-1", style: {
                                                                            backgroundColor: THEME.colors.background.tertiary,
                                                                            borderColor: THEME.colors.border.DEFAULT,
                                                                            color: THEME.colors.text.primary,
                                                                        }, readOnly: true }), _jsxs(Button, { onClick: () => window.dispatchEvent(new Event('openMapModal')), className: "px-4", style: {
                                                                            backgroundColor: THEME.colors.primary.DEFAULT,
                                                                            color: '#FFFFFF',
                                                                            display: 'flex',
                                                                            alignItems: 'center',
                                                                            gap: '0.5rem',
                                                                        }, children: [_jsx(MapPin, { className: "w-4 h-4" }), "Change"] })] })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", style: { color: THEME.colors.text.secondary }, children: "Note to Driver (Building, Landmark, etc.)" }), _jsx("textarea", { value: noteToDriver, onChange: (e) => setNoteToDriver(e.target.value), placeholder: "e.g., Blue building, near the park, 3rd floor", rows: 3, className: "w-full px-4 py-2 rounded-lg border resize-none focus:outline-none focus:ring-2", style: {
                                                                    backgroundColor: THEME.colors.background.tertiary,
                                                                    borderColor: THEME.colors.border.DEFAULT,
                                                                    color: THEME.colors.text.primary,
                                                                } })] })] })] })), orderType === 'delivery' && (_jsxs(Card, { style: { backgroundColor: THEME.colors.background.secondary, borderColor: THEME.colors.border.DEFAULT }, children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "p-2 rounded-lg", style: { backgroundColor: THEME.colors.primary.DEFAULT + '20' }, children: _jsx(Clock, { className: "w-5 h-5", style: { color: THEME.colors.primary.DEFAULT } }) }), _jsx("h2", { className: "text-xl font-semibold", style: { color: THEME.colors.text.primary }, children: "Delivery Options" })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("div", { onClick: () => setDeliveryOption('standard'), className: "p-4 rounded-lg border-2 cursor-pointer transition-all", style: {
                                                            backgroundColor: deliveryOption === 'standard' ? THEME.colors.primary.DEFAULT + '10' : THEME.colors.background.tertiary,
                                                            borderColor: deliveryOption === 'standard' ? THEME.colors.primary.DEFAULT : THEME.colors.border.DEFAULT,
                                                        }, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-5 h-5 rounded-full border-2 flex items-center justify-center", style: { borderColor: deliveryOption === 'standard' ? THEME.colors.primary.DEFAULT : THEME.colors.border.DEFAULT }, children: deliveryOption === 'standard' && (_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: THEME.colors.primary.DEFAULT } })) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold", style: { color: THEME.colors.text.primary }, children: "Standard Delivery" }), _jsx("p", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: "Deliver as soon as possible (30-45 mins)" })] })] }) }), _jsxs("div", { onClick: () => setDeliveryOption('scheduled'), className: "p-4 rounded-lg border-2 cursor-pointer transition-all", style: {
                                                            backgroundColor: deliveryOption === 'scheduled' ? THEME.colors.primary.DEFAULT + '10' : THEME.colors.background.tertiary,
                                                            borderColor: deliveryOption === 'scheduled' ? THEME.colors.primary.DEFAULT : THEME.colors.border.DEFAULT,
                                                        }, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-5 h-5 rounded-full border-2 flex items-center justify-center", style: { borderColor: deliveryOption === 'scheduled' ? THEME.colors.primary.DEFAULT : THEME.colors.border.DEFAULT }, children: deliveryOption === 'scheduled' && (_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: THEME.colors.primary.DEFAULT } })) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold", style: { color: THEME.colors.text.primary }, children: "Scheduled Delivery" }), _jsx("p", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: "Choose a specific date and time" })] })] }), deliveryOption === 'scheduled' && (_jsxs("div", { className: "mt-4 space-y-4", children: [_jsxs("div", { className: "p-4 rounded-lg", style: { backgroundColor: THEME.colors.background.primary }, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("button", { onClick: (e) => {
                                                                                            e.stopPropagation();
                                                                                            goToPreviousMonth();
                                                                                        }, className: "p-2 rounded-lg hover:opacity-80 transition-opacity", style: { backgroundColor: THEME.colors.background.tertiary }, children: _jsx(ChevronLeft, { className: "w-5 h-5", style: { color: THEME.colors.text.primary } }) }), _jsx("h3", { className: "font-semibold", style: { color: THEME.colors.text.primary }, children: currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) }), _jsx("button", { onClick: (e) => {
                                                                                            e.stopPropagation();
                                                                                            goToNextMonth();
                                                                                        }, className: "p-2 rounded-lg hover:opacity-80 transition-opacity", style: { backgroundColor: THEME.colors.background.tertiary }, children: _jsx(ChevronRight, { className: "w-5 h-5", style: { color: THEME.colors.text.primary } }) })] }), _jsx("div", { className: "grid grid-cols-7 gap-2 mb-2", children: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (_jsx("div", { className: "text-center text-sm font-medium", style: { color: THEME.colors.text.tertiary }, children: day }, day))) }), _jsxs("div", { className: "grid grid-cols-7 gap-2", children: [Array.from({ length: startingDayOfWeek }).map((_, index) => (_jsx("div", {}, `empty-${index}`))), Array.from({ length: daysInMonth }).map((_, index) => {
                                                                                        const day = index + 1;
                                                                                        const disabled = isDateDisabled(day);
                                                                                        const selected = isDateSelected(day);
                                                                                        return (_jsx("button", { onClick: (e) => {
                                                                                                e.stopPropagation();
                                                                                                handleDateSelect(day);
                                                                                            }, disabled: disabled, className: "aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all", style: {
                                                                                                backgroundColor: selected
                                                                                                    ? THEME.colors.primary.DEFAULT
                                                                                                    : disabled
                                                                                                        ? 'transparent'
                                                                                                        : THEME.colors.background.tertiary,
                                                                                                color: selected
                                                                                                    ? '#FFFFFF'
                                                                                                    : disabled
                                                                                                        ? THEME.colors.text.tertiary
                                                                                                        : THEME.colors.text.primary,
                                                                                                cursor: disabled ? 'not-allowed' : 'pointer',
                                                                                                opacity: disabled ? 0.5 : 1,
                                                                                            }, children: day }, day));
                                                                                    })] })] }), selectedDate && (_jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium mb-2", style: { color: THEME.colors.text.secondary }, children: "Select Time Slot" }), _jsx("div", { className: "grid grid-cols-2 sm:grid-cols-3 gap-2", children: timeSlots.map((slot) => (_jsx("button", { onClick: (e) => {
                                                                                        e.stopPropagation();
                                                                                        setSelectedTimeSlot(slot);
                                                                                    }, className: "px-3 py-2 rounded-lg text-sm font-medium transition-all", style: {
                                                                                        backgroundColor: selectedTimeSlot === slot
                                                                                            ? THEME.colors.primary.DEFAULT
                                                                                            : THEME.colors.background.tertiary,
                                                                                        color: selectedTimeSlot === slot ? '#FFFFFF' : THEME.colors.text.primary,
                                                                                        borderWidth: 2,
                                                                                        borderColor: selectedTimeSlot === slot
                                                                                            ? THEME.colors.primary.DEFAULT
                                                                                            : THEME.colors.border.DEFAULT,
                                                                                    }, children: slot }, slot))) })] }))] }))] })] })] })), _jsxs(Card, { style: { backgroundColor: THEME.colors.background.secondary, borderColor: THEME.colors.border.DEFAULT }, children: [_jsxs("div", { className: "flex items-center gap-3 mb-4", children: [_jsx("div", { className: "p-2 rounded-lg", style: { backgroundColor: THEME.colors.primary.DEFAULT + '20' }, children: _jsx(Wallet, { className: "w-5 h-5", style: { color: THEME.colors.primary.DEFAULT } }) }), _jsx("h2", { className: "text-xl font-semibold", style: { color: THEME.colors.text.primary }, children: "Payment Options" })] }), _jsxs("div", { className: "space-y-3", children: [_jsx("div", { onClick: () => setPaymentMethod('cod'), className: "p-4 rounded-lg border-2 cursor-pointer transition-all", style: {
                                                            backgroundColor: paymentMethod === 'cod' ? THEME.colors.primary.DEFAULT + '10' : THEME.colors.background.tertiary,
                                                            borderColor: paymentMethod === 'cod' ? THEME.colors.primary.DEFAULT : THEME.colors.border.DEFAULT,
                                                        }, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-5 h-5 rounded-full border-2 flex items-center justify-center", style: { borderColor: paymentMethod === 'cod' ? THEME.colors.primary.DEFAULT : THEME.colors.border.DEFAULT }, children: paymentMethod === 'cod' && (_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: THEME.colors.primary.DEFAULT } })) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold", style: { color: THEME.colors.text.primary }, children: "Cash on Delivery" }), _jsx("p", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: "Pay with cash when your order arrives" })] })] }) }), _jsx("div", { onClick: () => setPaymentMethod('gcash'), className: "p-4 rounded-lg border-2 cursor-pointer transition-all", style: {
                                                            backgroundColor: paymentMethod === 'gcash' ? THEME.colors.primary.DEFAULT + '10' : THEME.colors.background.tertiary,
                                                            borderColor: paymentMethod === 'gcash' ? THEME.colors.primary.DEFAULT : THEME.colors.border.DEFAULT,
                                                        }, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-5 h-5 rounded-full border-2 flex items-center justify-center", style: { borderColor: paymentMethod === 'gcash' ? THEME.colors.primary.DEFAULT : THEME.colors.border.DEFAULT }, children: paymentMethod === 'gcash' && (_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: THEME.colors.primary.DEFAULT } })) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold", style: { color: THEME.colors.text.primary }, children: "GCash" }), _jsx("p", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: "Pay securely with GCash" })] })] }) }), _jsx("div", { onClick: () => setPaymentMethod('paymaya'), className: "p-4 rounded-lg border-2 cursor-pointer transition-all", style: {
                                                            backgroundColor: paymentMethod === 'paymaya' ? THEME.colors.primary.DEFAULT + '10' : THEME.colors.background.tertiary,
                                                            borderColor: paymentMethod === 'paymaya' ? THEME.colors.primary.DEFAULT : THEME.colors.border.DEFAULT,
                                                        }, children: _jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-5 h-5 rounded-full border-2 flex items-center justify-center", style: { borderColor: paymentMethod === 'paymaya' ? THEME.colors.primary.DEFAULT : THEME.colors.border.DEFAULT }, children: paymentMethod === 'paymaya' && (_jsx("div", { className: "w-3 h-3 rounded-full", style: { backgroundColor: THEME.colors.primary.DEFAULT } })) }), _jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "font-semibold", style: { color: THEME.colors.text.primary }, children: "PayMaya" }), _jsx("p", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: "Pay securely with PayMaya" })] })] }) })] })] }), _jsx("div", { className: "lg:hidden", children: _jsx(Button, { onClick: handlePlaceOrder, className: "w-full py-4 text-lg font-semibold", style: { backgroundColor: THEME.colors.primary.DEFAULT, color: '#FFFFFF' }, children: "Place Order" }) })] }), _jsx("div", { className: "lg:col-span-1", children: _jsx("div", { className: "sticky top-6", children: _jsxs(Card, { style: { backgroundColor: THEME.colors.background.secondary, borderColor: THEME.colors.border.DEFAULT }, children: [_jsx("h2", { className: "text-xl font-semibold mb-4", style: { color: THEME.colors.text.primary }, children: "Order Summary" }), _jsx("div", { className: "space-y-3 mb-4 max-h-[400px] overflow-y-auto", children: items.map((item) => (_jsxs("div", { className: "flex gap-3 p-3 rounded-lg", style: { backgroundColor: THEME.colors.background.tertiary }, children: [_jsx("img", { src: PLACEHOLDER_IMG, alt: item.name, className: "w-16 h-16 rounded-lg object-cover" }), _jsxs("div", { className: "flex-1 min-w-0", children: [_jsx("h3", { className: "font-medium text-sm truncate", style: { color: THEME.colors.text.primary }, children: item.name }), _jsxs("p", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: ["Qty: ", item.qty] }), _jsxs("p", { className: "text-sm font-semibold", style: { color: THEME.colors.primary.DEFAULT }, children: ["\u20B1", (item.price * item.qty).toFixed(2)] })] })] }, item.id))) }), _jsx("div", { className: "border-t my-4", style: { borderColor: THEME.colors.border.DEFAULT } }), _jsxs("div", { className: "space-y-2 mb-4", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { style: { color: THEME.colors.text.secondary }, children: "Subtotal" }), _jsxs("span", { className: "font-semibold", style: { color: THEME.colors.text.primary }, children: ["\u20B1", subtotal.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { style: { color: THEME.colors.text.secondary }, children: "Delivery Fee" }), _jsx("span", { className: "font-semibold", style: { color: THEME.colors.text.primary }, children: deliveryFee === 0 ? 'FREE' : `₱${deliveryFee.toFixed(2)}` })] })] }), _jsx("div", { className: "border-t my-4", style: { borderColor: THEME.colors.border.DEFAULT } }), _jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsx("span", { className: "text-lg font-semibold", style: { color: THEME.colors.text.primary }, children: "Total" }), _jsxs("span", { className: "text-2xl font-bold", style: { color: THEME.colors.primary.DEFAULT }, children: ["\u20B1", finalTotal.toFixed(2)] })] }), _jsx("div", { className: "hidden lg:block", children: _jsx(Button, { onClick: handlePlaceOrder, className: "w-full py-4 text-lg font-semibold", style: { backgroundColor: THEME.colors.primary.DEFAULT, color: '#FFFFFF' }, children: "Place Order" }) })] }) }) })] })] }), toastMessage && (_jsx(Toast, { message: toastMessage, onClose: () => setToastMessage(null) }))] }));
};
export default Checkout;
