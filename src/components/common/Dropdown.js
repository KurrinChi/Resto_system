import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useRef, useEffect } from 'react';
export const Dropdown = ({ trigger, options, align = 'left', }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);
    return (_jsxs("div", { className: "relative", ref: dropdownRef, children: [_jsx("div", { onClick: () => setIsOpen(!isOpen), className: "cursor-pointer", children: trigger }), isOpen && (_jsx("div", { className: `absolute mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 ${align === 'right' ? 'right-0' : 'left-0'}`, children: options.map((option, index) => (_jsxs("button", { onClick: () => {
                        option.onClick?.();
                        setIsOpen(false);
                    }, className: "w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2 transition-colors", children: [option.icon, option.label] }, index))) }))] }));
};
