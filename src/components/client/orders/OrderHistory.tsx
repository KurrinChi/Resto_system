import React from 'react';
import { Card } from '../../common/Card';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { useCart } from '../cart/CartContext';
import { Package, Search, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { ordersApi } from '../../../services/apiservice';
import { getSessionUser } from '../../../services/sessionService';
import type { SessionUser } from '../../../services/sessionService';

// Mock data for demonstration
const mockOrders = [
  {
    id: "ORD-20251110-001",
    items: [
      { id: 1, name: "Burger Deluxe", price: 100, qty: 1 },
      { id: 2, name: "Iced Tea", price: 50, qty: 2 }
    ],
    total: 200,
    type: "delivery" as const,
    status: "completed" as const,
    createdAt: "2025-11-10T10:30:00"
  },
  {
    id: "ORD-20251110-002",
    items: [
      { id: 3, name: "Classic Pizza", price: 250, qty: 1 },
      { id: 4, name: "Chicken Wings", price: 150, qty: 1 }
    ],
    total: 400,
    type: "pickup" as const,
    status: "preparing" as const,
    createdAt: "2025-11-10T11:15:00"
  },
  {
    id: "ORD-20251109-003",
    items: [
      { id: 5, name: "Caesar Salad", price: 120, qty: 2 },
      { id: 6, name: "Pasta Carbonara", price: 180, qty: 1 }
    ],
    total: 420,
    type: "delivery" as const,
    status: "out_for_delivery" as const,
    createdAt: "2025-11-09T18:45:00"
  },
  {
    id: "ORD-20251109-004",
    items: [
      { id: 7, name: "Veggie Wrap", price: 85, qty: 3 },
      { id: 8, name: "Fresh Juice", price: 60, qty: 3 }
    ],
    total: 435,
    type: "pickup" as const,
    status: "ready" as const,
    createdAt: "2025-11-09T13:20:00"
  },
  {
    id: "ORD-20251108-005",
    items: [
      { id: 9, name: "Margherita Pizza", price: 220, qty: 1 },
      { id: 10, name: "Greek Salad", price: 130, qty: 1 },
      { id: 11, name: "Garlic Bread", price: 70, qty: 2 }
    ],
    total: 490,
    type: "delivery" as const,
    status: "completed" as const,
    createdAt: "2025-11-08T19:30:00"
  },
  {
    id: "ORD-20251108-006",
    items: [
      { id: 12, name: "Beef Burger", price: 95, qty: 2 },
      { id: 13, name: "French Fries", price: 55, qty: 2 },
      { id: 14, name: "Soda", price: 40, qty: 2 }
    ],
    total: 380,
    type: "pickup" as const,
    status: "received" as const,
    createdAt: "2025-11-08T12:00:00"
  }
];

export const OrderHistory: React.FC = () => {
  const { getOrders } = useCart();
  const cartOrders = getOrders();
  const [ordersFromApi, setOrdersFromApi] = React.useState<any[] | null>(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const [sessionUser, setSessionUser] = React.useState<SessionUser | null>(getSessionUser());

  // Update session user when it changes elsewhere in the app
  React.useEffect(() => {
    const handler = () => {
      const newUser = getSessionUser();
      setSessionUser((prev) => {
        const prevId = prev?.id ?? null;
        const newId = newUser?.id ?? null;
        // only update state if id actually changed to avoid re-renders/loops
        if (prevId === newId) return prev;
        return newUser;
      });
    };
    window.addEventListener('rs_user_updated', handler);
    return () => window.removeEventListener('rs_user_updated', handler);
  }, []);
  
  // Filter states
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedDate, setSelectedDate] = React.useState('');
  const [showCalendar, setShowCalendar] = React.useState(false);
  const [currentMonth, setCurrentMonth] = React.useState(new Date());

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
  
  // Combine sources:
  // - If we've fetched from API (ordersFromApi !== null) use that result (even if empty)
  // - Otherwise fall back to cartOrders (in-progress) or finally mockOrders for demo.
  const allOrders = ordersFromApi !== null
    ? ordersFromApi
    : cartOrders.length > 0
      ? cartOrders
      : mockOrders;
  
  // Filter orders based on search query and date
  const orders = allOrders.filter(order => {
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

  // Fetch orders from backend and restrict to current session user.
  // Re-run when `sessionUser` changes (i.e., after sign-in/out).
  React.useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        setError(null);
        const user = sessionUser;
        if (!user) {
          // mark as fetched empty so UI prompts sign-in
          setOrdersFromApi([]);
          setLoading(false);
          return;
        }

        const resp = await ordersApi.getAll();
        // Support both shapes: { success, data } or raw array
        const data = resp && resp.data ? resp.data : resp;

        if (!Array.isArray(data)) {
          setOrdersFromApi([]);
          setLoading(false);
          return;
        }

        // Filter to only orders belonging to this user (server may return all)
        const sessionName = (user as any)?.name || (user as any)?.fullName || (user as any)?.displayName || null;
        const userOrders = data.filter((o: any) => {
          const orderUserId = o.userId || o.customerId || o.user || o.user_id || null;
          const orderCustomerName = o.customerFullName || o.customerName || o.fullName || o.name || null;

          // If session has an id, prefer matching by id
          if (user.id) {
            return orderUserId != null && String(orderUserId) === String(user.id);
          }

          // If no id available, try matching by full name (case-insensitive, trimmed)
          if (sessionName && orderCustomerName) {
            try {
              return String(sessionName).trim().toLowerCase() === String(orderCustomerName).trim().toLowerCase();
            } catch (e) {
              return false;
            }
          }

          return false;
        }).map((o: any) => ({
          id: o.id || o.orderId || o.order_number,
          items: o.orderList || o.items || o.order_items || [],
          total: o.totalFee || o.total || o.amount || 0,
          type: o.orderType || o.type || 'delivery',
          status: o.orderStatus || o.status || 'pending',
          createdAt: o.createdAt || o.created_at || o.dayKey || new Date().toISOString(),
        }));

        // Only update state when the fetched result actually differs to avoid unnecessary re-renders
        setOrdersFromApi((prev) => {
          try {
            const prevJson = JSON.stringify(prev || []);
            const currJson = JSON.stringify(userOrders || []);
            if (prevJson === currJson) return prev;
          } catch (e) {
            // if stringify fails, fall back to setting state
          }
          return userOrders;
        });
      } catch (err: any) {
        console.error('Error fetching user orders:', err);
        setError(err?.message || 'Failed to fetch orders');
        setOrdersFromApi([]);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [sessionUser]);

  if (orders.length === 0) {
    // If user is not signed in, prompt to sign in
    if (!sessionUser) {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold" style={{ color: THEME.colors.text.primary }}>Order History</h2>
          <div className="min-h-[200px] flex flex-col items-center justify-center">
            <p style={{ color: THEME.colors.text.primary }}>Please sign in to view your orders.</p>
          </div>
        </div>
      );
    }

    if (loading) {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold" style={{ color: THEME.colors.text.primary }}>Order History</h2>
          <div className="min-h-[200px] flex flex-col items-center justify-center">
            <p style={{ color: THEME.colors.text.primary }}>Loading your orders...</p>
          </div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold" style={{ color: THEME.colors.text.primary }}>Order History</h2>
          <div className="min-h-[200px] flex flex-col items-center justify-center">
            <p style={{ color: '#ef4444' }}>Error: {error}</p>
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
        {orders.map((order, index) => {
            const subtotal = (order.items || []).reduce((sum: number, item: any) => {
              const qty = item.qty || item.quantity || 1;
              const price = item.price ?? item.unitPrice ?? (item.lineTotal ? (item.lineTotal / (qty || 1)) : 0);
              return sum + (price * qty);
            }, 0);
          
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
