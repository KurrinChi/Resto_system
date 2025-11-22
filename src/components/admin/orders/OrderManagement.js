import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "../../common/Button";
import { SearchBar } from "../../common/SearchBar";
import { Modal } from "../../common/Modal";
import { OrderTable } from "./OrderTable";
import { OrderModal } from "./OrderModal";
import { THEME } from "../../../constants/theme";
import { ordersApi } from "../../../services/apiservice";
import { exportToCSV } from "../../../utils/exportUtils";
export const OrderManagement = () => {
    // Order Management - Nov 22 Updated
    const [orders, setOrders] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const [filterPayment, setFilterPayment] = useState("all");
    const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchOrders();
    }, []);
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await ordersApi.getAll();
            if (response.success) {
                console.log('✅ API SUCCESS - Orders fetched:', response.data.length);
                console.log('✅ First order data:', response.data[0]);
                const ordersData = response.data.map((order) => ({
                    id: order.id,
                    orderNumber: order.id || `ORD-${order.id.slice(0, 8)}`,
                    customerId: order.userId || order.id,
                    customerName: order.fullName || 'Guest',
                    items: (order.orderList || []).map((item) => ({
                        menuItemId: item.id,
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        specialInstructions: item.notes
                    })),
                    status: order.orderStatus || 'pending',
                    total: order.totalFee || 0,
                    paymentStatus: order.paymentMethod === 'cod' ? 'pending' : 'paid',
                    orderDate: order.createdAt || order.dayKey,
                    deliveryAddress: order.address || '',
                    notes: order.orderList?.[0]?.notes || ''
                }));
                console.log('✅ Transformed Order:', ordersData[0]);
                setOrders(ordersData);
            }
        }
        catch (err) {
            console.error('Error fetching orders:', err);
        }
        finally {
            setLoading(false);
        }
    };
    const handleViewOrder = (order) => {
        setSelectedOrder(order);
        setIsModalOpen(true);
    };
    const handleUpdateOrderStatus = async (orderId, newStatus) => {
        try {
            const response = await ordersApi.updateStatus(orderId, newStatus);
            if (response.success) {
                setOrders(orders.map((order) => order.id === orderId ? { ...order, status: newStatus } : order));
            }
        }
        catch (err) {
            alert('Error updating order status: ' + err.message);
        }
    };
    const handleCancelOrder = (orderId) => {
        setOrderToCancel(orderId);
        setIsCancelConfirmOpen(true);
    };
    const handleConfirmCancel = async () => {
        if (orderToCancel) {
            try {
                // Update status to cancelled in Firebase
                const response = await ordersApi.updateStatus(orderToCancel, 'cancelled');
                if (response.success) {
                    // Update local state
                    setOrders(orders.map((order) => order.id === orderToCancel
                        ? {
                            ...order,
                            status: "cancelled",
                            paymentStatus: order.paymentStatus === "paid" ? "refunded" : order.paymentStatus,
                        }
                        : order));
                }
                else {
                    alert('Failed to cancel order');
                }
            }
            catch (err) {
                alert('Error cancelling order: ' + err.message);
            }
            finally {
                setIsCancelConfirmOpen(false);
                setOrderToCancel(null);
            }
        }
    };
    const handleCancelConfirm = () => {
        setIsCancelConfirmOpen(false);
        setOrderToCancel(null);
    };
    const handleExportOrders = () => {
        if (filteredOrders.length === 0) {
            alert('No orders to export');
            return;
        }
        const exportData = filteredOrders.map(order => ({
            'Order ID': order.id,
            'Customer Name': order.customerName,
            'Total Amount': `$${order.total.toFixed(2)}`,
            'Status': order.status,
            'Payment': order.paymentStatus,
            'Date': new Date(order.orderDate).toLocaleDateString(),
            'Items': order.items?.length || 0
        }));
        exportToCSV(exportData, 'orders');
    };
    const filteredOrders = orders.filter((order) => {
        const matchesSearch = order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "all" || order.status === filterStatus;
        const matchesPayment = filterPayment === "all" || order.paymentStatus === filterPayment;
        return matchesSearch && matchesStatus && matchesPayment;
    });
    // Calculate stats
    const stats = {
        total: orders.length,
        pending: orders.filter((o) => o.status === "pending").length,
        preparing: orders.filter((o) => o.status === "preparing").length,
        ready: orders.filter((o) => o.status === "ready").length,
        delivered: orders.filter((o) => o.status === "delivered").length,
    };
    return (_jsxs("div", { className: "flex flex-col h-full space-y-4", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: "Order Management" }), _jsx("p", { className: "mt-1", style: { color: THEME.colors.text.secondary }, children: "Track and manage customer orders" })] }), _jsx(Button, { onClick: handleExportOrders, icon: _jsx(Download, { className: "w-5 h-5" }), variant: "secondary", children: "Export Orders" })] }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-5 gap-4 flex-shrink-0", children: [_jsxs("div", { className: "p-4 rounded-2xl border text-center", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: [_jsx("p", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: stats.total }), _jsx("p", { className: "text-sm mt-1", style: { color: THEME.colors.text.tertiary }, children: "Total Orders" })] }), _jsxs("div", { className: "p-4 rounded-2xl border text-center", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: [_jsx("p", { className: "text-2xl font-bold", style: { color: "#f59e0b" }, children: stats.pending }), _jsx("p", { className: "text-sm mt-1", style: { color: THEME.colors.text.tertiary }, children: "Pending" })] }), _jsxs("div", { className: "p-4 rounded-2xl border text-center", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: [_jsx("p", { className: "text-2xl font-bold", style: { color: "#3b82f6" }, children: stats.preparing }), _jsx("p", { className: "text-sm mt-1", style: { color: THEME.colors.text.tertiary }, children: "Preparing" })] }), _jsxs("div", { className: "p-4 rounded-2xl border text-center", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: [_jsx("p", { className: "text-2xl font-bold", style: { color: "#8b5cf6" }, children: stats.ready }), _jsx("p", { className: "text-sm mt-1", style: { color: THEME.colors.text.tertiary }, children: "Ready" })] }), _jsxs("div", { className: "p-4 rounded-2xl border text-center", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: [_jsx("p", { className: "text-2xl font-bold", style: { color: "#10b981" }, children: stats.delivered }), _jsx("p", { className: "text-sm mt-1", style: { color: THEME.colors.text.tertiary }, children: "Delivered" })] })] }), _jsx("div", { className: "p-4 rounded-2xl border flex-shrink-0", style: {
                    backgroundColor: THEME.colors.background.secondary,
                    borderColor: THEME.colors.border.DEFAULT,
                }, children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-4 gap-4", children: [_jsx("div", { className: "md:col-span-2", children: _jsx(SearchBar, { placeholder: "Search orders...", value: searchQuery, onChange: setSearchQuery }) }), _jsx("div", { children: _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all", style: {
                                    backgroundColor: THEME.colors.background.tertiary,
                                    color: THEME.colors.text.primary,
                                    borderWidth: "1px",
                                    borderColor: THEME.colors.border.DEFAULT,
                                }, children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "pending", children: "Pending" }), _jsx("option", { value: "preparing", children: "Preparing" }), _jsx("option", { value: "ready", children: "Ready" }), _jsx("option", { value: "delivered", children: "Delivered" }), _jsx("option", { value: "cancelled", children: "Cancelled" })] }) }), _jsx("div", { children: _jsxs("select", { value: filterPayment, onChange: (e) => setFilterPayment(e.target.value), className: "w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all", style: {
                                    backgroundColor: THEME.colors.background.tertiary,
                                    color: THEME.colors.text.primary,
                                    borderWidth: "1px",
                                    borderColor: THEME.colors.border.DEFAULT,
                                }, children: [_jsx("option", { value: "all", children: "All Payments" }), _jsx("option", { value: "paid", children: "Paid" }), _jsx("option", { value: "pending", children: "Pending" }), _jsx("option", { value: "refunded", children: "Refunded" })] }) })] }) }), _jsx("div", { className: "rounded-2xl border overflow-hidden flex-1 flex flex-col", style: {
                    backgroundColor: THEME.colors.background.secondary,
                    borderColor: THEME.colors.border.DEFAULT,
                }, children: _jsx(OrderTable, { orders: filteredOrders, onView: handleViewOrder, onUpdateStatus: handleUpdateOrderStatus, onCancelOrder: handleCancelOrder }) }), _jsx(OrderModal, { isOpen: isModalOpen, onClose: () => setIsModalOpen(false), order: selectedOrder }), _jsx(Modal, { isOpen: isCancelConfirmOpen, onClose: handleCancelConfirm, title: "Cancel Order", maxWidth: "sm", footer: _jsxs("div", { className: "flex items-center gap-3 justify-end", children: [_jsx(Button, { onClick: handleCancelConfirm, variant: "secondary", children: "Keep Order" }), _jsx(Button, { onClick: handleConfirmCancel, variant: "danger", children: "Cancel Order" })] }), children: _jsxs("div", { className: "p-6", children: [_jsx("p", { style: { color: THEME.colors.text.primary }, className: "mb-4", children: "Are you sure you want to cancel this order?" }), _jsx("p", { style: { color: THEME.colors.text.secondary }, className: "text-sm", children: orderToCancel && orders.find((o) => o.id === orderToCancel)?.orderNumber && (_jsxs(_Fragment, { children: ["Order ", _jsx("strong", { children: orders.find((o) => o.id === orderToCancel)?.orderNumber }), " will be cancelled", orders.find((o) => o.id === orderToCancel)?.paymentStatus === "paid" && (_jsx(_Fragment, { children: " and refunded" })), "."] })) })] }) })] }));
};
