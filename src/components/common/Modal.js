import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from "react";
import { X } from "lucide-react";
import { THEME } from "../../constants/theme";
export const Modal = ({ isOpen, onClose, title, children, footer, maxWidth = "md", headerExtra, }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        }
        else {
            document.body.style.overflow = "unset";
        }
        return () => {
            document.body.style.overflow = "unset";
        };
    }, [isOpen]);
    if (!isOpen)
        return null;
    const maxWidthClasses = {
        sm: "max-w-md",
        md: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    };
    return (_jsxs("div", { className: "fixed inset-0 z-50 overflow-y-auto", children: [_jsx("div", { className: "fixed inset-0 transition-opacity backdrop-blur-[2px]", style: {
                    backgroundColor: "rgba(0, 0, 0, 0.3)", // Only 30% opacity - light dim
                }, onClick: onClose }), _jsx("div", { className: "flex min-h-full items-center justify-center p-4", children: _jsxs("div", { className: `relative w-full ${maxWidthClasses[maxWidth]} rounded-2xl shadow-2xl transform transition-all z-10 overflow-visible`, style: {
                        backgroundColor: THEME.colors.background.secondary,
                    }, onClick: (e) => e.stopPropagation(), children: [_jsx("div", { className: "p-6 border-b overflow-visible", style: { borderColor: THEME.colors.border.DEFAULT }, children: _jsx("div", { className: "flex flex-col gap-4", children: _jsxs("div", { className: "flex items-center justify-between gap-4 flex-wrap", children: [_jsx("h3", { className: "text-xl font-semibold", style: { color: THEME.colors.text.primary }, children: title }), headerExtra && (_jsx("div", { className: "flex-1 min-w-[260px] max-w-[460px] relative z-[100]", children: headerExtra })), _jsx("button", { onClick: onClose, className: "p-2 rounded-lg transition-all", style: { color: THEME.colors.text.tertiary }, onMouseEnter: (e) => {
                                                e.currentTarget.style.backgroundColor =
                                                    THEME.colors.background.hover;
                                            }, onMouseLeave: (e) => {
                                                e.currentTarget.style.backgroundColor = "transparent";
                                            }, children: _jsx(X, { className: "w-5 h-5" }) })] }) }) }), _jsx("div", { className: "p-6 overflow-visible", children: children }), footer && (_jsx("div", { className: "flex items-center justify-end gap-3 p-6 border-t", style: { borderColor: THEME.colors.border.DEFAULT }, children: footer }))] }) })] }));
};
