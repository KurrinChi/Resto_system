import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const Input = ({ label, error, icon, helperText, className = '', ...props }) => {
    return (_jsxs("div", { className: "w-full", children: [label && (_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: label })), _jsxs("div", { className: "relative", children: [icon && (_jsx("div", { className: "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400", children: icon })), _jsx("input", { className: `
            w-full px-4 py-2 border rounded-lg 
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
            ${icon ? 'pl-10' : ''}
            ${error ? 'border-red-500' : 'border-gray-300'}
            ${className}
          `, style: props.style, ...props })] }), error && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: error })), helperText && !error && (_jsx("p", { className: "mt-1 text-sm text-gray-500", children: helperText }))] }));
};
export default Input;
