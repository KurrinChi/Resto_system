import React from 'react';
import { Card } from '../../common/Card';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { Package, Search, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ordersApi } from '../../../services/apiservice';

type OrderItem = {
  name: string;
  quantity: number;
  price: number;
  qty?: number;
};

type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  totalFee?: number;
  type: string;
  orderType?: string;
  status: string;
  orderStatus?: string;
  createdAt: string;
  deliveryAddress?: string;
  contact?: string;
};

export const OrderHistory: React.FC = () => {
  // Filter states
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState('');
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(new Date());
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Fetch orders from Firebase
  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const currentUser = JSON.parse(localStorage.getItem('rs_current_user') || 'null');
        const guestId = localStorage.getItem('rs_guest_id');

        // Fetch all orders (in real app, filter by user/guest on backend)
        const response = await ordersApi.getAll();
        
        if (response.success && response.data) {
          // Filter orders by current user or guest
          let userOrders = response.data;
          if (currentUser?.id) {
            userOrders = response.data.filter((o: any) => o.userId === currentUser.id.toString());
          } else if (guestId) {
            userOrders = response.data.filter((o: any) => o.guestId === guestId);
          }

          // Transform Firebase order format to component format
          const transformedOrders = userOrders.map((order: any) => ({
            id: order.id || order.name,
            items: (order.items || []).map((item: any) => ({
              name: item.name,
              price: parseFloat(item.price || 0),
              qty: item.quantity || item.qty || 1,
            })),
            total: parseFloat(order.totalFee || order.total || 0),
            type: (order.orderType || order.type || 'delivery').toLowerCase(),
            status: (order.orderStatus || order.status || 'received').toLowerCase(),
            createdAt: order.createdAt || order.created_at || new Date().toISOString(),
            deliveryAddress: order.deliveryAddress || '',
            contact: order.contact || '',
          }));
          
          setOrders(transformedOrders);
        }
      } catch (error) {
        console.error('Failed to fetch orders:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  // Animation styles
  React.useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeInUp {
        from {
          opacity: 0;
          transform: translateY(20px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
      .order-card-hover-zoom {
        transition: box-shadow 0.3s ease;
      }
      .order-card-hover-zoom:hover {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15) !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);
  
  // Filter orders based on search query and date
  const filteredOrders = orders.filter(order => {
    // Filter by Order ID
    const matchesSearch = searchQuery.trim() === '' || 
      order.id.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Filter by Date
    const matchesDate = selectedDate === '' || 
      new Date(order.createdAt).toISOString().split('T')[0] === selectedDate;
    
    return matchesSearch && matchesDate;
  });

  // Calendar helper functions
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

  const handleDateSelect = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    const dateString = date.toISOString().split('T')[0];
    setSelectedDate(dateString);
    setShowCalendar(false);
  };

  const isDateSelected = (day: number) => {
    if (!selectedDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toISOString().split('T')[0] === selectedDate;
  };

  const clearDateFilter = () => {
    setSelectedDate('');
    setShowCalendar(false);
  };

  // Close calendar when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showCalendar && !target.closest('.calendar-container')) {
        setShowCalendar(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showCalendar]);

  // Sample customer data (in real app, this would come from context/API)
  const customerName = "Guest User";
  const customerAddress = localStorage.getItem('userAddress') || "No address provided";

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return '#10b981'; // green
      case 'preparing':
      case 'ready':
        return '#f59e0b'; // orange
      case 'received':
      case 'pending':
        return '#3b82f6'; // blue
      case 'out_for_delivery':
        return '#8b5cf6'; // purple
      default:
        return THEME.colors.text.tertiary;
    }
  };

  const getStatusLabel = (status: string) => {
    return status.replace(/_/g, ' ').toUpperCase();
  };

  const hasFilters = searchQuery.trim() !== '' || selectedDate !== '';

  if (loading) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold" style={{ color: THEME.colors.text.primary }}>
          Order History
        </h2>
        <div className="min-h-[400px] flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 mb-4" style={{ borderColor: THEME.colors.primary.DEFAULT }}></div>
          <p className="text-sm" style={{ color: THEME.colors.text.tertiary }}>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (filteredOrders.length === 0) {
    return (
      <div className="space-y-6">
        {/* Search and Filter Section */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search by Order ID */}
          <div className="flex-1">
            <label className="block text-sm font-medium mb-2" style={{ color: THEME.colors.text.secondary }}>
              Search Order ID
            </label>
            <div className="relative">
              <Search 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" 
                style={{ color: THEME.colors.text.tertiary }} 
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Enter order ID..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border outline-none focus:ring-2 transition-all"
                style={{
                  backgroundColor: THEME.colors.background.secondary,
                  borderColor: THEME.colors.border.DEFAULT,
                  color: THEME.colors.text.primary,
                  '--tw-ring-color': THEME.colors.primary.DEFAULT
                } as React.CSSProperties}
              />
            </div>
          </div>

          {/* Filter by Date */}
          <div className="flex-1 relative calendar-container">
            <label className="block text-sm font-medium mb-2" style={{ color: THEME.colors.text.secondary }}>
              Filter by Date
            </label>
            <div className="relative">
              <Calendar 
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10" 
                style={{ color: THEME.colors.text.tertiary }} 
              />
              <input
                type="text"
                value={selectedDate ? new Date(selectedDate).toLocaleDateString() : ''}
                onClick={() => setShowCalendar(!showCalendar)}
                readOnly
                placeholder="Select date..."
                className="w-full pl-10 pr-10 py-2 rounded-lg border outline-none focus:ring-2 transition-all cursor-pointer"
                style={{
                  backgroundColor: THEME.colors.background.secondary,
                  borderColor: THEME.colors.border.DEFAULT,
                  color: THEME.colors.text.primary,
                  '--tw-ring-color': THEME.colors.primary.DEFAULT
                } as React.CSSProperties}
              />
              {selectedDate && (
                <button
                  onClick={clearDateFilter}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-opacity-80 transition-all z-10"
                  style={{ backgroundColor: THEME.colors.background.tertiary }}
                >
                  <X className="w-3 h-3" style={{ color: THEME.colors.text.tertiary }} />
                </button>
              )}
            </div>

            {/* Calendar Dropdown */}
            {showCalendar && (
              <div 
                className="absolute top-full mt-2 z-50 rounded-lg shadow-xl p-4"
                style={{
                  backgroundColor: THEME.colors.background.secondary,
                  border: `1px solid ${THEME.colors.border.DEFAULT}`,
                  minWidth: '320px'
                }}
              >
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={goToPreviousMonth}
                    className="p-2 rounded-lg hover:bg-opacity-80 transition-opacity"
                    style={{ backgroundColor: THEME.colors.background.tertiary }}
                  >
                    <ChevronLeft className="w-5 h-5" style={{ color: THEME.colors.text.primary }} />
                  </button>
                  <h3 className="font-semibold" style={{ color: THEME.colors.text.primary }}>
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </h3>
                  <button
                    onClick={goToNextMonth}
                    className="p-2 rounded-lg hover:bg-opacity-80 transition-opacity"
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
                    const selected = isDateSelected(day);

                    return (
                      <button
                        key={day}
                        onClick={() => handleDateSelect(day)}
                        className="aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all hover:bg-opacity-80"
                        style={{
                          backgroundColor: selected
                            ? THEME.colors.primary.DEFAULT
                            : THEME.colors.background.tertiary,
                          color: selected
                            ? '#FFFFFF'
                            : THEME.colors.text.primary,
                        }}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <h2 className="text-2xl font-bold" style={{ color: THEME.colors.text.primary }}>
          Order History
        </h2>

        <div className="min-h-[400px] flex flex-col items-center justify-center">
          <div className="rounded-full p-6 mb-4" style={{ backgroundColor: THEME.colors.background.tertiary }}>
            <Package className="w-16 h-16" style={{ color: THEME.colors.text.tertiary }} />
          </div>
          <h3 className="text-xl font-semibold mb-2" style={{ color: THEME.colors.text.primary }}>
            {hasFilters ? 'No orders found' : 'No orders yet'}
          </h3>
          <p className="text-sm" style={{ color: THEME.colors.text.tertiary }}>
            {hasFilters ? 'Try adjusting your filters' : 'Your order history will appear here'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Search and Filter Section */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search by Order ID */}
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2" style={{ color: THEME.colors.text.secondary }}>
            Search Order ID
          </label>
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" 
              style={{ color: THEME.colors.text.tertiary }} 
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Enter order ID..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: THEME.colors.background.secondary,
                borderColor: THEME.colors.border.DEFAULT,
                color: THEME.colors.text.primary,
                '--tw-ring-color': THEME.colors.primary.DEFAULT
              } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Filter by Date */}
        <div className="flex-1 relative calendar-container">
          <label className="block text-sm font-medium mb-2" style={{ color: THEME.colors.text.secondary }}>
            Filter by Date
          </label>
          <div className="relative">
            <Calendar 
              className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 z-10" 
              style={{ color: THEME.colors.text.tertiary }} 
            />
            <input
              type="text"
              value={selectedDate ? new Date(selectedDate).toLocaleDateString() : ''}
              onClick={() => setShowCalendar(!showCalendar)}
              readOnly
              placeholder="Select date..."
              className="w-full pl-10 pr-10 py-2 rounded-lg border outline-none focus:ring-2 transition-all cursor-pointer"
              style={{
                backgroundColor: THEME.colors.background.secondary,
                borderColor: THEME.colors.border.DEFAULT,
                color: THEME.colors.text.primary,
                '--tw-ring-color': THEME.colors.primary.DEFAULT
              } as React.CSSProperties}
            />
            {selectedDate && (
              <button
                onClick={clearDateFilter}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-opacity-80 transition-all z-10"
                style={{ backgroundColor: THEME.colors.background.tertiary }}
              >
                <X className="w-3 h-3" style={{ color: THEME.colors.text.tertiary }} />
              </button>
            )}
          </div>

          {/* Calendar Dropdown */}
          {showCalendar && (
            <div 
              className="absolute top-full mt-2 z-50 rounded-lg shadow-xl p-4"
              style={{
                backgroundColor: THEME.colors.background.secondary,
                border: `1px solid ${THEME.colors.border.DEFAULT}`,
                minWidth: '320px'
              }}
            >
              {/* Calendar Header */}
              <div className="flex items-center justify-between mb-4">
                <button
                  onClick={goToPreviousMonth}
                  className="p-2 rounded-lg hover:bg-opacity-80 transition-opacity"
                  style={{ backgroundColor: THEME.colors.background.tertiary }}
                >
                  <ChevronLeft className="w-5 h-5" style={{ color: THEME.colors.text.primary }} />
                </button>
                <h3 className="font-semibold" style={{ color: THEME.colors.text.primary }}>
                  {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <button
                  onClick={goToNextMonth}
                  className="p-2 rounded-lg hover:bg-opacity-80 transition-opacity"
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
                  const selected = isDateSelected(day);

                  return (
                    <button
                      key={day}
                      onClick={() => handleDateSelect(day)}
                      className="aspect-square flex items-center justify-center rounded-lg text-sm font-medium transition-all hover:bg-opacity-80"
                      style={{
                        backgroundColor: selected
                          ? THEME.colors.primary.DEFAULT
                          : THEME.colors.background.tertiary,
                        color: selected
                          ? '#FFFFFF'
                          : THEME.colors.text.primary,
                      }}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      <h2 className="text-2xl font-bold" style={{ color: THEME.colors.text.primary }}>
        Order History
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOrders.map((order, index) => {
          const subtotal = order.items.reduce((sum, item) => sum + (item.price * item.qty), 0);
          
          return (
            <Card 
              key={order.id} 
              padding="lg"
              className="order-card-hover-zoom"
              style={{ 
                backgroundColor: THEME.colors.background.secondary, 
                borderColor: THEME.colors.border.DEFAULT,
                animation: `fadeInUp 0.5s ease-in-out forwards`,
                animationDelay: `${index * 100}ms`,
                opacity: 0
              }}
            >
              {/* Order ID */}
              <div className="mb-4 pb-3 border-b" style={{ borderColor: THEME.colors.border.DEFAULT }}>
                <h3 className="text-lg font-bold" style={{ color: THEME.colors.text.primary }}>
                  Order ID: {order.id}
                </h3>
                <p className="text-xs mt-1" style={{ color: THEME.colors.text.tertiary }}>
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>

              {/* Customer Information */}
              <div className="mb-4 space-y-1">
                <div className="flex gap-2">
                  <span className="text-sm font-medium" style={{ color: THEME.colors.text.secondary }}>
                    Customer Name:
                  </span>
                  <span className="text-sm" style={{ color: THEME.colors.text.primary }}>
                    {customerName}
                  </span>
                </div>
                {order.type === 'delivery' && (
                  <div className="flex gap-2">
                    <span className="text-sm font-medium" style={{ color: THEME.colors.text.secondary }}>
                      Customer Address:
                    </span>
                    <span className="text-sm" style={{ color: THEME.colors.text.primary }}>
                      {customerAddress}
                    </span>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="mb-4">
                <h4 className="text-sm font-semibold mb-2" style={{ color: THEME.colors.text.primary }}>
                  Order Items:
                </h4>
                <div className="space-y-2">
                  {order.items.map((item, index) => (
                    <div 
                      key={index} 
                      className="flex justify-between items-center py-2 px-3 rounded"
                      style={{ backgroundColor: THEME.colors.background.tertiary }}
                    >
                      <div className="flex-1">
                        <span className="text-sm" style={{ color: THEME.colors.text.primary }}>
                          {item.name} x{item.qty}
                        </span>
                      </div>
                      <span className="text-sm font-medium" style={{ color: THEME.colors.text.primary }}>
                        ₱{(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Divider */}
              <div className="border-t my-3" style={{ borderColor: THEME.colors.border.DEFAULT }} />

              {/* Pricing */}
              <div className="space-y-1 mb-4">
                <div className="flex justify-between text-sm">
                  <span style={{ color: THEME.colors.text.secondary }}>Subtotal</span>
                  <span style={{ color: THEME.colors.text.primary }}>₱{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-base font-bold">
                  <span style={{ color: THEME.colors.text.primary }}>Total</span>
                  <span style={{ color: THEME.colors.primary.DEFAULT }}>₱{order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t my-3" style={{ borderColor: THEME.colors.border.DEFAULT }} />

              {/* Status and Order Type */}
              <div className="flex items-center justify-between">
                <div 
                  className="px-3 py-1 rounded-full text-sm font-semibold"
                  style={{ 
                    backgroundColor: getStatusColor(order.status) + '20',
                    color: getStatusColor(order.status)
                  }}
                >
                  {getStatusLabel(order.status)}
                </div>
                <div 
                  className="text-sm font-medium capitalize"
                  style={{ color: THEME.colors.text.secondary }}
                >
                  {order.type}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default OrderHistory;
