import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
import { Card } from '../../common/Card';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
import { Heart, ShoppingCart } from 'lucide-react';
import { useCart } from '../cart/CartContext';
import { Toast } from '../../common/Toast';
const PLACEHOLDER_IMG = new URL('../../../assets/placeholder.png', import.meta.url).href;
// Sample menu items with favorites data
const menuItems = [
    {
        id: 1,
        name: 'Burger Deluxe',
        price: 8.99,
        desc: 'Juicy beef patty with cheese',
        image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
        rating: 4.8
    },
    {
        id: 2,
        name: 'Classic Pizza',
        price: 12.5,
        desc: 'Tomato, mozzarella, basil',
        image: 'https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=400&h=300&fit=crop',
        rating: 4.9
    },
    {
        id: 3,
        name: 'Caesar Salad',
        price: 7.2,
        desc: 'Fresh romaine, parmesan',
        image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop',
        rating: 4.6
    },
    {
        id: 4,
        name: 'Pasta Carbonara',
        price: 11.3,
        desc: 'Creamy sauce, pancetta',
        image: 'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=400&h=300&fit=crop',
        rating: 4.7
    },
    {
        id: 5,
        name: 'Grilled Salmon',
        price: 18.99,
        desc: 'Atlantic salmon, lemon butter, seasonal veggies',
        image: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop',
        rating: 4.8
    },
    {
        id: 6,
        name: 'Chicken Wings',
        price: 9.99,
        desc: 'Spicy buffalo wings',
        image: 'https://images.unsplash.com/photo-1608039829572-78524f79c4c7?w=400&h=300&fit=crop',
        rating: 4.5
    },
];
export const Favorites = () => {
    const [favorites, setFavorites] = React.useState(() => {
        // Initialize with some favorites for demonstration
        return new Set([1, 2, 3]);
    });
    const [toastMessage, setToastMessage] = React.useState(null);
    const { addItem } = useCart();
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

      /* Smooth zoom effect for favorites */
      .favorites-card-hover-zoom {
        position: relative;
        overflow: hidden;
        transition: transform 0.4s cubic-bezier(0.25, 0.1, 0.25, 1),
                    box-shadow 0.3s ease;
        will-change: transform;
      }

      .favorites-card-hover-zoom img {
        transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        will-change: transform;
      }

      .favorites-card-hover-zoom:hover {
        transform: translateY(-6px);
      }

      .favorites-card-hover-zoom:hover img {
        transform: scale(1.08);
      }
    `;
        document.head.appendChild(style);
        return () => {
            document.head.removeChild(style);
        };
    }, []);
    const toggleFavorite = (itemId) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(itemId)) {
                newFavorites.delete(itemId);
                setToastMessage('Removed from Favorites');
            }
            else {
                newFavorites.add(itemId);
                setToastMessage('Added to Favorites');
            }
            return newFavorites;
        });
    };
    const handleAddToCart = (item) => {
        addItem(item);
        setToastMessage('Added to Cart Successfully');
    };
    const favoriteItems = menuItems.filter(item => favorites.has(item.id));
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-semibold", style: { color: THEME.colors.text.primary }, children: "My Favorites" }), _jsxs("p", { className: "text-sm mt-1", style: { color: THEME.colors.text.tertiary }, children: [favoriteItems.length, " item", favoriteItems.length !== 1 ? 's' : '', " in your favorites"] })] }), favoriteItems.length === 0 ? (_jsxs("div", { className: "flex flex-col items-center justify-center py-16", children: [_jsx("div", { className: "rounded-full p-6 mb-4", style: { backgroundColor: THEME.colors.background.tertiary }, children: _jsx(Heart, { className: "w-16 h-16", style: { color: THEME.colors.text.tertiary } }) }), _jsx("h3", { className: "text-xl font-semibold mb-2", style: { color: THEME.colors.text.primary }, children: "No favorites yet" }), _jsx("p", { className: "text-sm text-center max-w-md", style: { color: THEME.colors.text.tertiary }, children: "Click the heart icon on items you love to add them to your favorites" })] })) : (_jsx("div", { className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4", children: favoriteItems.map((item, index) => (_jsxs(Card, { className: "relative overflow-hidden favorites-card-hover-zoom", padding: "none", style: {
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
                                    }, children: _jsx(Heart, { className: "w-5 h-5 transition-colors", style: { color: favorites.has(item.id) ? '#ef4444' : '#9ca3af' }, fill: favorites.has(item.id) ? '#ef4444' : 'none' }) })] }), _jsxs("div", { className: "p-4", children: [_jsx("h3", { className: "text-base font-semibold mb-1", style: { color: THEME.colors.text.primary }, children: item.name }), _jsx("p", { className: "text-xs mb-2", style: { color: THEME.colors.text.tertiary }, children: item.desc }), _jsxs("div", { className: "flex items-center justify-between mb-3", children: [_jsxs("span", { className: "text-lg font-bold", style: { color: THEME.colors.primary.DEFAULT }, children: ["\u20B1", item.price.toFixed(2)] }), _jsxs("div", { className: "flex items-center gap-1", children: [_jsx("span", { className: "text-yellow-500 text-sm", children: "\u2605" }), _jsx("span", { className: "text-xs font-medium", style: { color: THEME.colors.text.secondary }, children: item.rating })] })] }), _jsxs("button", { onClick: () => handleAddToCart({ id: item.id, name: item.name, price: item.price }), className: "w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2", style: { backgroundColor: THEME.colors.primary.DEFAULT, color: '#FFFFFF' }, children: [_jsx(ShoppingCart, { className: "w-4 h-4" }), "Add to Cart"] })] })] }, item.id))) })), toastMessage && (_jsx(Toast, { message: toastMessage, onClose: () => setToastMessage(null) }))] }));
};
export default Favorites;
