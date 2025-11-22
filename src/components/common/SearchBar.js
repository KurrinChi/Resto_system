import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Search } from 'lucide-react';
export const SearchBar = ({ placeholder = 'Search...', value, onChange, onSearch, className = '', }) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && onSearch) {
            onSearch();
        }
    };
    return (_jsxs("div", { className: `relative ${className}`, children: [_jsx(Search, { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" }), _jsx("input", { type: "text", placeholder: placeholder, value: value, onChange: (e) => onChange(e.target.value), onKeyPress: handleKeyPress, className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" })] }));
};
export default SearchBar;
