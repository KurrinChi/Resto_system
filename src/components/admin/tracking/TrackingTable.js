import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { MapPin, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "../../common/Badge";
import { THEME } from "../../../constants/theme";
const ITEMS_PER_PAGE = 10;
export const TrackingTable = ({ trackingData, onViewLocation, }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const getStatusVariant = (status) => {
        switch (status) {
            case "delivered":
                return "success";
            case "out_for_delivery":
                return "info";
            case "preparing":
                return "warning";
            default:
                return "warning";
        }
    };
    const formatStatus = (status) => {
        return status
            .split("_")
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };
    // Calculate pagination
    const totalPages = Math.ceil(trackingData.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const currentItems = trackingData.slice(startIndex, endIndex);
    const handlePrevPage = () => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    };
    const handleNextPage = () => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    };
    if (trackingData.length === 0) {
        return (_jsx("div", { className: "flex items-center justify-center flex-1", style: { color: THEME.colors.text.tertiary }, children: _jsxs("div", { className: "text-center py-12", children: [_jsx("p", { className: "text-lg font-medium mb-2", children: "No tracking data found" }), _jsx("p", { className: "text-sm", children: "Try adjusting your search or filters" })] }) }));
    }
    return (_jsxs("div", { className: "flex flex-col h-full", children: [_jsx("div", { className: "overflow-x-auto flex-1", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { className: "sticky top-0 z-10", children: _jsxs("tr", { style: {
                                    backgroundColor: THEME.colors.background.tertiary,
                                    borderBottom: `2px solid ${THEME.colors.border.light}`,
                                }, children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider", style: { color: THEME.colors.text.secondary }, children: "Order #" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider", style: { color: THEME.colors.text.secondary }, children: "Customer" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider", style: { color: THEME.colors.text.secondary }, children: "Driver" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider", style: { color: THEME.colors.text.secondary }, children: "Status" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider", style: { color: THEME.colors.text.secondary }, children: "Est. Delivery" }), _jsx("th", { className: "px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider", style: { color: THEME.colors.text.secondary }, children: "Actions" })] }) }), _jsx("tbody", { children: currentItems.map((tracking, index) => (_jsxs("tr", { className: "transition-all duration-200", style: {
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
                                }, children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-semibold", style: { color: THEME.colors.text.primary }, children: tracking.orderNumber }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", style: { color: THEME.colors.text.primary }, children: tracking.customerName }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm", style: { color: THEME.colors.text.primary }, children: tracking.driver || "Not assigned" }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap", children: _jsx(Badge, { variant: getStatusVariant(tracking.status), children: formatStatus(tracking.status) }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm", style: { color: THEME.colors.text.primary }, children: new Date(tracking.estimatedDelivery).toLocaleString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        }) }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-right", children: _jsxs("button", { onClick: () => onViewLocation(tracking), disabled: !tracking.location, className: "p-2 rounded-lg transition-all border inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed", style: {
                                                color: THEME.colors.text.secondary,
                                                backgroundColor: "transparent",
                                                borderColor: THEME.colors.border.DEFAULT,
                                            }, onMouseEnter: (e) => {
                                                if (tracking.location) {
                                                    e.currentTarget.style.backgroundColor =
                                                        "rgba(59, 130, 246, 0.1)";
                                                    e.currentTarget.style.color = "#3b82f6";
                                                    e.currentTarget.style.borderColor = "#3b82f6";
                                                }
                                            }, onMouseLeave: (e) => {
                                                e.currentTarget.style.backgroundColor = "transparent";
                                                e.currentTarget.style.color = THEME.colors.text.secondary;
                                                e.currentTarget.style.borderColor =
                                                    THEME.colors.border.DEFAULT;
                                            }, children: [_jsx(MapPin, { className: "w-4 h-4" }), _jsx("span", { className: "text-sm", children: "View Location" })] }) })] }, tracking.orderId))) })] }) }), _jsxs("div", { className: "flex items-center justify-between px-6 py-3 border-t flex-shrink-0", style: {
                    backgroundColor: THEME.colors.background.tertiary,
                    borderColor: THEME.colors.border.DEFAULT,
                }, children: [_jsx("div", { className: "flex items-center gap-2", children: _jsxs("p", { className: "text-sm", style: { color: THEME.colors.text.secondary }, children: ["Showing", " ", _jsx("span", { style: { color: THEME.colors.text.primary, fontWeight: 600 }, children: startIndex + 1 }), " ", "to", " ", _jsx("span", { style: { color: THEME.colors.text.primary, fontWeight: 600 }, children: Math.min(endIndex, trackingData.length) }), " ", "of", " ", _jsx("span", { style: { color: THEME.colors.text.primary, fontWeight: 600 }, children: trackingData.length }), " ", "orders"] }) }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("button", { onClick: handlePrevPage, disabled: currentPage === 1, className: "p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed", style: {
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
