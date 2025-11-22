import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
/** @jsxImportSource react */
import { LayoutDashboard, Users, UtensilsCrossed, ShoppingCart, MapPin, Clock, BarChart3, Settings, LogOut, ChevronUp, User, } from "lucide-react";
import { useAdmin } from "../../../contexts/AdminContext";
import { BRANDING } from "../../../constants/branding";
import { THEME } from "../../../constants/theme";
import { Avatar } from "../../common/Avatar";
import { dashboardApi } from "../../../services/apiservice";
const menuItems = [
    {
        path: "/admin/dashboard",
        label: "Dashboard",
        icon: _jsx(LayoutDashboard, { className: "w-5 h-5" }),
    },
    {
        path: "/admin/users",
        label: "Users",
        icon: _jsx(Users, { className: "w-5 h-5" }),
    },
    {
        path: "/admin/menu",
        label: "Menu",
        icon: _jsx(UtensilsCrossed, { className: "w-5 h-5" }),
    },
    {
        path: "/admin/orders",
        label: "Orders",
        icon: _jsx(ShoppingCart, { className: "w-5 h-5" }),
        badgeKey: 'pending_orders',
    },
    {
        path: "/admin/tracking",
        label: "Tracking",
        icon: _jsx(MapPin, { className: "w-5 h-5" }),
    },
    {
        path: "/admin/availability",
        label: "Availability",
        icon: _jsx(Clock, { className: "w-5 h-5" }),
    },
    {
        path: "/admin/reports",
        label: "Reports",
        icon: _jsx(BarChart3, { className: "w-5 h-5" }),
    },
];
export const Sidebar = () => {
    const { mobileMenuOpen, setMobileMenuOpen, adminUser } = useAdmin();
    const [isExpanded, setIsExpanded] = React.useState(false);
    const [showProfileMenu, setShowProfileMenu] = React.useState(false);
    const [showMobileProfileMenu, setShowMobileProfileMenu] = React.useState(false);
    const [badges, setBadges] = useState({});
    useEffect(() => {
        fetchBadgeCounts();
        // Refresh every 30 seconds
        const interval = setInterval(fetchBadgeCounts, 30000);
        return () => clearInterval(interval);
    }, []);
    const fetchBadgeCounts = async () => {
        try {
            const response = await dashboardApi.getStats();
            if (response.success) {
                setBadges({
                    pending_orders: response.data.pending_orders || 0
                });
            }
        }
        catch (err) {
            console.error('Error fetching badge counts:', err);
        }
    };
    return (_jsxs(_Fragment, { children: [_jsxs("aside", { className: `hidden lg:flex lg:flex-col will-change-[width] ${isExpanded ? "w-64" : "w-20"}`, style: {
                    backgroundColor: THEME.colors.background.secondary,
                    transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                }, onMouseEnter: () => setIsExpanded(true), onMouseLeave: () => setIsExpanded(false), children: [_jsx("div", { className: "h-16 flex items-center justify-center px-4", style: { borderBottom: `1px solid ${THEME.colors.border.dark}` }, children: isExpanded ? (BRANDING.logo.url ? (_jsx("img", { src: BRANDING.logo.url, alt: BRANDING.logo.alt, className: "h-8 w-auto" })) : (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 rounded-lg flex items-center justify-center", style: { background: THEME.colors.primary.DEFAULT }, children: _jsx("span", { className: "text-white font-bold text-sm", children: BRANDING.logo.text.charAt(0) }) }), _jsx("span", { className: "font-semibold text-sm transition-opacity duration-400", style: {
                                        color: THEME.colors.text.primary,
                                        opacity: isExpanded ? 1 : 0,
                                    }, children: BRANDING.logo.text })] }))) : (_jsx("div", { className: "w-9 h-9 rounded-xl flex items-center justify-center", style: { background: THEME.colors.primary.DEFAULT }, children: _jsx("span", { className: "text-white font-bold", children: BRANDING.logo.text.charAt(0) }) })) }), _jsx("nav", { className: "flex-1 py-4 px-3 space-y-1 overflow-y-auto overflow-x-hidden", children: menuItems.map((item) => (_jsxs(NavLink, { to: item.path, className: ({ isActive }) => `relative flex items-center gap-3 px-3 h-11 rounded-lg ${isActive ? "text-white font-medium" : "hover:text-white"} ${!isExpanded && "justify-center"}`, style: ({ isActive }) => ({
                                backgroundColor: isActive
                                    ? THEME.colors.primary.DEFAULT
                                    : "transparent",
                                color: isActive
                                    ? THEME.colors.text.primary
                                    : THEME.colors.text.secondary,
                                transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                            }), onMouseEnter: (e) => {
                                const isActive = e.currentTarget.getAttribute("aria-current") === "page";
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor =
                                        THEME.colors.background.hover;
                                }
                            }, onMouseLeave: (e) => {
                                const isActive = e.currentTarget.getAttribute("aria-current") === "page";
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                }
                            }, title: !isExpanded ? item.label : undefined, children: [_jsx("span", { className: "flex-shrink-0", style: { transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)" }, children: item.icon }), isExpanded && (_jsxs(_Fragment, { children: [_jsx("span", { className: "text-sm font-medium flex-1 truncate", style: {
                                                transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                                transitionDelay: "0.1s",
                                                opacity: isExpanded ? 1 : 0,
                                            }, children: item.label }), item.badgeKey && badges[item.badgeKey] > 0 && (_jsx("span", { className: "flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold rounded-full", style: {
                                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                                                color: THEME.colors.text.primary,
                                                transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                                transitionDelay: "0.15s",
                                                opacity: isExpanded ? 1 : 0,
                                            }, children: badges[item.badgeKey] }))] })), !isExpanded && item.badgeKey && badges[item.badgeKey] > 0 && (_jsx("span", { className: "absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 text-[10px] font-bold rounded-full", style: {
                                        backgroundColor: THEME.colors.primary.DEFAULT,
                                        color: THEME.colors.text.primary,
                                    }, children: badges[item.badgeKey] }))] }, item.path))) }), _jsxs("div", { className: "p-3 relative", style: { borderTop: `1px solid ${THEME.colors.border.dark}` }, children: [showProfileMenu && isExpanded && (_jsxs("div", { className: "absolute bottom-full left-3 right-3 mb-2 rounded-lg border overflow-hidden", style: {
                                    backgroundColor: THEME.colors.background.secondary,
                                    borderColor: THEME.colors.border.DEFAULT,
                                }, children: [_jsxs(NavLink, { to: "/admin/profile", onClick: () => setShowProfileMenu(false), className: "flex items-center gap-3 px-4 py-3 transition-colors", style: { color: THEME.colors.text.primary }, onMouseEnter: (e) => {
                                            e.currentTarget.style.backgroundColor =
                                                THEME.colors.background.hover;
                                        }, onMouseLeave: (e) => {
                                            e.currentTarget.style.backgroundColor = "transparent";
                                        }, children: [_jsx(User, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "My Profile" })] }), _jsxs(NavLink, { to: "/admin/settings", onClick: () => setShowProfileMenu(false), className: "flex items-center gap-3 px-4 py-3 transition-colors", style: { color: THEME.colors.text.primary }, onMouseEnter: (e) => {
                                            e.currentTarget.style.backgroundColor =
                                                THEME.colors.background.hover;
                                        }, onMouseLeave: (e) => {
                                            e.currentTarget.style.backgroundColor = "transparent";
                                        }, children: [_jsx(Settings, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "Settings" })] }), _jsx("div", { style: {
                                            borderTop: `1px solid ${THEME.colors.border.DEFAULT}`,
                                        }, children: _jsxs("button", { onClick: () => {
                                                setShowProfileMenu(false);
                                                try {
                                                    sessionStorage.removeItem('rs_current_user');
                                                    localStorage.removeItem('rs_current_user');
                                                    localStorage.removeItem('rs_admin_token');
                                                }
                                                catch { }
                                                window.location.href = '/login';
                                            }, className: "flex items-center gap-3 px-4 py-3 w-full transition-colors", style: { color: THEME.colors.status.error }, onMouseEnter: (e) => {
                                                e.currentTarget.style.backgroundColor =
                                                    THEME.colors.background.hover;
                                            }, onMouseLeave: (e) => {
                                                e.currentTarget.style.backgroundColor = "transparent";
                                            }, children: [_jsx(LogOut, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "Logout" })] }) })] })), showProfileMenu && !isExpanded && (_jsxs("div", { className: "absolute bottom-full left-3 right-3 mb-2 rounded-lg border overflow-hidden", style: {
                                    backgroundColor: THEME.colors.background.secondary,
                                    borderColor: THEME.colors.border.DEFAULT,
                                    width: '240px',
                                }, children: [_jsxs(NavLink, { to: "/admin/profile", onClick: () => setShowProfileMenu(false), className: "flex items-center gap-3 px-4 py-3 transition-colors", style: { color: THEME.colors.text.primary }, onMouseEnter: (e) => {
                                            e.currentTarget.style.backgroundColor =
                                                THEME.colors.background.hover;
                                        }, onMouseLeave: (e) => {
                                            e.currentTarget.style.backgroundColor = "transparent";
                                        }, children: [_jsx(User, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "My Profile" })] }), _jsxs(NavLink, { to: "/admin/settings", onClick: () => setShowProfileMenu(false), className: "flex items-center gap-3 px-4 py-3 transition-colors", style: { color: THEME.colors.text.primary }, onMouseEnter: (e) => {
                                            e.currentTarget.style.backgroundColor =
                                                THEME.colors.background.hover;
                                        }, onMouseLeave: (e) => {
                                            e.currentTarget.style.backgroundColor = "transparent";
                                        }, children: [_jsx(Settings, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "Settings" })] }), _jsx("div", { style: {
                                            borderTop: `1px solid ${THEME.colors.border.DEFAULT}`,
                                        }, children: _jsxs("button", { onClick: () => {
                                                setShowProfileMenu(false);
                                                try {
                                                    sessionStorage.removeItem('rs_current_user');
                                                    localStorage.removeItem('rs_current_user');
                                                    localStorage.removeItem('rs_admin_token');
                                                }
                                                catch { }
                                                window.location.href = '/login';
                                            }, className: "flex items-center gap-3 px-4 py-3 w-full transition-colors", style: { color: THEME.colors.status.error }, onMouseEnter: (e) => {
                                                e.currentTarget.style.backgroundColor =
                                                    THEME.colors.background.hover;
                                            }, onMouseLeave: (e) => {
                                                e.currentTarget.style.backgroundColor = "transparent";
                                            }, children: [_jsx(LogOut, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "Logout" })] }) })] })), isExpanded ? (_jsxs("button", { onClick: () => setShowProfileMenu(!showProfileMenu), className: "flex items-center gap-3 p-2.5 rounded-lg cursor-pointer w-full", style: {
                                    transition: "background-color 0.2s ease",
                                    backgroundColor: showProfileMenu
                                        ? THEME.colors.background.hover
                                        : "transparent",
                                }, onMouseEnter: (e) => {
                                    if (!showProfileMenu) {
                                        e.currentTarget.style.backgroundColor =
                                            THEME.colors.background.hover;
                                    }
                                }, onMouseLeave: (e) => {
                                    if (!showProfileMenu) {
                                        e.currentTarget.style.backgroundColor = "transparent";
                                    }
                                }, children: [_jsx(Avatar, { src: adminUser?.avatar, name: adminUser?.name, size: "sm" }, adminUser?.avatar || adminUser?.name), _jsxs("div", { className: "flex-1 min-w-0 text-left", style: {
                                            transition: "opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                                            transitionDelay: "0.1s",
                                            opacity: isExpanded ? 1 : 0,
                                        }, children: [_jsx("p", { className: "text-sm font-medium truncate", style: { color: THEME.colors.text.primary }, children: adminUser?.name || "Admin User" }), _jsx("p", { className: "text-xs truncate", style: { color: THEME.colors.text.tertiary }, children: adminUser?.role || "Administrator" })] }), _jsx(ChevronUp, { className: `w-4 h-4 transition-transform ${showProfileMenu ? "rotate-180" : ""}`, style: { color: THEME.colors.text.tertiary } })] })) : (_jsx("button", { onClick: () => setShowProfileMenu(!showProfileMenu), className: "flex justify-center items-center p-2 rounded-lg cursor-pointer w-full", style: {
                                    transition: "background-color 0.2s ease",
                                    minHeight: "52px", // Fixed height to prevent squishing
                                }, onMouseEnter: (e) => {
                                    e.currentTarget.style.backgroundColor =
                                        THEME.colors.background.hover;
                                }, onMouseLeave: (e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                }, title: "Profile Menu", children: _jsxs("div", { className: "w-10 h-10 flex items-center justify-center", children: [" ", _jsx(Avatar, { src: adminUser?.avatar, name: adminUser?.name, size: "sm" }, adminUser?.avatar || adminUser?.name)] }) }))] })] }), mobileMenuOpen && (_jsx("div", { className: "fixed inset-0 z-40 lg:hidden backdrop-blur-sm", style: { backgroundColor: "rgba(0, 0, 0, 0.6)" }, onClick: () => setMobileMenuOpen(false) })), _jsxs("aside", { className: `fixed top-0 left-0 h-full w-72 z-50 transition-transform duration-300 ease-in-out lg:hidden ${mobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`, style: { backgroundColor: THEME.colors.background.secondary }, children: [_jsxs("div", { className: "h-16 flex items-center justify-between px-4", style: { borderBottom: `1px solid ${THEME.colors.border.dark}` }, children: [BRANDING.logo.url ? (_jsx("img", { src: BRANDING.logo.url, alt: BRANDING.logo.alt, className: "h-8 w-auto" })) : (_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 rounded-lg flex items-center justify-center", style: { background: THEME.colors.primary.DEFAULT }, children: _jsx("span", { className: "text-white font-bold text-sm", children: BRANDING.logo.text.charAt(0) }) }), _jsx("span", { className: "font-semibold text-sm", style: { color: THEME.colors.text.primary }, children: BRANDING.logo.text })] })), _jsx("button", { onClick: () => setMobileMenuOpen(false), className: "p-2 rounded-lg transition-colors", style: { color: THEME.colors.text.secondary }, onMouseEnter: (e) => {
                                    e.currentTarget.style.backgroundColor =
                                        THEME.colors.background.hover;
                                }, onMouseLeave: (e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                }, children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) })] }), _jsx("nav", { className: "py-4 px-3 space-y-1 overflow-y-auto", style: { maxHeight: "calc(100vh - 180px)" }, children: menuItems.map((item) => (_jsxs(NavLink, { to: item.path, onClick: () => setMobileMenuOpen(false), className: ({ isActive }) => `flex items-center gap-3 px-3 h-11 rounded-lg transition-all duration-200 ${isActive ? "font-medium" : ""}`, style: ({ isActive }) => ({
                                backgroundColor: isActive
                                    ? THEME.colors.primary.DEFAULT
                                    : "transparent",
                                color: isActive
                                    ? THEME.colors.text.primary
                                    : THEME.colors.text.secondary,
                            }), onMouseEnter: (e) => {
                                const isActive = e.currentTarget.getAttribute("aria-current") === "page";
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor =
                                        THEME.colors.background.hover;
                                    e.currentTarget.style.color = THEME.colors.text.primary;
                                }
                            }, onMouseLeave: (e) => {
                                const isActive = e.currentTarget.getAttribute("aria-current") === "page";
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                    e.currentTarget.style.color = THEME.colors.text.secondary;
                                }
                            }, children: [_jsx("span", { className: "flex-shrink-0", children: item.icon }), _jsx("span", { className: "text-sm font-medium flex-1 truncate", children: item.label }), item.badgeKey && badges[item.badgeKey] > 0 && (_jsx("span", { className: "flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold rounded-full", style: {
                                        backgroundColor: "rgba(255, 255, 255, 0.1)",
                                        color: THEME.colors.text.primary,
                                    }, children: badges[item.badgeKey] }))] }, item.path))) }), _jsxs("div", { className: "absolute bottom-0 left-0 right-0 p-3", style: {
                            borderTop: `1px solid ${THEME.colors.border.dark}`,
                            backgroundColor: THEME.colors.background.secondary,
                        }, children: [showMobileProfileMenu && (_jsxs("div", { className: "mb-2 rounded-lg border overflow-hidden", style: {
                                    backgroundColor: THEME.colors.background.secondary,
                                    borderColor: THEME.colors.border.DEFAULT,
                                }, children: [_jsxs(NavLink, { to: "/admin/profile", onClick: () => {
                                            setShowMobileProfileMenu(false);
                                            setMobileMenuOpen(false);
                                        }, className: "flex items-center gap-3 px-4 py-3 transition-colors", style: { color: THEME.colors.text.primary }, onMouseEnter: (e) => {
                                            e.currentTarget.style.backgroundColor =
                                                THEME.colors.background.hover;
                                        }, onMouseLeave: (e) => {
                                            e.currentTarget.style.backgroundColor = "transparent";
                                        }, children: [_jsx(User, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "My Profile" })] }), _jsxs(NavLink, { to: "/admin/settings", onClick: () => {
                                            setShowMobileProfileMenu(false);
                                            setMobileMenuOpen(false);
                                        }, className: "flex items-center gap-3 px-4 py-3 transition-colors", style: { color: THEME.colors.text.primary }, onMouseEnter: (e) => {
                                            e.currentTarget.style.backgroundColor =
                                                THEME.colors.background.hover;
                                        }, onMouseLeave: (e) => {
                                            e.currentTarget.style.backgroundColor = "transparent";
                                        }, children: [_jsx(Settings, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "Settings" })] }), _jsx("div", { style: {
                                            borderTop: `1px solid ${THEME.colors.border.DEFAULT}`,
                                        }, children: _jsxs("button", { onClick: () => {
                                                setShowMobileProfileMenu(false);
                                                try {
                                                    sessionStorage.removeItem('rs_current_user');
                                                    localStorage.removeItem('rs_current_user');
                                                    localStorage.removeItem('rs_admin_token');
                                                }
                                                catch { }
                                                window.location.href = '/login';
                                            }, className: "flex items-center gap-3 px-4 py-3 w-full transition-colors", style: { color: THEME.colors.status.error }, onMouseEnter: (e) => {
                                                e.currentTarget.style.backgroundColor =
                                                    THEME.colors.background.hover;
                                            }, onMouseLeave: (e) => {
                                                e.currentTarget.style.backgroundColor = "transparent";
                                            }, children: [_jsx(LogOut, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "Logout" })] }) })] })), _jsxs("button", { onClick: () => setShowMobileProfileMenu(!showMobileProfileMenu), className: "flex items-center gap-3 p-2.5 rounded-lg transition-colors cursor-pointer w-full", style: {
                                    backgroundColor: showMobileProfileMenu
                                        ? THEME.colors.background.hover
                                        : "transparent",
                                }, onMouseEnter: (e) => {
                                    if (!showMobileProfileMenu) {
                                        e.currentTarget.style.backgroundColor =
                                            THEME.colors.background.hover;
                                    }
                                }, onMouseLeave: (e) => {
                                    if (!showMobileProfileMenu) {
                                        e.currentTarget.style.backgroundColor = "transparent";
                                    }
                                }, children: [_jsx(Avatar, { src: adminUser?.avatar, name: adminUser?.name, size: "sm" }, adminUser?.avatar || adminUser?.name), _jsxs("div", { className: "flex-1 min-w-0 text-left", children: [_jsx("p", { className: "text-sm font-medium truncate", style: { color: THEME.colors.text.primary }, children: adminUser?.name || "Admin User" }), _jsx("p", { className: "text-xs truncate", style: { color: THEME.colors.text.tertiary }, children: adminUser?.role || "Administrator" })] }), _jsx(ChevronUp, { className: `w-4 h-4 transition-transform ${showMobileProfileMenu ? "rotate-180" : ""}`, style: { color: THEME.colors.text.tertiary } })] })] })] })] }));
};
