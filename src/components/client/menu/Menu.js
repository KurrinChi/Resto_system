import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MenuItemCard } from './MenuItemCard';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '../../common/Button';
import { useCart } from '../cart/CartContext';
import { Toast } from '../../common/Toast';
import { menuApi } from '../../../services/apiservice';
const categories = ['All', 'Starters', 'Soups', 'Mains', 'Grills', 'Specialties', 'Pasta', 'Sides', 'Desserts', 'Drinks', 'Cocktails'];
export const Menu = () => {
    const navigate = useNavigate();
    const { addItem, items, updateQty, removeItem } = useCart();
    const [menuItems, setMenuItems] = React.useState([]);
    const [filter, setFilter] = React.useState('All');
    const [priceRange, setPriceRange] = React.useState([0, 10000]);
    const [orderType, setOrderType] = React.useState('delivery');
    const [searchQuery, setSearchQuery] = React.useState('');
    const [toastMessage, setToastMessage] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    // Fetch menu items from backend
    React.useEffect(() => {
        const fetchMenuItems = async () => {
            try {
                setLoading(true);
                const response = await menuApi.getAll();
                if (response.success && Array.isArray(response.data)) {
                    const mappedItems = response.data.map((item) => ({
                        ...item,
                        image: item.image_url || item.image,
                        desc: item.description || item.desc
                    }));
                    setMenuItems(mappedItems);
                }
            }
            catch (err) {
                console.error('Failed to fetch menu items:', err);
            }
            finally {
                setLoading(false);
            }
        };
        fetchMenuItems();
    }, []);
    // Add keyframe animations on mount
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

      /* Smooth zoom effect */
      .menu-card-hover-zoom {
        position: relative;
        overflow: hidden;
        transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1),
                    box-shadow 0.3s ease;
        will-change: transform;
      }

      .menu-card-hover-zoom img {
        transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        will-change: transform;
      }

      .menu-card-hover-zoom:hover {
        transform: translateY(-6px);
      }

      .menu-card-hover-zoom:hover img {
        transform: scale(1.08);
      }
    `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);
    // Listen for search events from header
    React.useEffect(() => {
        const handleSearch = (event) => {
            const customEvent = event;
            setSearchQuery(customEvent.detail);
        };
        window.addEventListener('searchQuery', handleSearch);
        return () => window.removeEventListener('searchQuery', handleSearch);
    }, []);
    // Filter items based on all criteria
    let filteredItems = filter === 'All' ? menuItems : menuItems.filter((m) => m.category === filter);
    // Apply search query filter
    if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        filteredItems = filteredItems.filter(item => item.name.toLowerCase().includes(query) ||
            (item.description && item.description.toLowerCase().includes(query)) ||
            item.category.toLowerCase().includes(query));
    }
    // Apply price range filter
    filteredItems = filteredItems.filter(item => item.price >= priceRange[0] && item.price <= priceRange[1]);
    // Apply availability filter
    filteredItems = filteredItems.filter(item => item.available);
    const handleAddToCart = (item) => {
        addItem({
            id: item.id,
            name: item.name,
            price: item.price
        });
        setToastMessage('Added to Cart Successfully');
    };
    const handleUpdateQuantity = (id, newQuantity) => {
        if (newQuantity <= 0) {
            removeItem(id);
        }
        else {
            updateQty(id, newQuantity);
        }
    };
    const handleRemoveItem = (id) => {
        removeItem(id);
    };
    const handlePlaceOrder = () => {
        if (items.length === 0) {
            setToastMessage('Please add items to your cart');
            return;
        }
        // Save order type to localStorage before navigating
        localStorage.setItem('orderType', orderType);
        navigate('/client/checkout');
    };
    // Function to get count of items per category
    const getCategoryCount = (category) => {
        if (category === 'All') {
            return menuItems.length;
        }
        return menuItems.filter(item => item.category === category).length;
    };
    // Return early if still loading
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx("p", { style: { color: THEME.colors.text.secondary }, children: "Loading menu..." }) }));
    }
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
    const smallOrderFee = subtotal < 109 ? 20 : 0;
    const deliveryFee = orderType === 'delivery' ? 74 : 0;
    const serviceFee = subtotal * 0.05;
    const total = subtotal + smallOrderFee + deliveryFee + serviceFee;
    return (_jsxs("div", { className: "flex flex-col lg:flex-row gap-4 lg:gap-6 h-auto lg:h-[calc(100vh-8rem)]", children: [_jsx("div", { className: "w-full lg:w-64 flex-shrink-0 flex flex-col overflow-hidden", children: _jsxs("div", { className: "flex flex-col h-auto lg:h-full overflow-y-auto rounded-2xl p-4", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: [_jsx("h3", { className: "text-lg font-semibold mb-4 flex-shrink-0", style: { color: THEME.colors.text.primary }, children: "Filters" }), _jsxs("div", { className: "mb-6", children: [_jsx("label", { className: "block text-sm font-medium mb-2", style: { color: THEME.colors.text.primary }, children: "Price Range" }), _jsxs("div", { className: "space-y-2", children: [_jsx("input", { type: "range", min: "0", max: "1000", step: "0.5", value: priceRange[1], onChange: (e) => setPriceRange([0, parseFloat(e.target.value)]), className: "w-full" }), _jsxs("div", { className: "flex justify-between text-xs", style: { color: THEME.colors.text.tertiary }, children: [_jsxs("span", { children: ["\u20B1", priceRange[0]] }), _jsxs("span", { children: ["\u20B1", priceRange[1]] })] })] })] })] }) }), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden min-h-[400px] lg:min-h-0", children: [_jsxs("div", { className: "flex-shrink-0 rounded-2xl p-4", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: [_jsx("h2", { className: "text-xl font-semibold", style: { color: THEME.colors.text.primary }, children: "Menu" }), _jsx("div", { className: "mt-3 flex gap-2 flex-wrap", children: categories.map((c) => (_jsxs("button", { onClick: () => setFilter(c), className: `px-3 py-1 rounded-full text-sm ${filter === c ? 'font-semibold' : ''}`, style: {
                                        backgroundColor: filter === c ? THEME.colors.background.hover : 'transparent',
                                        color: THEME.colors.text.primary
                                    }, children: [c, " (", getCategoryCount(c), ")"] }, c))) })] }), _jsx("div", { className: "flex-1 overflow-y-auto mt-6 pr-2", children: filteredItems.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-20", children: [_jsx("div", { className: "rounded-full p-6 mb-6", style: { backgroundColor: THEME.colors.background.tertiary }, children: _jsx("svg", { className: "w-16 h-16", fill: "none", stroke: THEME.colors.text.tertiary, viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 1.5, d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" }) }) }), _jsx("h3", { className: "text-xl font-semibold mb-3", style: { color: THEME.colors.text.primary }, children: "No menu items found" }), _jsx("p", { className: "text-sm text-center max-w-md mb-6", style: { color: THEME.colors.text.tertiary }, children: "We couldn't find any items matching your search or filters. Try adjusting your criteria or clearing some filters." }), _jsx(Button, { variant: "primary", onClick: () => {
                                        setFilter('All');
                                        setPriceRange([0, 10000]);
                                        setSearchQuery('');
                                        window.dispatchEvent(new CustomEvent('searchQuery', { detail: '' }));
                                    }, style: {
                                        backgroundColor: THEME.colors.primary.DEFAULT,
                                        color: 'white'
                                    }, children: "Clear all filters" })] })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4", children: filteredItems.map((item, index) => (_jsx(MenuItemCard, { item: item, onAddToOrder: handleAddToCart, index: index }, item.id))) })) })] }), _jsx("div", { className: "w-full lg:w-80 flex-shrink-0 flex flex-col", children: _jsxs("div", { className: "flex flex-col h-auto lg:h-full rounded-2xl p-4", style: { backgroundColor: THEME.colors.background.secondary, border: `1px solid ${THEME.colors.border.DEFAULT}` }, children: [_jsxs("div", { className: "flex-shrink-0", children: [_jsx("h3", { className: "text-lg font-semibold mb-4", style: { color: THEME.colors.text.primary }, children: "Your Order" }), _jsxs("div", { className: "flex gap-2 mb-4", children: [_jsx("button", { onClick: () => setOrderType('delivery'), className: `flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors`, style: {
                                                backgroundColor: orderType === 'delivery' ? THEME.colors.primary.DEFAULT : THEME.colors.background.tertiary,
                                                color: orderType === 'delivery' ? 'white' : THEME.colors.text.primary
                                            }, children: "Delivery" }), _jsx("button", { onClick: () => setOrderType('pickup'), className: `flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors`, style: {
                                                backgroundColor: orderType === 'pickup' ? THEME.colors.primary.DEFAULT : THEME.colors.background.tertiary,
                                                color: orderType === 'pickup' ? 'white' : THEME.colors.text.primary
                                            }, children: "Pick-up" })] })] }), _jsx("div", { className: "flex-1 overflow-y-auto pr-2 mb-4 max-h-[300px] lg:max-h-none", children: _jsx("div", { className: "space-y-3", children: items.length === 0 ? (_jsx("p", { className: "text-sm text-center py-8", style: { color: THEME.colors.text.tertiary }, children: "No items in order" })) : (items.map((item) => (_jsxs("div", { className: "flex items-center gap-2 p-2 rounded-lg", style: { backgroundColor: THEME.colors.background.tertiary }, children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm font-medium", style: { color: THEME.colors.text.primary }, children: item.name }), _jsxs("p", { className: "text-xs", style: { color: THEME.colors.text.tertiary }, children: ["\u20B1", item.price.toFixed(2)] })] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("button", { onClick: () => handleUpdateQuantity(item.id, item.qty - 1), className: "p-0.5 rounded hover:bg-opacity-80", style: { backgroundColor: THEME.colors.background.hover }, children: _jsx(Minus, { className: "w-3 h-3", style: { color: THEME.colors.text.primary } }) }), _jsx("span", { className: "text-xs font-medium w-5 text-center", style: { color: THEME.colors.text.primary }, children: item.qty }), _jsx("button", { onClick: () => handleUpdateQuantity(item.id, item.qty + 1), className: "p-0.5 rounded hover:bg-opacity-80", style: { backgroundColor: THEME.colors.background.hover }, children: _jsx(Plus, { className: "w-3 h-3", style: { color: THEME.colors.text.primary } }) }), _jsx("button", { onClick: () => handleRemoveItem(item.id), className: "p-0.5 rounded hover:bg-opacity-80 ml-0.5", style: { backgroundColor: THEME.colors.background.hover }, children: _jsx(Trash2, { className: "w-3 h-3", style: { color: '#ef4444' } }) })] })] }, item.id)))) }) }), items.length > 0 && (_jsxs("div", { className: "flex-shrink-0 border-t pt-4", style: { borderColor: THEME.colors.border.DEFAULT }, children: [_jsxs("div", { className: "space-y-2 mb-4", children: [_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { style: { color: THEME.colors.text.tertiary }, children: "Subtotal" }), _jsxs("span", { style: { color: THEME.colors.text.primary }, children: ["\u20B1", subtotal.toFixed(2)] })] }), smallOrderFee > 0 && (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsxs("div", { children: [_jsx("span", { style: { color: THEME.colors.text.tertiary }, children: "Small order fee" }), _jsx("p", { className: "text-xs", style: { color: THEME.colors.text.tertiary }, children: "Spend at least \u20B1109 to avoid this fee" })] }), _jsxs("span", { style: { color: THEME.colors.text.primary }, children: ["\u20B1", smallOrderFee.toFixed(2)] })] })), orderType === 'delivery' && (_jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { style: { color: THEME.colors.text.tertiary }, children: "Standard delivery" }), _jsxs("span", { style: { color: THEME.colors.text.primary }, children: ["\u20B1", deliveryFee.toFixed(2)] })] })), _jsxs("div", { className: "flex justify-between text-sm", children: [_jsx("span", { style: { color: THEME.colors.text.tertiary }, children: "Service Fee" }), _jsxs("span", { style: { color: THEME.colors.text.primary }, children: ["\u20B1", serviceFee.toFixed(2)] })] }), _jsxs("div", { className: "flex justify-between text-base font-bold pt-2 border-t", style: { borderColor: THEME.colors.border.DEFAULT }, children: [_jsx("span", { style: { color: THEME.colors.text.primary }, children: "Total (incl. fees and tax)" }), _jsxs("span", { style: { color: THEME.colors.primary.DEFAULT }, children: ["\u20B1", total.toFixed(2)] })] })] }), _jsx(Button, { variant: "primary", className: "w-full", onClick: handlePlaceOrder, style: {
                                        backgroundColor: THEME.colors.primary.DEFAULT,
                                        color: 'white',
                                        padding: '0.75rem'
                                    }, children: "Place Order" })] }))] }) }), toastMessage && (_jsx(Toast, { message: toastMessage, onClose: () => setToastMessage(null) }))] }));
};
export default Menu;
