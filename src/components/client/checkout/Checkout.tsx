import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Clock, Wallet, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { Input } from '../../common/Input';
import { Toast } from '../../common/Toast';
import { useCart } from '../cart/CartContext';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';

const PLACEHOLDER_IMG = new URL('../../../assets/placeholder.png', import.meta.url).href;

type DeliveryOption = 'standard' | 'scheduled';
type PaymentMethod = 'cod' | 'gcash' | 'paymaya';
type OrderType = 'delivery' | 'pickup';

const Checkout: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  
  // Order Type - Read from localStorage (set from Menu page)
  const orderType: OrderType = (localStorage.getItem('orderType') as OrderType) || 'delivery';
  
  // Delivery Address
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [noteToDriver, setNoteToDriver] = useState('');
  
  // Delivery Options
  const [deliveryOption, setDeliveryOption] = useState<DeliveryOption>('standard');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState('');
  
  // Payment
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
  
  // Calendar
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Fetch address from header on mount
  useEffect(() => {
    const addressUpdateHandler = (e: Event) => {
      const customEvent = e as CustomEvent;
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
  const getDaysInMonth = (date: Date) => {
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

  const isDateDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    return (
      selectedDate.getDate() === day &&
      selectedDate.getMonth() === currentMonth.getMonth() &&
      selectedDate.getFullYear() === currentMonth.getFullYear()
    );
  };

  const handleDateSelect = (day: number) => {
    if (isDateDisabled(day)) return;
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
  const deliveryFee: number = 0; // Can be calculated based on delivery option
  const finalTotal = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: THEME.colors.background.primary }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center justify-center py-16">
            <div className="rounded-full p-6 mb-4" style={{ backgroundColor: THEME.colors.background.tertiary }}>
              <Wallet className="w-16 h-16" style={{ color: THEME.colors.text.tertiary }} />
            </div>
            <h2 className="text-2xl font-bold mb-2" style={{ color: THEME.colors.text.primary }}>
              Your cart is empty
            </h2>
            <p className="text-center mb-6" style={{ color: THEME.colors.text.tertiary }}>
              Add some items to your cart before checking out
            </p>
            <Button onClick={() => navigate('/client/menu')} style={{ backgroundColor: THEME.colors.primary.DEFAULT }}>
              Browse Menu
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6" style={{}}>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6" style={{ color: THEME.colors.text.primary }}>
          Checkout
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Checkout Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Delivery Address Section - Only show for delivery */}
            {orderType === 'delivery' && (
            <Card style={{ backgroundColor: THEME.colors.background.secondary, borderColor: THEME.colors.border.DEFAULT }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: THEME.colors.primary.DEFAULT + '20' }}>
                  <MapPin className="w-5 h-5" style={{ color: THEME.colors.primary.DEFAULT }} />
                </div>
                <h2 className="text-xl font-semibold" style={{ color: THEME.colors.text.primary }}>
                  Delivery Address
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: THEME.colors.text.secondary }}>
                    Address
                  </label>
                  <div className="flex gap-2">
                    <Input
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      placeholder="Enter your delivery address"
                      className="flex-1"
                      style={{
                        backgroundColor: THEME.colors.background.tertiary,
                        borderColor: THEME.colors.border.DEFAULT,
                        color: THEME.colors.text.primary,
                      }}
                      readOnly
                    />
                    <Button
                      onClick={() => window.dispatchEvent(new Event('openMapModal'))}
                      className="px-4"
                      style={{
                        backgroundColor: THEME.colors.primary.DEFAULT,
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}
                    >
                      <MapPin className="w-4 h-4" />
                      Change
                    </Button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: THEME.colors.text.secondary }}>
                    Note to Driver (Building, Landmark, etc.)
                  </label>
                  <textarea
                    value={noteToDriver}
                    onChange={(e) => setNoteToDriver(e.target.value)}
                    placeholder="e.g., Blue building, near the park, 3rd floor"
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border resize-none focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: THEME.colors.background.tertiary,
                      borderColor: THEME.colors.border.DEFAULT,
                      color: THEME.colors.text.primary,
                    }}
                  />
                </div>
              </div>
            </Card>
            )}

            {/* Delivery Options Section - Only show for delivery */}
            {orderType === 'delivery' && (
            <Card style={{ backgroundColor: THEME.colors.background.secondary, borderColor: THEME.colors.border.DEFAULT }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: THEME.colors.primary.DEFAULT + '20' }}>
                  <Clock className="w-5 h-5" style={{ color: THEME.colors.primary.DEFAULT }} />
                </div>
                <h2 className="text-xl font-semibold" style={{ color: THEME.colors.text.primary }}>
                  Delivery Options
                </h2>
              </div>

              <div className="space-y-4">
                {/* Standard Delivery */}
                <div
                  onClick={() => setDeliveryOption('standard')}
                  className="p-4 rounded-lg border-2 cursor-pointer transition-all"
                  style={{
                    backgroundColor: deliveryOption === 'standard' ? THEME.colors.primary.DEFAULT + '10' : THEME.colors.background.tertiary,
                    borderColor: deliveryOption === 'standard' ? THEME.colors.primary.DEFAULT : THEME.colors.border.DEFAULT,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: deliveryOption === 'standard' ? THEME.colors.primary.DEFAULT : THEME.colors.border.DEFAULT }}
                    >
                      {deliveryOption === 'standard' && (
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: THEME.colors.primary.DEFAULT }} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold" style={{ color: THEME.colors.text.primary }}>
                        Standard Delivery
                      </h3>
                      <p className="text-sm" style={{ color: THEME.colors.text.tertiary }}>
                        Deliver as soon as possible (30-45 mins)
                      </p>
                    </div>
                  </div>
                </div>

                {/* Scheduled Delivery */}
                <div
                  onClick={() => setDeliveryOption('scheduled')}
                  className="p-4 rounded-lg border-2 cursor-pointer transition-all"
                  style={{
                    backgroundColor: deliveryOption === 'scheduled' ? THEME.colors.primary.DEFAULT + '10' : THEME.colors.background.tertiary,
                    borderColor: deliveryOption === 'scheduled' ? THEME.colors.primary.DEFAULT : THEME.colors.border.DEFAULT,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: deliveryOption === 'scheduled' ? THEME.colors.primary.DEFAULT : THEME.colors.border.DEFAULT }}
                    >
                      {deliveryOption === 'scheduled' && (
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: THEME.colors.primary.DEFAULT }} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold" style={{ color: THEME.colors.text.primary }}>
                        Scheduled Delivery
                      </h3>
                      <p className="text-sm" style={{ color: THEME.colors.text.tertiary }}>
                        Choose a specific date and time
                      </p>
                    </div>
                  </div>

                  {/* Calendar and Time Slots */}
                  {deliveryOption === 'scheduled' && (
                    <div className="mt-4 space-y-4">
                      {/* Calendar */}
                      <div className="p-4 rounded-lg" style={{ backgroundColor: THEME.colors.background.primary }}>
                        <div className="flex items-center justify-between mb-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              goToPreviousMonth();
                            }}
                            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: THEME.colors.background.tertiary }}
                          >
                            <ChevronLeft className="w-5 h-5" style={{ color: THEME.colors.text.primary }} />
                          </button>
                          <h3 className="font-semibold" style={{ color: THEME.colors.text.primary }}>
                            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                          </h3>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              goToNextMonth();
                            }}
                            className="p-2 rounded-lg hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: THEME.colors.background.tertiary }}
                          >
                            <ChevronRight className="w-5 h-5" style={{ color: THEME.colors.text.primary }} />
                          </button>
                        </div>

                        {/* Day headers */}
                        <div className="grid grid-cols-7 gap-2 mb-2">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                            <div key={day} className="text-center text-sm font-medium" style={{ color: THEME.colors.text.tertiary }}>
                              {day}
                            </div>
                          ))}
                        </div>

                        {/* Calendar days */}
                        <div className="grid grid-cols-7 gap-2">
                          {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                            <div key={`empty-${index}`} />
                          ))}
                          {Array.from({ length: daysInMonth }).map((_, index) => {
                            const day = index + 1;
                            const disabled = isDateDisabled(day);
                            const selected = isDateSelected(day);

                            return (
                              <button
                                key={day}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDateSelect(day);
                                }}
                                disabled={disabled}
                                className="aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all"
                                style={{
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
                                }}
                              >
                                {day}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Time Slots */}
                      {selectedDate && (
                        <div>
                          <label className="block text-sm font-medium mb-2" style={{ color: THEME.colors.text.secondary }}>
                            Select Time Slot
                          </label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {timeSlots.map((slot) => (
                              <button
                                key={slot}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setSelectedTimeSlot(slot);
                                }}
                                className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                                style={{
                                  backgroundColor: selectedTimeSlot === slot
                                    ? THEME.colors.primary.DEFAULT
                                    : THEME.colors.background.tertiary,
                                  color: selectedTimeSlot === slot ? '#FFFFFF' : THEME.colors.text.primary,
                                  borderWidth: 2,
                                  borderColor: selectedTimeSlot === slot
                                    ? THEME.colors.primary.DEFAULT
                                    : THEME.colors.border.DEFAULT,
                                }}
                              >
                                {slot}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
            )}

            {/* Payment Options Section */}
            <Card style={{ backgroundColor: THEME.colors.background.secondary, borderColor: THEME.colors.border.DEFAULT }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-lg" style={{ backgroundColor: THEME.colors.primary.DEFAULT + '20' }}>
                  <Wallet className="w-5 h-5" style={{ color: THEME.colors.primary.DEFAULT }} />
                </div>
                <h2 className="text-xl font-semibold" style={{ color: THEME.colors.text.primary }}>
                  Payment Options
                </h2>
              </div>

              <div className="space-y-3">
                {/* Cash on Delivery */}
                <div
                  onClick={() => setPaymentMethod('cod')}
                  className="p-4 rounded-lg border-2 cursor-pointer transition-all"
                  style={{
                    backgroundColor: paymentMethod === 'cod' ? THEME.colors.primary.DEFAULT + '10' : THEME.colors.background.tertiary,
                    borderColor: paymentMethod === 'cod' ? THEME.colors.primary.DEFAULT : THEME.colors.border.DEFAULT,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: paymentMethod === 'cod' ? THEME.colors.primary.DEFAULT : THEME.colors.border.DEFAULT }}
                    >
                      {paymentMethod === 'cod' && (
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: THEME.colors.primary.DEFAULT }} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold" style={{ color: THEME.colors.text.primary }}>
                        Cash on Delivery
                      </h3>
                      <p className="text-sm" style={{ color: THEME.colors.text.tertiary }}>
                        Pay with cash when your order arrives
                      </p>
                    </div>
                  </div>
                </div>

                {/* GCash */}
                <div
                  onClick={() => setPaymentMethod('gcash')}
                  className="p-4 rounded-lg border-2 cursor-pointer transition-all"
                  style={{
                    backgroundColor: paymentMethod === 'gcash' ? THEME.colors.primary.DEFAULT + '10' : THEME.colors.background.tertiary,
                    borderColor: paymentMethod === 'gcash' ? THEME.colors.primary.DEFAULT : THEME.colors.border.DEFAULT,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: paymentMethod === 'gcash' ? THEME.colors.primary.DEFAULT : THEME.colors.border.DEFAULT }}
                    >
                      {paymentMethod === 'gcash' && (
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: THEME.colors.primary.DEFAULT }} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold" style={{ color: THEME.colors.text.primary }}>
                        GCash
                      </h3>
                      <p className="text-sm" style={{ color: THEME.colors.text.tertiary }}>
                        Pay securely with GCash
                      </p>
                    </div>
                  </div>
                </div>

                {/* PayMaya */}
                <div
                  onClick={() => setPaymentMethod('paymaya')}
                  className="p-4 rounded-lg border-2 cursor-pointer transition-all"
                  style={{
                    backgroundColor: paymentMethod === 'paymaya' ? THEME.colors.primary.DEFAULT + '10' : THEME.colors.background.tertiary,
                    borderColor: paymentMethod === 'paymaya' ? THEME.colors.primary.DEFAULT : THEME.colors.border.DEFAULT,
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full border-2 flex items-center justify-center"
                      style={{ borderColor: paymentMethod === 'paymaya' ? THEME.colors.primary.DEFAULT : THEME.colors.border.DEFAULT }}
                    >
                      {paymentMethod === 'paymaya' && (
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: THEME.colors.primary.DEFAULT }} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold" style={{ color: THEME.colors.text.primary }}>
                        PayMaya
                      </h3>
                      <p className="text-sm" style={{ color: THEME.colors.text.tertiary }}>
                        Pay securely with PayMaya
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Place Order Button - Mobile */}
            <div className="lg:hidden">
              <Button
                onClick={handlePlaceOrder}
                className="w-full py-4 text-lg font-semibold"
                style={{ backgroundColor: THEME.colors.primary.DEFAULT, color: '#FFFFFF' }}
              >
                Place Order
              </Button>
            </div>
          </div>

          {/* Right Panel - Order Summary */}
          <div className="lg:col-span-1">
            <div className="sticky top-6">
              <Card style={{ backgroundColor: THEME.colors.background.secondary, borderColor: THEME.colors.border.DEFAULT }}>
                <h2 className="text-xl font-semibold mb-4" style={{ color: THEME.colors.text.primary }}>
                  Order Summary
                </h2>

                {/* Cart Items */}
                <div className="space-y-3 mb-4 max-h-[400px] overflow-y-auto">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 rounded-lg"
                      style={{ backgroundColor: THEME.colors.background.tertiary }}
                    >
                      <img
                        src={PLACEHOLDER_IMG}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-sm truncate" style={{ color: THEME.colors.text.primary }}>
                          {item.name}
                        </h3>
                        <p className="text-sm" style={{ color: THEME.colors.text.tertiary }}>
                          Qty: {item.qty}
                        </p>
                        <p className="text-sm font-semibold" style={{ color: THEME.colors.primary.DEFAULT }}>
                          ₱{(item.price * item.qty).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Divider */}
                <div className="border-t my-4" style={{ borderColor: THEME.colors.border.DEFAULT }} />

                {/* Pricing */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span style={{ color: THEME.colors.text.secondary }}>Subtotal</span>
                    <span className="font-semibold" style={{ color: THEME.colors.text.primary }}>
                      ₱{subtotal.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span style={{ color: THEME.colors.text.secondary }}>Delivery Fee</span>
                    <span className="font-semibold" style={{ color: THEME.colors.text.primary }}>
                      {deliveryFee === 0 ? 'FREE' : `₱${deliveryFee.toFixed(2)}`}
                    </span>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t my-4" style={{ borderColor: THEME.colors.border.DEFAULT }} />

                {/* Total */}
                <div className="flex justify-between items-center mb-6">
                  <span className="text-lg font-semibold" style={{ color: THEME.colors.text.primary }}>
                    Total
                  </span>
                  <span className="text-2xl font-bold" style={{ color: THEME.colors.primary.DEFAULT }}>
                    ₱{finalTotal.toFixed(2)}
                  </span>
                </div>

                {/* Place Order Button - Desktop */}
                <div className="hidden lg:block">
                  <Button
                    onClick={handlePlaceOrder}
                    className="w-full py-4 text-lg font-semibold"
                    style={{ backgroundColor: THEME.colors.primary.DEFAULT, color: '#FFFFFF' }}
                  >
                    Place Order
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          onClose={() => setToastMessage(null)}
        />
      )}
    </div>
  );
};

export default Checkout;
