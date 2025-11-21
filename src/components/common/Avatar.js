import { jsx as _jsx } from "react/jsx-runtime";
export const Avatar = ({ src, alt, name, size = "md", }) => {
    const sizes = {
        sm: "w-8 h-8 text-xs",
        md: "w-10 h-10 text-sm",
        lg: "w-12 h-12 text-base",
        xl: "w-16 h-16 text-lg",
    };
    const getInitials = (name) => {
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };
    return (_jsx("div", { className: `${sizes[size]} rounded-full overflow-hidden flex items-center justify-center bg-red-600 text-white font-medium`, children: src ? (_jsx("img", { src: src, alt: alt || name, className: "w-full h-full object-cover" })) : (_jsx("span", { children: name ? getInitials(name) : "?" })) }));
};
