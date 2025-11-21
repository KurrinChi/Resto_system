import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Card = ({ children, title, subtitle, headerAction, className = '', padding = 'md', style, }) => {
    const paddingClasses = {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
    };
    const borderColor = style && style.borderColor;
    const hasCustomBg = style && style.backgroundColor;
    return (_jsxs("div", { style: style, className: `${!hasCustomBg ? 'bg-[#1a1d29]' : ''} rounded-3xl shadow-lg border border-gray-800 ${className}`, children: [(title || subtitle || headerAction) && (_jsxs("div", { className: "border-b px-6 py-4 flex items-center justify-between", style: { borderColor: borderColor || undefined }, children: [_jsxs("div", { children: [title && _jsx("h3", { className: "text-lg font-semibold", children: title }), subtitle && _jsx("p", { className: "text-sm mt-1", children: subtitle })] }), headerAction && _jsx("div", { children: headerAction })] })), _jsx("div", { className: paddingClasses[padding], children: children })] }));
};
