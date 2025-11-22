import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { DollarSign, ShoppingBag, Users, TrendingUp, Clock, CheckCircle, Star, Package, } from "lucide-react";
import { THEME } from "../../../constants/theme";
import { dashboardApi, ordersApi, reportsApi } from "../../../services/apiservice";
export const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [recentOrders, setRecentOrders] = useState([]);
    const [topItems, setTopItems] = useState([]);
    useEffect(() => {
        fetchDashboardData();
    }, []);
    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsResponse, ordersResponse, topItemsResponse] = await Promise.all([
                dashboardApi.getStats(),
                ordersApi.getAll(),
                reportsApi.getPopularItems({ limit: 5 })
            ]);
            console.log('Dashboard Stats Response:', statsResponse);
            console.log('Orders Response:', ordersResponse);
            console.log('Top Items Response:', topItemsResponse);
            if (statsResponse.success) {
                console.log('Setting stats:', statsResponse.data);
                setStats(statsResponse.data);
            }
            if (ordersResponse.success && ordersResponse.data) {
                // Get 5 most recent orders
                const recent = ordersResponse.data.slice(0, 5);
                setRecentOrders(recent);
            }
            if (topItemsResponse.success && topItemsResponse.data) {
                setTopItems(topItemsResponse.data.slice(0, 5));
            }
        }
        catch (err) {
            console.error('Error fetching dashboard data:', err);
            setError(err.message || 'Failed to load dashboard data');
            setStats({
                total_users: 0,
                total_orders: 0,
                total_menu_items: 0,
                total_revenue: 0,
                today_orders: 0,
                today_revenue: 0,
                pending_orders: 0,
                active_customers: 0,
                avg_order_value: 0
            });
            setRecentOrders([]);
            setTopItems([]);
        }
        finally {
            setLoading(false);
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-64", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4" }), _jsx("p", { style: { color: THEME.colors.text.tertiary }, children: "Loading dashboard..." })] }) }));
    }
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "rounded-3xl p-8 backdrop-blur-md border relative overflow-hidden", style: {
                    background: "linear-gradient(135deg, rgba(139, 69, 19, 0.15) 0%, rgba(139, 69, 19, 0.05) 100%)",
                    borderColor: THEME.colors.border.DEFAULT,
                }, children: [_jsxs("div", { className: "flex items-center gap-4 mb-6", children: [_jsx("div", { className: "w-12 h-12 rounded-2xl flex items-center justify-center", style: { backgroundColor: THEME.colors.background.tertiary }, children: _jsx(DollarSign, { className: "w-6 h-6", style: { color: THEME.colors.text.primary } }) }), _jsxs("div", { children: [_jsx("p", { className: "text-xs", style: { color: THEME.colors.text.tertiary }, children: "Total Revenue (This Month)" }), _jsxs("h1", { className: "text-5xl font-bold", style: { color: THEME.colors.text.primary }, children: ["$", stats?.total_revenue?.toLocaleString() || '0', _jsx("span", { className: "text-2xl", children: ".00" })] })] })] }), _jsxs("div", { className: "flex flex-wrap gap-3 mb-6", children: [_jsxs("div", { className: "flex items-center gap-2 px-4 py-2 rounded-full", style: { backgroundColor: "rgba(16, 185, 129, 0.2)" }, children: [_jsx(CheckCircle, { className: "w-4 h-4", style: { color: "#10b981" } }), _jsx("span", { className: "text-sm font-medium", style: { color: THEME.colors.text.primary }, children: stats?.completed_orders || 0 }), _jsx("span", { className: "text-xs", style: { color: THEME.colors.text.tertiary }, children: "Completed" })] }), _jsxs("div", { className: "flex items-center gap-2 px-4 py-2 rounded-full", style: { backgroundColor: "rgba(245, 158, 11, 0.2)" }, children: [_jsx(Clock, { className: "w-4 h-4", style: { color: "#f59e0b" } }), _jsx("span", { className: "text-sm font-medium", style: { color: THEME.colors.text.primary }, children: stats?.preparing_orders || 0 }), _jsx("span", { className: "text-xs", style: { color: THEME.colors.text.tertiary }, children: "Preparing" })] }), _jsxs("div", { className: "flex items-center gap-2 px-4 py-2 rounded-full border-2 border-dashed", style: {
                                    backgroundColor: "rgba(156, 163, 175, 0.1)",
                                    borderColor: THEME.colors.border.light,
                                }, children: [_jsx("span", { className: "text-sm font-medium", style: { color: THEME.colors.text.primary }, children: stats?.pending_orders || 0 }), _jsx("span", { className: "text-xs", style: { color: THEME.colors.text.tertiary }, children: "Pending" })] })] }), _jsxs("div", { className: "flex flex-wrap gap-6 text-sm", children: [_jsxs("div", { children: [_jsxs("span", { style: { color: THEME.colors.text.tertiary }, children: ["Total Orders:", " "] }), _jsx("span", { style: { color: THEME.colors.text.primary }, className: "font-medium", children: stats?.total_orders || 0 })] }), _jsxs("div", { children: [_jsx("span", { style: { color: THEME.colors.text.tertiary }, children: "Today: " }), _jsxs("span", { style: { color: THEME.colors.text.primary }, className: "font-medium", children: [stats?.today_orders || 0, " orders ($", (stats?.today_revenue || 0).toFixed(2), ")"] })] }), _jsxs("div", { children: [_jsxs("span", { style: { color: THEME.colors.text.tertiary }, children: ["Menu Items:", " "] }), _jsx("span", { style: { color: THEME.colors.text.primary }, className: "font-medium", children: stats?.total_menu_items || 0 })] }), _jsxs("div", { children: [_jsxs("span", { style: { color: THEME.colors.text.tertiary }, children: ["Total Users:", " "] }), _jsx("span", { style: { color: THEME.colors.text.primary }, className: "font-medium", children: stats?.total_users || 0 })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsxs("div", { className: "p-6 rounded-2xl backdrop-blur-sm border", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: "w-10 h-10 rounded-xl flex items-center justify-center", style: { backgroundColor: "rgba(16, 185, 129, 0.1)" }, children: _jsx(ShoppingBag, { className: "w-5 h-5", style: { color: "#10b981" } }) }), _jsx("span", { className: "text-xs px-2 py-1 rounded-full", style: {
                                            backgroundColor: "rgba(16, 185, 129, 0.1)",
                                            color: "#10b981",
                                        }, children: "+12%" })] }), _jsx("p", { className: "text-2xl font-bold mb-1", style: { color: THEME.colors.text.primary }, children: stats?.total_orders?.toLocaleString() || '0' }), _jsx("p", { className: "text-xs", style: { color: THEME.colors.text.tertiary }, children: "Total Orders" })] }), _jsxs("div", { className: "p-6 rounded-2xl backdrop-blur-sm border", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: "w-10 h-10 rounded-xl flex items-center justify-center", style: { backgroundColor: "rgba(59, 130, 246, 0.1)" }, children: _jsx(Users, { className: "w-5 h-5", style: { color: "#3b82f6" } }) }), _jsx("span", { className: "text-xs px-2 py-1 rounded-full", style: {
                                            backgroundColor: "rgba(59, 130, 246, 0.1)",
                                            color: "#3b82f6",
                                        }, children: "+8%" })] }), _jsx("p", { className: "text-2xl font-bold mb-1", style: { color: THEME.colors.text.primary }, children: stats?.active_customers || stats?.total_users || '0' }), _jsx("p", { className: "text-xs", style: { color: THEME.colors.text.tertiary }, children: "Active Customers" })] }), _jsxs("div", { className: "p-6 rounded-2xl backdrop-blur-sm border", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: "w-10 h-10 rounded-xl flex items-center justify-center", style: { backgroundColor: "rgba(245, 158, 11, 0.1)" }, children: _jsx(TrendingUp, { className: "w-5 h-5", style: { color: "#f59e0b" } }) }), _jsx("span", { className: "text-xs px-2 py-1 rounded-full", style: {
                                            backgroundColor: "rgba(245, 158, 11, 0.1)",
                                            color: "#f59e0b",
                                        }, children: "+24%" })] }), _jsxs("p", { className: "text-2xl font-bold mb-1", style: { color: THEME.colors.text.primary }, children: ["$", stats?.avg_order_value?.toFixed(2) || '0.00'] }), _jsx("p", { className: "text-xs", style: { color: THEME.colors.text.tertiary }, children: "Avg Order Value" })] }), _jsxs("div", { className: "p-6 rounded-2xl backdrop-blur-sm border", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: [_jsxs("div", { className: "flex items-center justify-between mb-4", children: [_jsx("div", { className: "w-10 h-10 rounded-xl flex items-center justify-center", style: { backgroundColor: "rgba(239, 68, 68, 0.1)" }, children: _jsx(Clock, { className: "w-5 h-5", style: { color: "#ef4444" } }) }), _jsx("span", { className: "text-xs px-2 py-1 rounded-full", style: {
                                            backgroundColor: "rgba(239, 68, 68, 0.1)",
                                            color: "#ef4444",
                                        }, children: "12" })] }), _jsx("p", { className: "text-2xl font-bold mb-1", style: { color: THEME.colors.text.primary }, children: stats?.pending_orders || '0' }), _jsx("p", { className: "text-xs", style: { color: THEME.colors.text.tertiary }, children: "Pending Orders" })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-6", children: [_jsxs("div", { className: "p-6 rounded-2xl backdrop-blur-sm border", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: [_jsx("h3", { className: "text-lg font-semibold mb-6", style: { color: THEME.colors.text.primary }, children: "Recent Activity" }), _jsx("div", { className: "space-y-4", children: recentOrders.length > 0 ? recentOrders.map((order, index) => {
                                    const statusColors = {
                                        pending: "#f59e0b",
                                        confirmed: "#3b82f6",
                                        preparing: "#8b5cf6",
                                        ready: "#10b981",
                                        delivering: "#06b6d4",
                                        completed: "#10b981",
                                        cancelled: "#ef4444"
                                    };
                                    const color = statusColors[order.orderStatus] || "#6b7280";
                                    return (_jsxs("div", { className: "flex items-center gap-4", children: [_jsx("div", { className: "w-2 h-2 rounded-full flex-shrink-0", style: { backgroundColor: color } }), _jsxs("div", { className: "flex-1", children: [_jsxs("p", { className: "text-sm", style: { color: THEME.colors.text.primary }, children: ["Order ", order.id, " - ", order.fullName, " ($", parseFloat(order.totalFee || 0).toFixed(2), ")"] }), _jsxs("p", { className: "text-xs", style: { color: THEME.colors.text.tertiary }, children: [order.orderStatus, " \u2022 ", order.orderType] })] })] }, index));
                                }) : (_jsx("p", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: "No recent orders" })) })] }), _jsxs("div", { className: "p-6 rounded-2xl backdrop-blur-sm border", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: [_jsx("h3", { className: "text-lg font-semibold mb-6", style: { color: THEME.colors.text.primary }, children: "Top Selling Items" }), _jsx("div", { className: "space-y-4", children: topItems.length > 0 ? topItems.map((item, index) => (_jsxs("div", { className: "flex items-center justify-between p-3 rounded-xl", style: { backgroundColor: THEME.colors.background.tertiary }, children: [_jsxs("div", { className: "flex items-center gap-3", children: [_jsx("div", { className: "w-8 h-8 rounded-lg flex items-center justify-center", style: {
                                                        backgroundColor: `rgba(${index === 0
                                                            ? "16, 185, 129"
                                                            : index === 1
                                                                ? "59, 130, 246"
                                                                : "245, 158, 11"}, 0.1)`,
                                                    }, children: _jsx(Package, { className: "w-4 h-4", style: {
                                                            color: index === 0
                                                                ? "#10b981"
                                                                : index === 1
                                                                    ? "#3b82f6"
                                                                    : "#f59e0b",
                                                        } }) }), _jsxs("div", { children: [_jsx("p", { className: "text-sm font-medium", style: { color: THEME.colors.text.primary }, children: item.name }), _jsxs("p", { className: "text-xs", style: { color: THEME.colors.text.tertiary }, children: [item.count, " orders"] })] })] }), _jsxs("p", { className: "text-sm font-bold", style: { color: THEME.colors.text.primary }, children: ["$", (item.revenue || 0).toFixed(2)] })] }, index))) : (_jsx("p", { className: "text-sm", style: { color: THEME.colors.text.tertiary }, children: "No sales data available" })) })] })] }), _jsxs("div", { className: "p-6 rounded-2xl backdrop-blur-sm border", style: {
                    backgroundColor: THEME.colors.background.secondary,
                    borderColor: THEME.colors.border.DEFAULT,
                }, children: [_jsx("h3", { className: "text-lg font-semibold mb-6", style: { color: THEME.colors.text.primary }, children: "Performance Summary" }), _jsxs("div", { className: "grid grid-cols-2 md:grid-cols-4 gap-6", children: [_jsxs("div", { children: [_jsx("p", { className: "text-xs mb-2", style: { color: THEME.colors.text.tertiary }, children: "Customer Satisfaction" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Star, { className: "w-5 h-5", style: { color: "#f59e0b" } }), _jsx("p", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: "4.8" })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs mb-2", style: { color: THEME.colors.text.tertiary }, children: "Avg Delivery Time" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Clock, { className: "w-5 h-5", style: { color: "#3b82f6" } }), _jsx("p", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: "28m" })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs mb-2", style: { color: THEME.colors.text.tertiary }, children: "Order Completion" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(CheckCircle, { className: "w-5 h-5", style: { color: "#10b981" } }), _jsx("p", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: "96%" })] })] }), _jsxs("div", { children: [_jsx("p", { className: "text-xs mb-2", style: { color: THEME.colors.text.tertiary }, children: "Repeat Customers" }), _jsxs("div", { className: "flex items-center gap-2", children: [_jsx(Users, { className: "w-5 h-5", style: { color: "#8b5cf6" } }), _jsx("p", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: "68%" })] })] })] })] })] }));
};
