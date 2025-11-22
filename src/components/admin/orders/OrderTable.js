import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Eye, ChevronLeft, ChevronRight, X } from "lucide-react";
import { Badge } from "../../common/Badge";
import { Dropdown } from "../../common/Dropdown";
import { THEME } from "../../../constants/theme";
const ITEMS_PER_PAGE = 10;
export const OrderTable = ({ orders, onView, onUpdateStatus, onCancelOrder, }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const getStatusVariant = (status) => {
        switch (status) {
            case "delivered":
                return "success";
            case "ready":
                return "info";
            case "preparing":
                return "warning";
            case "cancelled":
                return "error";
            default:
                return "warning";
        }
    };
    const getPaymentVariant = (status) => {
        switch (status) {
            case "paid":
                return "success";
            case "pending":
                return "warning";
            case "refunded":
                return "error";
            default:
                return "warning";
        }
    };
    // Calculate pagination
    const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentOrders = orders.slice(startIndex, endIndex);
    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };
    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };
    if (orders.length === 0) {
        return (_jsx("div", { className: "flex items-center justify-center flex-1", style: { color: THEME.colors.text.tertiary }, children: _jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-lg font-medium mb-2", children: "No orders found" }), _jsx("p", { className: "text-sm", children: "Try adjusting your search or filters" })] }) }));
    }
    return (_jsxs("div", { className: "flex flex-col h-full", children: [_jsx("div", { className: "overflow-x-auto flex-1", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "sticky top-0 z-10", children: _jsxs("tr", { style: {
                                    backgroundColor: THEME.colors.background.tertiary,
                                    borderBottom: `2px solid ${THEME.colors.border.light}`,
                                }, children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider", style: { color: THEME.colors.text.secondary }, children: "Order #" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider", style: { color: THEME.colors.text.secondary }, children: "Customer" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider", style: { color: THEME.colors.text.secondary }, children: "Items" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider", style: { color: THEME.colors.text.secondary }, children: "Total" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider", style: { color: THEME.colors.text.secondary }, children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider", style: { color: THEME.colors.text.secondary }, children: "Payment" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider", style: { color: THEME.colors.text.secondary }, children: "Date" }), _jsx("th", { className: "px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider", style: { color: THEME.colors.text.secondary }, children: "Actions" })] }) }), _jsx("tbody", { children: currentOrders.map((order, index) => (_jsxs("tr", { className: "transition-all duration-200", style: {
                                    backgroundColor: index % 2 === 0
                                        ? THEME.colors.background.secondary
                                        : THEME.colors.background.tertiary,
                                    borderBottom: `1px solid ${THEME.colors.border.dark}`,
                                }, onMouseEnter: (e) => {
                                    e.currentTarget.style.backgroundColor =
                                        THEME.colors.background.hover;
                                }, onMouseLeave: (e) => {
                                    e.currentTarget.style.backgroundColor =
                                        index % 2 === 0
                                            ? THEME.colors.background.secondary
                                            : THEME.colors.background.tertiary;
                                }, children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-semibold", style: { color: THEME.colors.text.primary }, children: order.orderNumber }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", style: { color: THEME.colors.text.primary }, children: order.customerName }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm", style: { color: THEME.colors.text.primary }, children: [order.items.length, " item", order.items.length !== 1 ? "s" : ""] }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-bold", style: { color: THEME.colors.text.primary }, children: ["$", order.total.toFixed(2)] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx(Dropdown, { trigger: _jsx("span", { className: "cursor-pointer", children: _jsx(Badge, { variant: getStatusVariant(order.status), children: order.status.charAt(0).toUpperCase() +
                                                        order.status.slice(1) }) }), options: [
                                                {
                                                    label: "Pending",
                                                    value: "pending",
                                                    onClick: () => onUpdateStatus(order.id, "pending"),
                                                },
                                                {
                                                    label: "Preparing",
                                                    value: "preparing",
                                                    onClick: () => onUpdateStatus(order.id, "preparing"),
                                                },
                                                {
                                                    label: "Ready",
                                                    value: "ready",
                                                    onClick: () => onUpdateStatus(order.id, "ready"),
                                                },
                                                {
                                                    label: "Delivered",
                                                    value: "delivered",
                                                    onClick: () => onUpdateStatus(order.id, "delivered"),
                                                },
                                                {
                                                    label: "Cancelled",
                                                    value: "cancelled",
                                                    onClick: () => onUpdateStatus(order.id, "cancelled"),
                                                },
                                            ] }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx(Badge, { variant: getPaymentVariant(order.paymentStatus), children: order.paymentStatus.charAt(0).toUpperCase() +
                                                order.paymentStatus.slice(1) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm", style: { color: THEME.colors.text.primary }, children: new Date(order.orderDate).toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-right", children: _jsxs("div", { className: "flex items-center justify-end gap-2", children: [_jsxs("button", { onClick: () => onView(order), className: "p-2 rounded-lg transition-all border inline-flex items-center gap-2", style: {
                                                        color: THEME.colors.text.secondary,
                                                        backgroundColor: "transparent",
                                                        borderColor: THEME.colors.border.DEFAULT,
                                                    }, onMouseEnter: (e) => {
                                                        e.currentTarget.style.backgroundColor =
                                                            "rgba(59, 130, 246, 0.1)";
                                                        e.currentTarget.style.color = "#3b82f6";
                                                        e.currentTarget.style.borderColor = "#3b82f6";
                                                    }, onMouseLeave: (e) => {
                                                        e.currentTarget.style.backgroundColor = "transparent";
                                                        e.currentTarget.style.color = THEME.colors.text.secondary;
                                                        e.currentTarget.style.borderColor =
                                                            THEME.colors.border.DEFAULT;
                                                    }, title: "View Order", children: [_jsx(Eye, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "View" })] }), order.status !== "cancelled" && order.status !== "delivered" && (_jsxs("button", { onClick: () => onCancelOrder?.(order.id), className: "p-2 rounded-lg transition-all border inline-flex items-center gap-2", style: {
                                                        color: THEME.colors.text.secondary,
                                                        backgroundColor: "transparent",
                                                        borderColor: THEME.colors.border.DEFAULT,
                                                    }, onMouseEnter: (e) => {
                                                        e.currentTarget.style.backgroundColor =
                                                            "rgba(239, 68, 68, 0.1)";
                                                        e.currentTarget.style.color = "#ef4444";
                                                        e.currentTarget.style.borderColor = "#ef4444";
                                                    }, onMouseLeave: (e) => {
                                                        e.currentTarget.style.backgroundColor = "transparent";
                                                        e.currentTarget.style.color = THEME.colors.text.secondary;
                                                        e.currentTarget.style.borderColor =
                                                            THEME.colors.border.DEFAULT;
                                                    }, title: "Cancel Order", children: [_jsx(X, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "Cancel" })] }))] }) })] }, order.id))) })] }) }), _jsxs("div", { className: "flex items-center justify-between px-6 py-3 border-t flex-shrink-0", style: {
                    backgroundColor: THEME.colors.background.tertiary,
                    borderColor: THEME.colors.border.DEFAULT,
                }, children: [_jsx("div", { className: "flex items-center gap-2", children: _jsxs("p", { className: "text-sm", style: { color: THEME.colors.text.secondary }, children: ["Showing", " ", _jsx("span", { style: { color: THEME.colors.text.primary, fontWeight: 600 }, children: startIndex + 1 }), " ", "to", " ", _jsx("span", { style: { color: THEME.colors.text.primary, fontWeight: 600 }, children: Math.min(endIndex, orders.length) }), " ", "of", " ", _jsx("span", { style: { color: THEME.colors.text.primary, fontWeight: 600 }, children: orders.length }), " ", "orders"] }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: handlePrevPage, disabled: currentPage === 1, className: "p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed", style: {
                                    backgroundColor: THEME.colors.background.secondary,
                                    color: THEME.colors.text.primary,
                                    borderWidth: "1px",
                                    borderColor: THEME.colors.border.DEFAULT,
                                }, onMouseEnter: (e) => {
                                    if (currentPage !== 1) {
                                        e.currentTarget.style.backgroundColor =
                                            THEME.colors.background.hover;
                                    }
                                }, onMouseLeave: (e) => {
                                    e.currentTarget.style.backgroundColor =
                                        THEME.colors.background.secondary;
                                }, children: _jsx(ChevronLeft, { className: "w-5 h-5" }) }), _jsx("div", { className: "flex items-center gap-1", children: Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                                    let page;
                                    if (totalPages <= 5) {
                                        page = i + 1;
                                    }
                                    else if (currentPage <= 3) {
                                        page = i + 1;
                                    }
                                    else if (currentPage >= totalPages - 2) {
                                        page = totalPages - 4 + i;
                                    }
                                    else {
                                        page = currentPage - 2 + i;
                                    }
                                    return page;
                                }).map((page) => (_jsx("button", { onClick: () => setCurrentPage(page), className: "px-3 py-2 rounded-lg text-sm font-medium transition-all", style: {
                                        backgroundColor: page === currentPage
                                            ? THEME.colors.primary.DEFAULT
                                            : THEME.colors.background.secondary,
                                        color: page === currentPage
                                            ? THEME.colors.text.primary
                                            : THEME.colors.text.secondary,
                                        borderWidth: "1px",
                                        borderColor: page === currentPage
                                            ? "transparent"
                                            : THEME.colors.border.DEFAULT,
                                    }, onMouseEnter: (e) => {
                                        if (page !== currentPage) {
                                            e.currentTarget.style.backgroundColor =
                                                THEME.colors.background.hover;
                                        }
                                    }, onMouseLeave: (e) => {
                                        if (page !== currentPage) {
                                            e.currentTarget.style.backgroundColor =
                                                THEME.colors.background.secondary;
                                        }
                                    }, children: page }, page))) }), _jsx("button", { onClick: handleNextPage, disabled: currentPage === totalPages, className: "p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed", style: {
                                    backgroundColor: THEME.colors.background.secondary,
                                    color: THEME.colors.text.primary,
                                    borderWidth: "1px",
                                    borderColor: THEME.colors.border.DEFAULT,
                                }, onMouseEnter: (e) => {
                                    if (currentPage !== totalPages) {
                                        e.currentTarget.style.backgroundColor =
                                            THEME.colors.background.hover;
                                    }
                                }, onMouseLeave: (e) => {
                                    e.currentTarget.style.backgroundColor =
                                        THEME.colors.background.secondary;
                                }, children: _jsx(ChevronRight, { className: "w-5 h-5" }) })] })] })] }));
};
