import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Routes, Route, Navigate } from "react-router-dom";
import { AdminLayout } from "./components/admin/layout/AdminLayout";
import { ThemeProvider } from "./contexts/ThemeContext";
import { initializeTheme } from "./constants/theme";
// Client routes
import { ClientLayout, Home as ClientHome, CartProvider, Menu, CartPage, Checkout, OrderHistory, OrderTracking, ProfileEdit, ProfilePage } from "./components/client";
import { Login, Register } from "./components/auth";
// Import all admin pages - Updated Nov 22
import { Dashboard } from "./components/admin/dashboard/Dashboard";
import { UserManagement } from "./components/admin/users/UserManagement";
import { MenuItemManagement } from "./components/admin/menu/MenuItemManagement";
import { OrderManagement } from "./components/admin/orders/OrderManagement";
import { CustomerTracking } from "./components/admin/tracking/CustomerTracking";
import { RestaurantAvailability } from "./components/admin/availability/RestaurantAvailability";
import { ReportsAnalytics } from "./components/admin/reports/ReportsAnalytics";
import { AdminSettings } from "./components/admin/settings/AdminSettings";
import { Profile } from "./components/admin/profile/Profile";
// Initialize theme on app load
initializeTheme();
function App() {
    return (_jsx(ThemeProvider, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(Navigate, { to: "/admin/dashboard", replace: true }) }), _jsxs(Route, { path: "/admin", element: _jsx(AdminLayout, {}), children: [_jsx(Route, { index: true, element: _jsx(Navigate, { to: "/admin/dashboard", replace: true }) }), _jsx(Route, { path: "dashboard", element: _jsx(Dashboard, {}) }), _jsx(Route, { path: "users", element: _jsx(UserManagement, {}) }), _jsx(Route, { path: "menu", element: _jsx(MenuItemManagement, {}) }), _jsx(Route, { path: "orders", element: _jsx(OrderManagement, {}) }), _jsx(Route, { path: "tracking", element: _jsx(CustomerTracking, {}) }), _jsx(Route, { path: "availability", element: _jsx(RestaurantAvailability, {}) }), _jsx(Route, { path: "reports", element: _jsx(ReportsAnalytics, {}) }), _jsx(Route, { path: "settings", element: _jsx(AdminSettings, {}) }), _jsx(Route, { path: "profile", element: _jsx(Profile, {}) })] }), _jsx(Route, { path: "/login", element: _jsx(Login, {}) }), _jsx(Route, { path: "/register", element: _jsx(Register, {}) }), _jsxs(Route, { path: "/client", element: _jsx(CartProvider, { children: _jsx(ClientLayout, {}) }), children: [_jsx(Route, { index: true, element: _jsx(ClientHome, {}) }), _jsx(Route, { path: "menu", element: _jsx(Menu, {}) }), _jsx(Route, { path: "cart", element: _jsx(CartPage, {}) }), _jsx(Route, { path: "checkout", element: _jsx(Checkout, {}) }), _jsx(Route, { path: "orders", element: _jsx(OrderHistory, {}) }), _jsx(Route, { path: "track/:id", element: _jsx(OrderTracking, {}) }), _jsx(Route, { path: "profile", element: _jsx(ProfilePage, {}) }), _jsx(Route, { path: "profile/edit", element: _jsx(ProfileEdit, {}) })] }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }) }));
}
// 404 Not Found Component with Dark Theme
const NotFound = () => {
    return (_jsx("div", { className: "min-h-screen flex items-center justify-center", style: { backgroundColor: "#0a0404" }, children: _jsxs("div", { className: "text-center", children: [_jsx("h1", { className: "text-6xl font-bold", style: { color: "#f5e6e6" }, children: "404" }), _jsx("p", { className: "text-xl mt-4", style: { color: "#d4b8b8" }, children: "Page not found" }), _jsx("a", { href: "/admin/dashboard", className: "mt-6 inline-block px-6 py-3 rounded-lg transition-colors", style: {
                        backgroundColor: "#8B0000",
                        color: "#f5e6e6",
                    }, onMouseEnter: (e) => {
                        e.currentTarget.style.backgroundColor = "#A52A2A";
                    }, onMouseLeave: (e) => {
                        e.currentTarget.style.backgroundColor = "#8B0000";
                    }, children: "Go to Dashboard" })] }) }));
};
export default App;
