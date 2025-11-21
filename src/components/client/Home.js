import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { MapPin, ArrowRight, Heart, ChevronLeft, ChevronRight, ShoppingCart, Search } from 'lucide-react';
// Load local image from src/assets in a Vite-safe way
const MAPS_IMG = new URL('../../assets/mapsimg.png', import.meta.url).href;
const PLACEHOLDER_IMG = new URL('../../assets/placeholder.png', import.meta.url).href;
import { Card } from '../common/Card';
import { Button } from '../common/Button';
import { Toast } from '../common/Toast';
import { CLIENT_THEME as THEME } from '../../constants/clientTheme';
import { useCart } from './cart/CartContext';
import { useNavigate } from 'react-router-dom';
const promotionsData = [
    {
        id: 1,
        name: 'Summer BBQ Special',
        price: 15.99,
        originalPrice: 22.99,
        description: 'Grilled chicken, corn, BBQ sauce',
        image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop',
        discount: 30,
        badge: 'Limited Time'
    },
    {
        id: 2,
        name: 'Family Feast Bundle',
        price: 39.99,
        originalPrice: 55.00,
        description: 'Pizza, pasta, salad, and dessert',
        image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400&h=300&fit=crop',
        discount: 27,
        badge: 'Best Value'
    },
    {
        id: 3,
        name: 'Breakfast Combo',
        price: 9.99,
        originalPrice: 14.50,
        description: 'Eggs, bacon, toast, and coffee',
        image: 'https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=400&h=300&fit=crop',
        discount: 31,
        badge: 'Morning Deal'
    },
    {
        id: 4,
        name: 'Seafood Platter',
        price: 28.99,
        originalPrice: 38.00,
        description: 'Shrimp, fish, calamari with lemon',
        image: 'https://images.unsplash.com/photo-1559181567-c3190ca9959b?w=400&h=300&fit=crop',
        discount: 24,
        badge: 'Fresh Daily'
    },
    {
        id: 5,
        name: 'Double Cheeseburger Meal',
        price: 12.99,
        originalPrice: 18.99,
        description: 'Two beef patties, cheese, fries, drink',
        image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=400&h=300&fit=crop',
        discount: 32,
        badge: 'Hot Deal'
    },
    {
        id: 6,
        name: 'Sushi Lover Pack',
        price: 24.99,
        originalPrice: 35.00,
        description: '20 pieces assorted sushi and rolls',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
        discount: 29,
        badge: 'Chef Special'
    },
    {
        id: 7,
        name: 'Pasta Night Bundle',
        price: 19.99,
        originalPrice: 28.50,
        description: 'Two pasta dishes, garlic bread, dessert',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',
        discount: 30,
        badge: 'Popular'
    },
    {
        id: 8,
        name: 'Taco Tuesday Special',
        price: 8.99,
        originalPrice: 13.99,
        description: '5 tacos, chips, salsa, and guacamole',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
        discount: 36,
        badge: 'Tuesday Only'
    },
    {
        id: 9,
        name: 'Steak Dinner Deluxe',
        price: 32.99,
        originalPrice: 45.00,
        description: 'Prime ribeye, mashed potatoes, vegetables',
        image: 'https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400&h=300&fit=crop',
        discount: 27,
        badge: 'Premium'
    },
    {
        id: 10,
        name: 'Vegan Buddha Bowl',
        price: 11.99,
        originalPrice: 16.50,
        description: 'Quinoa, roasted veggies, tahini dressing',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop',
        discount: 27,
        badge: 'Healthy Choice'
    },
    {
        id: 11,
        name: 'Wings & Beer Combo',
        price: 17.99,
        originalPrice: 25.00,
        description: '12 wings, choice of sauce, craft beer',
        image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=300&fit=crop',
        discount: 28,
        badge: 'Game Day'
    },
    {
        id: 12,
        name: 'Dessert Sampler',
        price: 14.99,
        originalPrice: 21.00,
        description: 'Cheesecake, brownie, ice cream, tiramisu',
        image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?w=400&h=300&fit=crop',
        discount: 29,
        badge: 'Sweet Deal'
    },
];
const bestSellersData = [
    {
        id: 101,
        name: 'Signature Burger',
        price: 12.99,
        description: 'Premium beef, aged cheddar, special sauce',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
        rating: 4.8,
        soldCount: 1250
    },
    {
        id: 102,
        name: 'Margherita Pizza',
        price: 14.50,
        description: 'Fresh mozzarella, basil, San Marzano tomatoes',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
        rating: 4.9,
        soldCount: 2100
    },
    {
        id: 103,
        name: 'Pad Thai',
        price: 11.99,
        description: 'Rice noodles, peanuts, tamarind, lime',
        image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?w=400&h=300&fit=crop',
        rating: 4.7,
        soldCount: 890
    },
    {
        id: 104,
        name: 'Caesar Salad',
        price: 9.50,
        description: 'Romaine, parmesan, croutons, classic dressing',
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
        rating: 4.6,
        soldCount: 750
    },
];
const recommendedData = [
    {
        id: 201,
        name: 'Grilled Salmon',
        price: 18.99,
        description: 'Atlantic salmon, lemon butter, seasonal veggies',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
        rating: 4.8,
        tags: ['Healthy', 'High Protein']
    },
    {
        id: 202,
        name: 'Chicken Alfredo',
        price: 13.99,
        description: 'Fettuccine, grilled chicken, creamy sauce',
        image: 'https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=400&h=300&fit=crop',
        rating: 4.7,
        tags: ['Popular', 'Comfort Food']
    },
    {
        id: 203,
        name: 'Veggie Stir Fry',
        price: 10.99,
        description: 'Mixed vegetables, tofu, ginger soy glaze',
        image: 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400&h=300&fit=crop',
        rating: 4.5,
        tags: ['Vegan', 'Gluten Free']
    },
    {
        id: 204,
        name: 'BBQ Ribs',
        price: 19.99,
        description: 'Slow-cooked pork ribs, house BBQ sauce',
        image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop',
        rating: 4.9,
        tags: ['Signature', 'Fan Favorite']
    },
    {
        id: 205,
        name: 'Sushi Combo',
        price: 22.99,
        description: 'Assorted nigiri and rolls, wasabi, ginger',
        image: 'https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=400&h=300&fit=crop',
        rating: 4.8,
        tags: ['Premium', 'Fresh']
    },
    {
        id: 206,
        name: 'Tacos al Pastor',
        price: 11.50,
        description: 'Marinated pork, pineapple, cilantro, onion',
        image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=300&fit=crop',
        rating: 4.6,
        tags: ['Spicy', 'Authentic']
    },
];
export const Home = () => {
    const [favorites, setFavorites] = React.useState(new Set());
    const [searchQuery, setSearchQuery] = React.useState('');
    const [toastMessage, setToastMessage] = React.useState(null);
    const promotionScrollRef = React.useRef(null);
    const { addItem } = useCart();
    const navigate = useNavigate();
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

    @keyframes slideInLeft {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* Smooth zoom effect */
    .card-hover-zoom {
      position: relative;
      overflow: hidden;
      transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1),
                  box-shadow 0.3s ease;
      will-change: transform;
    }

    .card-hover-zoom img {
      transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
      will-change: transform;
    }

    .card-hover-zoom:hover {
      transform: translateY(-6px);
    }

    .card-hover-zoom:hover img {
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
    // Listen for address update events
    React.useEffect(() => {
        const handleAddressUpdate = () => {
            setToastMessage('Delivery Address Changed Successfully');
        };
        window.addEventListener('addressUpdated', handleAddressUpdate);
        return () => window.removeEventListener('addressUpdated', handleAddressUpdate);
    }, []);
    const toggleFavorite = (itemId) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(itemId)) {
                newFavorites.delete(itemId);
            }
            else {
                newFavorites.add(itemId);
            }
            return newFavorites;
        });
    };
    const handleAddToCart = (item) => {
        addItem(item);
        setToastMessage('Added to Cart Successfully');
    };
    const scrollPromotions = (direction) => {
        if (promotionScrollRef.current) {
            const scrollAmount = 320;
            promotionScrollRef.current.scrollBy({
                left: direction === 'left' ? -scrollAmount : scrollAmount,
                behavior: 'smooth'
            });
        }
    };
    // Filter data based on search query
    const filterBySearch = (items) => {
        if (!searchQuery.trim())
            return items;
        const query = searchQuery.toLowerCase();
        return items.filter(item => item.name.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query));
    };
    const filteredPromotions = filterBySearch(promotionsData);
    const filteredBestSellers = filterBySearch(bestSellersData);
    const filteredRecommended = filterBySearch(recommendedData);
    return (_jsxs("div", { className: "space-y-6", children: [_jsx("div", { className: "rounded-3xl overflow-hidden relative", children: _jsxs("div", { className: "w-full relative", style: { backgroundImage: `url(${MAPS_IMG})`, backgroundSize: 'cover', backgroundPosition: 'center' }, children: [_jsx("div", { style: { position: 'absolute', inset: 0 } }), _jsxs("div", { className: "relative p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("h3", { className: "text-xl font-semibold", style: {
                                                color: THEME.colors.text.secondary,
                                                animation: 'fadeInUp 0.5s ease-out forwards',
                                                opacity: 0
                                            }, children: "Hungry? Tell us where to deliver it!" }), _jsx("p", { className: "text-sm mt-2", style: {
                                                color: THEME.colors.text.primary,
                                                animation: 'fadeInUp 0.5s ease-out forwards',
                                                animationDelay: '0.3s',
                                                opacity: 0
                                            }, children: "View on map or enter an address to get started." })] }), _jsx("div", { className: "flex items-center gap-3", children: _jsxs(Button, { variant: "ghost", className: "flex items-center gap-2 rounded-full px-4 py-2", style: { background: 'rgba(255,255,255,0.9)', color: THEME.colors.text.primary, border: `1px solid rgba(0,0,0,0.08)` }, "aria-label": "Show map", onClick: () => window.dispatchEvent(new Event('openMapModal')), children: [_jsx(MapPin, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm font-medium", children: "Show map" }), _jsx(ArrowRight, { className: "w-4 h-4" })] }) })] })] }) }), _jsxs("div", { className: "rounded-3xl p-6", style: { backgroundColor: '#1a1a1a' }, children: [_jsx("div", { className: "flex items-center justify-between mb-4 ml-4 mr-4", children: _jsx("h2", { className: "text-2xl font-semibold", style: { color: '#ffffff' }, children: "Get % OFF on these meals" }) }), filteredPromotions.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-16", children: [_jsx("div", { className: "rounded-full p-4 mb-4", style: { backgroundColor: '#2a2a2a' }, children: _jsx(Search, { className: "w-12 h-12", style: { color: '#808080' } }) }), _jsx("h3", { className: "text-lg font-semibold mb-2", style: { color: '#ffffff' }, children: "No promotions found" }), _jsx("p", { className: "text-sm text-center max-w-md", style: { color: '#a0a0a0' }, children: "We couldn't find any promotions matching your search. Try a different keyword." })] })) : (_jsxs("div", { className: "flex items-center justify-center gap-4", children: [_jsx("button", { onClick: () => scrollPromotions('left'), className: "p-1.5 rounded-lg hover:bg-opacity-80 transition flex-shrink-0", style: { backgroundColor: '#2a2a2a' }, children: _jsx(ChevronLeft, { className: "w-4 h-4", style: { color: '#ffffff' } }) }), _jsx("div", { ref: promotionScrollRef, className: "flex gap-4 overflow-x-auto scrollbar-hide scroll-smooth flex-1", style: { scrollbarWidth: 'none', msOverflowStyle: 'none' }, children: filteredPromotions.map((promo, index) => (_jsxs("div", { className: "flex-shrink-0 rounded-xl overflow-hidden relative card-hover-zoom", style: {
                                        width: '300px',
                                        backgroundColor: '#2a2a2a',
                                        border: `1px solid #3a3a3a`,
                                        animation: `fadeInUp 0.5s ease-in-out forwards`,
                                        animationDelay: `${index * 100}ms`,
                                        opacity: 0
                                    }, children: [_jsxs("div", { className: "relative", children: [_jsx("img", { src: promo.image, alt: promo.name, className: "w-full h-40 object-cover", onError: (e) => {
                                                        const target = e.target;
                                                        target.src = PLACEHOLDER_IMG;
                                                    } }), _jsxs("div", { className: "absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-semibold bg-red-600 text-white", children: [promo.discount, "% OFF"] }), _jsx("div", { className: "absolute top-2 left-2 px-2 py-1 rounded-lg text-xs font-semibold", style: { backgroundColor: THEME.colors.primary.DEFAULT, color: 'white' }, children: promo.badge })] }), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "text-lg font-semibold mb-1", style: { color: '#ffffff' }, children: promo.name }), _jsx("p", { className: "text-xs mb-3", style: { color: '#a0a0a0' }, children: promo.description }), _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsxs("span", { className: "text-xl font-bold", style: { color: '#fbbf24' }, children: ["\u20B1", promo.price] }), _jsxs("span", { className: "text-sm ml-2 line-through", style: { color: '#808080' }, children: ["\u20B1", promo.originalPrice] })] }), _jsx(Button, { variant: "primary", className: "text-xs px-3 py-1.5", onClick: () => handleAddToCart({ id: promo.id, name: promo.name, price: promo.price }), children: _jsx(ShoppingCart, { className: "w-4 h-4" }) })] })] })] }, promo.id))) }), _jsx("button", { onClick: () => scrollPromotions('right'), className: "p-1.5 rounded-lg hover:bg-opacity-80 transition flex-shrink-0", style: { backgroundColor: '#2a2a2a' }, children: _jsx(ChevronRight, { className: "w-4 h-4", style: { color: '#ffffff' } }) })] }))] }), _jsxs("div", { className: "rounded-3xl p-6", style: { backgroundColor: THEME.colors.background.secondary }, children: [_jsx("div", { className: "flex items-center justify-between mb-4", children: _jsx("h2", { className: "text-2xl font-semibold", style: { color: THEME.colors.text.primary }, children: "Best Sellers" }) }), filteredBestSellers.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-16", children: [_jsx("div", { className: "rounded-full p-4 mb-4", style: { backgroundColor: THEME.colors.background.tertiary }, children: _jsx(Search, { className: "w-12 h-12", style: { color: THEME.colors.text.tertiary } }) }), _jsx("h3", { className: "text-lg font-semibold mb-2", style: { color: THEME.colors.text.primary }, children: "No best sellers found" }), _jsx("p", { className: "text-sm text-center max-w-md", style: { color: THEME.colors.text.tertiary }, children: "We couldn't find any best sellers matching your search. Try different keywords." })] })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4", children: filteredBestSellers.map((item, index) => (_jsxs(Card, { className: "relative overflow-hidden card-hover-zoom", padding: "none", style: {
                                backgroundColor: THEME.colors.background.tertiary,
                                borderColor: THEME.colors.border.DEFAULT,
                                animation: `fadeInUp 0.5s ease-in-out forwards`,
                                animationDelay: `${index * 100}ms`,
                                opacity: 0
                            }, children: [_jsxs("div", { className: "relative", children: [_jsx("img", { src: item.image, alt: item.name, className: "w-full h-40 object-cover", onError: (e) => {
                                                const target = e.target;
                                                target.src = PLACEHOLDER_IMG;
                                            } }), _jsx("button", { onClick: () => toggleFavorite(item.id), className: "absolute top-2 right-2 p-2 rounded-full transition-all", style: {
                                                backgroundColor: 'rgba(255,255,255,0.9)',
                                                border: favorites.has(item.id) ? '2px solid #ef4444' : '2px solid transparent'
                                            }, children: _jsx(Heart, { className: "w-5 h-5 transition-colors", style: { color: favorites.has(item.id) ? '#ef4444' : '#9ca3af' }, fill: favorites.has(item.id) ? '#ef4444' : 'none' }) })] }), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "text-base font-semibold mb-1", style: { color: THEME.colors.text.primary }, children: item.name }), _jsx("p", { className: "text-xs mb-2", style: { color: THEME.colors.text.tertiary }, children: item.description }), _jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("span", { className: "text-lg font-bold", style: { color: THEME.colors.primary.DEFAULT }, children: ["\u20B1", item.price] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { className: "text-yellow-500 text-sm", children: "\u2605" }), _jsx("span", { className: "text-xs font-medium", style: { color: THEME.colors.text.secondary }, children: item.rating })] })] }), _jsxs("button", { onClick: () => handleAddToCart({ id: item.id, name: item.name, price: item.price }), className: "w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2", style: { backgroundColor: THEME.colors.primary.light, color: '#FFFFFF' }, children: [_jsx(ShoppingCart, { className: "w-4 h-4" }), "Add to Cart"] })] })] }, item.id))) }))] }), _jsxs("div", { className: "rounded-3xl p-6", style: { backgroundColor: THEME.colors.background.secondary }, children: [_jsx("div", { className: "flex items-center justify-between mb-4", children: _jsx("h2", { className: "text-2xl font-semibold", style: { color: THEME.colors.text.primary }, children: "Recommended for You" }) }), filteredRecommended.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-16", children: [_jsx("div", { className: "rounded-full p-4 mb-4", style: { backgroundColor: THEME.colors.background.tertiary }, children: _jsx(Search, { className: "w-12 h-12", style: { color: THEME.colors.text.tertiary } }) }), _jsx("h3", { className: "text-lg font-semibold mb-2", style: { color: THEME.colors.text.primary }, children: "No recommendations found" }), _jsx("p", { className: "text-sm text-center max-w-md", style: { color: THEME.colors.text.tertiary }, children: "We couldn't find any recommendations matching your search. Try exploring other items." })] })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4", children: filteredRecommended.map((item, index) => (_jsxs(Card, { className: "relative overflow-hidden card-hover-zoom", padding: "none", style: {
                                backgroundColor: THEME.colors.background.tertiary,
                                borderColor: THEME.colors.border.DEFAULT,
                                animation: `fadeInUp 0.5s ease-in-out forwards`,
                                animationDelay: `${index * 100}ms`,
                                opacity: 0
                            }, children: [_jsxs("div", { className: "relative", children: [_jsx("img", { src: item.image, alt: item.name, className: "w-full h-48 object-cover", onError: (e) => {
                                                const target = e.target;
                                                target.src = PLACEHOLDER_IMG;
                                            } }), _jsx("button", { onClick: () => toggleFavorite(item.id), className: "absolute top-2 right-2 p-2 rounded-full transition-all", style: {
                                                backgroundColor: 'rgba(255,255,255,0.9)',
                                                border: favorites.has(item.id) ? '2px solid #ef4444' : '2px solid transparent'
                                            }, children: _jsx(Heart, { className: "w-5 h-5 transition-colors", style: { color: favorites.has(item.id) ? '#ef4444' : '#9ca3af' }, fill: favorites.has(item.id) ? '#ef4444' : 'none' }) }), _jsx("div", { className: "absolute bottom-2 left-2 flex gap-1 flex-wrap", children: item.tags.map((tag, idx) => (_jsx("span", { className: "px-2 py-1 rounded text-xs font-medium", style: { backgroundColor: 'rgba(0,0,0,0.7)', color: 'white' }, children: tag }, idx))) })] }), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "text-base font-semibold mb-1", style: { color: THEME.colors.text.primary }, children: item.name }), _jsx("p", { className: "text-xs mb-3", style: { color: THEME.colors.text.tertiary }, children: item.description }), _jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("span", { className: "text-lg font-bold", style: { color: THEME.colors.primary.DEFAULT }, children: ["\u20B1", item.price] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { className: "text-yellow-500 text-sm", children: "\u2605" }), _jsx("span", { className: "text-xs font-medium", style: { color: THEME.colors.text.secondary }, children: item.rating })] })] }), _jsxs("button", { onClick: () => handleAddToCart({ id: item.id, name: item.name, price: item.price }), className: "w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2", style: { backgroundColor: THEME.colors.primary.DEFAULT, color: '#FFFFFF' }, children: [_jsx(ShoppingCart, { className: "w-4 h-4" }), "Add to Cart"] })] })] }, item.id))) }))] }), toastMessage && (_jsx(Toast, { message: toastMessage, onClose: () => setToastMessage(null) }))] }));
};
export default Home;
