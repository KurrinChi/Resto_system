import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAdmin } from "../../../contexts/AdminContext";
import { THEME } from "../../../constants/theme";
export const AdminLayout = () => {
    const { mobileMenuOpen, setMobileMenuOpen } = useAdmin();
    return (_jsxs("div", { className: "flex h-screen w-screen overflow-hidden", style: { backgroundColor: THEME.colors.background.primary }, children: [_jsx(Sidebar, {}), mobileMenuOpen && (_jsx("div", { className: "fixed inset-0 z-30 lg:hidden backdrop-blur-sm", style: { backgroundColor: "rgba(0, 0, 0, 0.6)" }, onClick: () => setMobileMenuOpen(false) })), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden min-w-0", children: [_jsx(Header, {}), _jsx("main", { className: "flex-1 overflow-y-auto overflow-x-hidden p-6 lg:p-8", style: { backgroundColor: THEME.colors.background.primary }, children: _jsx("div", { className: "max-w-full", children: _jsx(Outlet, {}) }) })] })] }));
};
