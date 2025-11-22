import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { MapPin, Navigation } from "lucide-react";
import { SearchBar } from "../../common/SearchBar";
import { TrackingTable } from "./TrackingTable";
import { THEME } from "../../../constants/theme";
import { ordersApi } from "../../../services/apiservice";
export const CustomerTracking = () => {
    const [trackingData, setTrackingData] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        fetchTrackingData();
        // Refresh every 10 seconds for real-time updates
        const interval = setInterval(fetchTrackingData, 10000);
        return () => clearInterval(interval);
    }, []);
    const fetchTrackingData = async () => {
        try {
            const response = await ordersApi.getAll();
            if (response.success) {
                // Transform orders to tracking data
                const tracking = response.data
                    .filter((order) => ['received', 'preparing', 'ready'].includes(order.orderStatus))
                    .map((order) => ({
                    orderId: order.id,
                    orderNumber: order.id,
                    customerName: order.guestInfo?.name || order.userId || 'Customer',
                    status: order.orderStatus === 'ready' ? 'out_for_delivery' : order.orderStatus,
                    estimatedDelivery: order.createdAt,
                    location: order.deliveryAddress?.coordinates || undefined,
                    driver: order.assignedDriver || 'Unassigned'
                }));
                setTrackingData(tracking);
            }
        }
        catch (err) {
            console.error('Error fetching tracking data:', err);
        }
        finally {
            setLoading(false);
        }
    };
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTracking, setSelectedTracking] = useState(null);
    const [filterStatus, setFilterStatus] = useState("all");
    const handleViewLocation = (tracking) => {
        setSelectedTracking(tracking);
    };
    const filteredTracking = trackingData.filter((tracking) => {
        const matchesSearch = tracking.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tracking.customerName.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === "all" || tracking.status === filterStatus;
        return matchesSearch && matchesStatus;
    });
    // Calculate stats
    const stats = {
        preparing: trackingData.filter((t) => t.status === "preparing").length,
        outForDelivery: trackingData.filter((t) => t.status === "out_for_delivery")
            .length,
        delivered: trackingData.filter((t) => t.status === "delivered").length,
    };
    return (_jsxs("div", { className: "flex flex-col h-full space-y-4", children: [_jsxs("div", { className: "flex-shrink-0", children: [_jsx("h2", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: "Customer Tracking" }), _jsx("p", { className: "mt-1", style: { color: THEME.colors.text.secondary }, children: "Real-time order tracking and delivery management" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0", children: [_jsx("div", { className: "p-4 rounded-2xl border", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "p-3 rounded-lg", style: { backgroundColor: "rgba(245, 158, 11, 0.1)" }, children: _jsx(Navigation, { className: "w-6 h-6", style: { color: "#f59e0b" } }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: stats.preparing }), _jsx("p", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: "Preparing" })] })] }) }), _jsx("div", { className: "p-4 rounded-2xl border", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "p-3 rounded-lg", style: { backgroundColor: "rgba(59, 130, 246, 0.1)" }, children: _jsx(MapPin, { className: "w-6 h-6", style: { color: "#3b82f6" } }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: stats.outForDelivery }), _jsx("p", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: "Out for Delivery" })] })] }) }), _jsx("div", { className: "p-4 rounded-2xl border", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: _jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "p-3 rounded-lg", style: { backgroundColor: "rgba(16, 185, 129, 0.1)" }, children: _jsx(MapPin, { className: "w-6 h-6", style: { color: "#10b981" } }) }), _jsxs("div", { children: [_jsx("p", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: stats.delivered }), _jsx("p", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: "Delivered" })] })] }) })] }), _jsx("div", { className: "p-4 rounded-2xl border flex-shrink-0", style: {
                    backgroundColor: THEME.colors.background.secondary,
                    borderColor: THEME.colors.border.DEFAULT,
                }, children: _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4", children: [_jsx(SearchBar, { placeholder: "Search orders...", value: searchQuery, onChange: setSearchQuery }), _jsxs("select", { value: filterStatus, onChange: (e) => setFilterStatus(e.target.value), className: "w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all", style: {
                                backgroundColor: THEME.colors.background.tertiary,
                                color: THEME.colors.text.primary,
                                borderWidth: "1px",
                                borderColor: THEME.colors.border.DEFAULT,
                            }, children: [_jsx("option", { value: "all", children: "All Status" }), _jsx("option", { value: "preparing", children: "Preparing" }), _jsx("option", { value: "out_for_delivery", children: "Out for Delivery" }), _jsx("option", { value: "delivered", children: "Delivered" })] })] }) }), _jsx("div", { className: "rounded-2xl border overflow-hidden flex-1 flex flex-col", style: {
                    backgroundColor: THEME.colors.background.secondary,
                    borderColor: THEME.colors.border.DEFAULT,
                }, children: _jsx(TrackingTable, { trackingData: filteredTracking, onViewLocation: handleViewLocation }) })] }));
};
