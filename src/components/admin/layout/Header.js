import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from "react";
import { Menu, Search } from "lucide-react";
import { useLocation } from "react-router-dom";
import { useAdmin } from "../../../contexts/AdminContext";
import { THEME } from "../../../constants/theme";
import { Avatar } from "../../common/Avatar";
// Map routes to page titles
const routeTitles = {
    "/admin/dashboard": "Dashboard",
    "/admin/users": "Users",
    "/admin/menu": "Menu",
    "/admin/orders": "Orders",
    "/admin/tracking": "Tracking",
    "/admin/availability": "Availability",
    "/admin/reports": "Reports",
    "/admin/settings": "Settings",
};
export const Header = () => {
    const { setMobileMenuOpen, adminUser } = useAdmin();
    const [searchValue, setSearchValue] = React.useState("");
    const location = useLocation();
    // Get current page title from route
    const currentPage = routeTitles[location.pathname] || "Dashboard";
    return (_jsx("header", { className: "h-12 sticky top-0 z-20 p-5", style: {
            backgroundColor: THEME.colors.background.primary,
            borderBottom: `1px solid ${THEME.colors.border.dark}`,
        }, children: _jsxs("div", { className: "h-full px-4 lg:px-6 flex items-center justify-between gap-3", children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("button", { onClick: () => setMobileMenuOpen(true), className: "lg:hidden p-1.5 rounded-lg transition-colors", style: { color: THEME.colors.text.secondary }, onMouseEnter: (e) => {
                                e.currentTarget.style.backgroundColor =
                                    THEME.colors.background.hover;
                            }, onMouseLeave: (e) => {
                                e.currentTarget.style.backgroundColor = "transparent";
                            }, children: _jsx(Menu, { className: "w-4 h-4" }) }), _jsx("h2", { className: "text-sm font-semibold", style: { color: THEME.colors.text.primary }, children: currentPage })] }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsxs("div", { className: "hidden md:flex items-center rounded-lg px-3 h-8 w-56 transition-all", style: {
                                backgroundColor: "transparent",
                                border: `1px solid ${THEME.colors.border.dark}`,
                            }, children: [_jsx(Search, { className: "w-3.5 h-3.5 flex-shrink-0", style: { color: THEME.colors.text.tertiary } }), _jsx("input", { type: "text", placeholder: "Search", value: searchValue, onChange: (e) => setSearchValue(e.target.value), className: "ml-2 bg-transparent border-none outline-none text-xs w-full", style: { color: THEME.colors.text.primary } })] }), _jsxs("div", { className: "flex items-center gap-2 px-1.5 h-8", children: [_jsx(Avatar, { src: adminUser?.avatar, name: adminUser?.name, size: "sm" }, adminUser?.avatar || adminUser?.name), _jsx("span", { className: "hidden lg:block text-xs font-medium", style: { color: THEME.colors.text.primary }, children: adminUser?.name?.split(" ")[0] || "Admin" })] })] })] }) }));
};
