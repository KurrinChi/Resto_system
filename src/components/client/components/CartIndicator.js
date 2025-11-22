import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCart } from '../cart/CartContext';
import { ShoppingCart } from 'lucide-react';
export const CartIndicator = ({ onClick }) => {
    const { count } = useCart();
    return (_jsxs("button", { "aria-label": "Open cart", onClick: onClick, className: "relative p-2 rounded-md transition-colors", style: { color: '#140302' }, children: [_jsx(ShoppingCart, { className: "w-5 h-5" }), count > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full", style: { backgroundColor: '#8B0000', color: '#fff' }, children: count }))] }));
};
export default CartIndicator;
