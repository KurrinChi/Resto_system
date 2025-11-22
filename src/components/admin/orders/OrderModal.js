import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Modal } from "../../common/Modal";
import { Badge } from "../../common/Badge";
import { THEME } from "../../../constants/theme";
export const OrderModal = ({ isOpen, onClose, order, }) => {
    if (!order)
        return null;
    console.log('Order Modal Data:', order);
    const getStatusVariant = (status) => {
        switch (status?.toLowerCase()) {
            case "delivered":
            case "completed":
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
    const formatDate = (dateString) => {
        if (!dateString)
            return 'N/A';
        try {
            return new Date(dateString).toLocaleString();
        }
        catch {
            return dateString;
        }
    };
    const items = order.items || [];
    const total = order.total || 0;
    const orderNumber = order.orderNumber || order.id || 'N/A';
    const customerName = order.customerName || 'Guest';
    const status = order.status || 'pending';
    const paymentStatus = order.paymentStatus || 'pending';
    return (_jsx(Modal, { isOpen: isOpen, onClose: onClose, title: `Order Details - ${orderNumber}`, maxWidth: "lg", children: _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "flex gap-4", children: [_jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm mb-1", style: { color: THEME.colors.text.tertiary }, children: "Order Status" }), _jsx(Badge, { variant: getStatusVariant(status), size: "lg", children: status.charAt(0).toUpperCase() + status.slice(1) })] }), _jsxs("div", { className: "flex-1", children: [_jsx("p", { className: "text-sm mb-1", style: { color: THEME.colors.text.tertiary }, children: "Payment Status" }), _jsx(Badge, { variant: paymentStatus === "paid" ? "success" : "warning", size: "lg", children: paymentStatus.charAt(0).toUpperCase() +
                                        paymentStatus.slice(1) })] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold mb-2", style: { color: THEME.colors.text.primary }, children: "Customer Information" }), _jsxs("div", { className: "rounded-lg p-4 space-y-2", style: {
                                backgroundColor: THEME.colors.background.tertiary,
                                borderWidth: "1px",
                                borderColor: THEME.colors.border.DEFAULT,
                            }, children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { style: { color: THEME.colors.text.tertiary }, children: "Name:" }), _jsx("span", { className: "font-medium", style: { color: THEME.colors.text.primary }, children: customerName })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { style: { color: THEME.colors.text.tertiary }, children: "Order Date:" }), _jsx("span", { className: "font-medium", style: { color: THEME.colors.text.primary }, children: formatDate(order.orderDate) })] }), order.deliveryAddress && (_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { style: { color: THEME.colors.text.tertiary }, children: "Delivery Address:" }), _jsx("span", { className: "font-medium text-right", style: { color: THEME.colors.text.primary }, children: order.deliveryAddress })] }))] })] }), _jsxs("div", { children: [_jsx("h3", { className: "font-semibold mb-2", style: { color: THEME.colors.text.primary }, children: "Order Items" }), _jsx("div", { className: "rounded-lg overflow-hidden", style: {
                                borderWidth: "1px",
                                borderColor: THEME.colors.border.DEFAULT,
                            }, children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { style: { backgroundColor: THEME.colors.background.tertiary }, children: _jsxs("tr", { children: [_jsx("th", { className: "px-4 py-2 text-left text-sm font-medium", style: { color: THEME.colors.text.secondary }, children: "Item" }), _jsx("th", { className: "px-4 py-2 text-left text-sm font-medium", style: { color: THEME.colors.text.secondary }, children: "Qty" }), _jsx("th", { className: "px-4 py-2 text-left text-sm font-medium", style: { color: THEME.colors.text.secondary }, children: "Price" }), _jsx("th", { className: "px-4 py-2 text-right text-sm font-medium", style: { color: THEME.colors.text.secondary }, children: "Subtotal" })] }) }), _jsx("tbody", { className: "divide-y", style: { borderColor: THEME.colors.border.DEFAULT }, children: items.length > 0 ? items.map((item, index) => (_jsxs("tr", { style: {
                                                backgroundColor: index % 2 === 0
                                                    ? THEME.colors.background.secondary
                                                    : THEME.colors.background.tertiary,
                                            }, children: [_jsx("td", { className: "px-4 py-3 text-sm", style: { color: THEME.colors.text.primary }, children: item.name || 'Unknown Item' }), _jsx("td", { className: "px-4 py-3 text-sm", style: { color: THEME.colors.text.primary }, children: item.quantity || 1 }), _jsxs("td", { className: "px-4 py-3 text-sm", style: { color: THEME.colors.text.primary }, children: ["$", (item.price || 0).toFixed(2)] }), _jsxs("td", { className: "px-4 py-3 text-sm text-right", style: { color: THEME.colors.text.primary }, children: ["$", ((item.quantity || 1) * (item.price || 0)).toFixed(2)] })] }, index))) : (_jsx("tr", { children: _jsx("td", { colSpan: 4, className: "px-4 py-3 text-sm text-center", style: { color: THEME.colors.text.tertiary }, children: "No items found" }) })) }), _jsx("tfoot", { style: { backgroundColor: THEME.colors.background.tertiary }, children: _jsxs("tr", { children: [_jsx("td", { colSpan: 3, className: "px-4 py-3 text-right font-semibold", style: { color: THEME.colors.text.primary }, children: "Total:" }), _jsxs("td", { className: "px-4 py-3 text-right font-bold text-lg", style: { color: THEME.colors.text.primary }, children: ["$", total.toFixed(2)] })] }) })] }) })] }), order.notes && (_jsxs("div", { children: [_jsx("h3", { className: "font-semibold mb-2", style: { color: THEME.colors.text.primary }, children: "Notes" }), _jsx("div", { className: "rounded-lg p-4", style: {
                                backgroundColor: "rgba(245, 158, 11, 0.1)",
                                borderWidth: "1px",
                                borderColor: "rgba(245, 158, 11, 0.3)",
                            }, children: _jsx("p", { className: "text-sm", style: { color: THEME.colors.text.primary }, children: order.notes }) })] }))] }) }));
};
