import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Card } from '../../common/Card';
import { Button } from '../../common/Button';
import { CLIENT_THEME as THEME } from '../../../constants/clientTheme';
const PLACEHOLDER_IMG = new URL('../../../assets/placeholder.png', import.meta.url).href;
export const MenuItemCard = ({ item, onAddToOrder, index = 0 }) => {
    const handleAdd = () => {
        if (onAddToOrder) {
            onAddToOrder({ id: item.id, name: item.name, price: item.price });
        }
    };
    return (_jsxs(Card, { padding: "md", className: "flex flex-col justify-between menu-card-hover-zoom", style: {
            backgroundColor: THEME.colors.background.tertiary,
            borderColor: THEME.colors.border.DEFAULT,
            color: THEME.colors.text.primary,
            animation: `fadeInUp 0.5s ease-in-out forwards`,
            animationDelay: `${index * 100}ms`,
            opacity: 0
        }, children: [_jsxs("div", { children: [_jsxs("div", { className: "h-36 rounded-lg mb-3 relative overflow-hidden", children: [_jsx("img", { src: item.image || PLACEHOLDER_IMG, alt: item.name, className: "w-full h-full object-cover", onError: (e) => {
                                    const target = e.target;
                                    target.src = PLACEHOLDER_IMG;
                                } }), item.isBestSeller && (_jsx("span", { className: "absolute top-2 left-2 px-2 py-1 rounded text-xs font-semibold", style: { backgroundColor: THEME.colors.primary.DEFAULT, color: 'white' }, children: "Best Seller" })), item.isNewOffer && (_jsx("span", { className: "absolute bottom-2 right-2 px-2 py-1 rounded text-xs font-semibold bg-green-600 text-white", children: "New" }))] }), _jsx("h4", { className: "text-lg font-medium", style: { color: THEME.colors.text.primary }, children: item.name }), _jsx("p", { className: "text-sm mt-1", style: { color: THEME.colors.text.tertiary }, children: item.desc })] }), _jsxs("div", { className: "mt-4 flex items-center justify-between", children: [_jsxs("span", { className: "text-lg font-bold", style: { color: THEME.colors.text.primary }, children: ["\u20B1", item.price.toFixed(2)] }), _jsx(Button, { size: "sm", onClick: handleAdd, style: { backgroundColor: THEME.colors.primary.DEFAULT, color: '#FFFFFF' }, children: "Add" })] })] }));
};
export default MenuItemCard;
