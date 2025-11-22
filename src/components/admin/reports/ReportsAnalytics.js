import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Download, TrendingUp, DollarSign, ShoppingBag, Users, } from "lucide-react";
import { Button } from "../../common/Button";
import { ReportFilters } from "./ReportFilters";
import { RevenueChart } from "./charts/RevenueChart";
import { OrdersDonutChart } from "./charts/OrdersDonutChart";
import { TopItemsChart } from "./charts/TopItemsChart";
import { CustomerGrowthChart } from "./charts/CustomerGrowthChart";
import { exportSingleSheetReport } from "../../../utils/exportUtils";
import { THEME } from "../../../constants/theme";
import { reportsApi, dashboardApi } from "../../../services/apiservice";
export const ReportsAnalytics = () => {
    const [dateRange, setDateRange] = useState({ start: "", end: "" });
    const [reportType, setReportType] = useState("sales");
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalRevenue: 0,
        totalOrders: 0,
        totalCustomers: 0,
        averageOrder: 0,
        revenueGrowth: 0,
        orderGrowth: 0,
    });
    const [revenueData, setRevenueData] = useState([]);
    const [ordersStatusData, setOrdersStatusData] = useState([]);
    const [topItemsData, setTopItemsData] = useState([]);
    const [customerGrowthData, setCustomerGrowthData] = useState([]);
    const [categorySales, setCategorySales] = useState([]);
    useEffect(() => {
        fetchAnalyticsData();
    }, [dateRange, reportType]);
    const fetchAnalyticsData = async () => {
        try {
            setLoading(true);
            // Fetch dashboard stats, popular items, revenue trend, and category sales
            const [dashboardResponse, popularItemsResponse, revenueTrendResponse, categorySalesResponse] = await Promise.all([
                dashboardApi.getStats(),
                reportsApi.getPopularItems({ limit: 5 }),
                reportsApi.getRevenueTrend({ days: 30 }),
                reportsApi.getCategorySales()
            ]);
            console.log('Dashboard Response:', dashboardResponse);
            console.log('Popular Items Response:', popularItemsResponse);
            console.log('Revenue Trend Response:', revenueTrendResponse);
            console.log('Category Sales Response:', categorySalesResponse);
            if (dashboardResponse.success && dashboardResponse.data) {
                const data = dashboardResponse.data;
                // Update stats
                setStats({
                    totalRevenue: data.total_revenue || 0,
                    totalOrders: data.total_orders || 0,
                    totalCustomers: data.total_users || 0,
                    averageOrder: data.avg_order_value || 0,
                    revenueGrowth: 0,
                    orderGrowth: 0,
                });
                // Set orders status data - filter out zero values
                const statusData = [
                    { name: "Pending", value: data.pending_orders || 0 },
                    { name: "Preparing", value: data.preparing_orders || 0 },
                    { name: "Ready", value: data.ready_orders || 0 },
                    { name: "Completed", value: data.completed_orders || 0 },
                ].filter(item => item.value > 0);
                console.log('Orders Status Data:', statusData);
                setOrdersStatusData(statusData);
            }
            // Set popular items data
            if (popularItemsResponse.success && popularItemsResponse.data && popularItemsResponse.data.length > 0) {
                const items = popularItemsResponse.data.map((item) => ({
                    name: item.name || 'Unknown',
                    sales: item.count || 0
                }));
                console.log('Top Items Data:', items);
                setTopItemsData(items);
            }
            else {
                console.log('No popular items data');
                setTopItemsData([]);
            }
            // Set revenue trend data
            if (revenueTrendResponse.success && revenueTrendResponse.data && revenueTrendResponse.data.length > 0) {
                const trendData = revenueTrendResponse.data.map((item) => ({
                    date: item.date,
                    revenue: parseFloat(item.revenue) || 0
                }));
                console.log('Revenue Trend Data:', trendData);
                setRevenueData(trendData);
            }
            else {
                console.log('No revenue trend data');
                setRevenueData([]);
            }
            // Set category sales data
            if (categorySalesResponse.success && categorySalesResponse.data && categorySalesResponse.data.length > 0) {
                console.log('Category Sales Data:', categorySalesResponse.data);
                setCategorySales(categorySalesResponse.data);
            }
            else {
                console.log('No category sales data');
                setCategorySales([]);
            }
        }
        catch (err) {
            console.error('Error fetching analytics data:', err);
            // Set empty data instead of leaving state undefined
            setStats({
                totalRevenue: 0,
                totalOrders: 0,
                totalCustomers: 0,
                averageOrder: 0,
                revenueGrowth: 0,
                orderGrowth: 0,
            });
            setOrdersStatusData([]);
            setTopItemsData([]);
            setRevenueData([]);
            setCategorySales([]);
        }
        finally {
            setLoading(false);
        }
    };
    const handleExportReport = () => {
        try {
            exportSingleSheetReport(stats, revenueData, ordersStatusData, topItemsData, customerGrowthData, categorySales, reportType, dateRange);
            setTimeout(() => {
                alert("Report exported successfully! Check your downloads folder.");
            }, 100);
        }
        catch (error) {
            console.error("Error exporting report:", error);
            alert("Error exporting report. Please try again.");
        }
    };
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4" }), _jsx("p", { style: { color: THEME.colors.text.secondary }, children: "Loading analytics data..." })] }) }));
    }
    return (_jsxs("div", { className: "space-y-4 h-full overflow-y-auto pb-6", children: [_jsxs("div", { className: "flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: "Reports & Analytics" }), _jsx("p", { className: "mt-1", style: { color: THEME.colors.text.secondary }, children: "Track your business performance and insights" })] }), _jsx(Button, { onClick: handleExportReport, icon: _jsx(Download, { className: "w-5 h-5" }), children: "Export Report" })] }), _jsx("div", { className: "p-4 rounded-2xl border", style: {
                    backgroundColor: THEME.colors.background.secondary,
                    borderColor: THEME.colors.border.DEFAULT,
                }, children: _jsx(ReportFilters, { dateRange: dateRange, onDateRangeChange: setDateRange, reportType: reportType, onReportTypeChange: setReportType }) }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4", children: [_jsx("div", { className: "p-4 rounded-2xl border", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm mb-1", style: { color: THEME.colors.text.tertiary }, children: "Total Revenue" }), _jsxs("p", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: ["$", stats.totalRevenue.toLocaleString("en-US", {
                                                    minimumFractionDigits: 2,
                                                })] }), _jsxs("p", { className: "text-xs mt-1 flex items-center gap-1", style: { color: "#10b981" }, children: [_jsx(TrendingUp, { className: "w-3 h-3" }), "+", stats.revenueGrowth, "% from last period"] })] }), _jsx("div", { className: "p-3 rounded-lg", style: { backgroundColor: "rgba(59, 130, 246, 0.1)" }, children: _jsx(DollarSign, { className: "w-6 h-6", style: { color: "#3b82f6" } }) })] }) }), _jsx("div", { className: "p-4 rounded-2xl border", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm mb-1", style: { color: THEME.colors.text.tertiary }, children: "Total Orders" }), _jsx("p", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: stats.totalOrders.toLocaleString() }), _jsxs("p", { className: "text-xs mt-1 flex items-center gap-1", style: { color: "#10b981" }, children: [_jsx(TrendingUp, { className: "w-3 h-3" }), "+", stats.orderGrowth, "% from last period"] })] }), _jsx("div", { className: "p-3 rounded-lg", style: { backgroundColor: "rgba(16, 185, 129, 0.1)" }, children: _jsx(ShoppingBag, { className: "w-6 h-6", style: { color: "#10b981" } }) })] }) }), _jsx("div", { className: "p-4 rounded-2xl border", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm mb-1", style: { color: THEME.colors.text.tertiary }, children: "Total Customers" }), _jsx("p", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: stats.totalCustomers.toLocaleString() }), _jsx("p", { className: "text-xs mt-1", style: { color: THEME.colors.text.muted }, children: "Active customers" })] }), _jsx("div", { className: "p-3 rounded-lg", style: { backgroundColor: "rgba(139, 92, 246, 0.1)" }, children: _jsx(Users, { className: "w-6 h-6", style: { color: "#8b5cf6" } }) })] }) }), _jsx("div", { className: "p-4 rounded-2xl border", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsxs("div", { children: [_jsx("p", { className: "text-sm mb-1", style: { color: THEME.colors.text.tertiary }, children: "Average Order" }), _jsxs("p", { className: "text-2xl font-bold", style: { color: THEME.colors.text.primary }, children: ["$", stats.averageOrder.toFixed(2)] }), _jsx("p", { className: "text-xs mt-1", style: { color: THEME.colors.text.muted }, children: "Per order value" })] }), _jsx("div", { className: "p-3 rounded-lg", style: { backgroundColor: "rgba(245, 158, 11, 0.1)" }, children: _jsx(DollarSign, { className: "w-6 h-6", style: { color: "#f59e0b" } }) })] }) })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsxs("div", { className: "rounded-2xl border overflow-hidden", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: [_jsx("div", { className: "px-6 py-4 border-b", style: { borderColor: THEME.colors.border.DEFAULT }, children: _jsx("h3", { className: "text-lg font-semibold", style: { color: THEME.colors.text.primary }, children: "Revenue Trend" }) }), _jsx("div", { className: "p-6", children: _jsx("div", { className: "h-80", children: loading ? (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsx("p", { style: { color: THEME.colors.text.secondary }, children: "Loading..." }) })) : revenueData.length === 0 ? (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsx("p", { style: { color: THEME.colors.text.secondary }, children: "No revenue data available" }) })) : (_jsx(RevenueChart, { data: revenueData })) }) })] }), _jsxs("div", { className: "rounded-2xl border overflow-hidden", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: [_jsx("div", { className: "px-6 py-4 border-b", style: { borderColor: THEME.colors.border.DEFAULT }, children: _jsx("h3", { className: "text-lg font-semibold", style: { color: THEME.colors.text.primary }, children: "Orders by Status" }) }), _jsx("div", { className: "p-6", children: _jsx("div", { className: "h-80", children: loading ? (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsx("p", { style: { color: THEME.colors.text.secondary }, children: "Loading..." }) })) : ordersStatusData.length === 0 ? (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsx("p", { style: { color: THEME.colors.text.secondary }, children: "No order data available" }) })) : (_jsx(OrdersDonutChart, { data: ordersStatusData })) }) })] })] }), _jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsxs("div", { className: "rounded-2xl border overflow-hidden", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: [_jsx("div", { className: "px-6 py-4 border-b", style: { borderColor: THEME.colors.border.DEFAULT }, children: _jsx("h3", { className: "text-lg font-semibold", style: { color: THEME.colors.text.primary }, children: "Top Selling Items" }) }), _jsx("div", { className: "p-6", children: _jsx("div", { className: "h-80", children: loading ? (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsx("p", { style: { color: THEME.colors.text.secondary }, children: "Loading..." }) })) : topItemsData.length === 0 ? (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsx("p", { style: { color: THEME.colors.text.secondary }, children: "No items data available" }) })) : (_jsx(TopItemsChart, { data: topItemsData })) }) })] }), _jsxs("div", { className: "rounded-2xl border overflow-hidden", style: {
                            backgroundColor: THEME.colors.background.secondary,
                            borderColor: THEME.colors.border.DEFAULT,
                        }, children: [_jsx("div", { className: "px-6 py-4 border-b", style: { borderColor: THEME.colors.border.DEFAULT }, children: _jsx("h3", { className: "text-lg font-semibold", style: { color: THEME.colors.text.primary }, children: "Customer Growth" }) }), _jsx("div", { className: "p-6", children: _jsx("div", { className: "h-80", children: loading ? (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsx("p", { style: { color: THEME.colors.text.secondary }, children: "Loading..." }) })) : customerGrowthData.length === 0 ? (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsx("p", { style: { color: THEME.colors.text.secondary }, children: "No customer data available" }) })) : (_jsx(CustomerGrowthChart, { data: customerGrowthData })) }) })] })] }), _jsxs("div", { className: "rounded-2xl border overflow-hidden", style: {
                    backgroundColor: THEME.colors.background.secondary,
                    borderColor: THEME.colors.border.DEFAULT,
                }, children: [_jsx("div", { className: "px-6 py-4 border-b", style: { borderColor: THEME.colors.border.DEFAULT }, children: _jsx("h3", { className: "text-lg font-semibold", style: { color: THEME.colors.text.primary }, children: "Sales by Category" }) }), _jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { style: {
                                        backgroundColor: THEME.colors.background.tertiary,
                                        borderBottom: `1px solid ${THEME.colors.border.DEFAULT}`,
                                    }, children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase", style: { color: THEME.colors.text.secondary }, children: "Category" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase", style: { color: THEME.colors.text.secondary }, children: "Orders" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase", style: { color: THEME.colors.text.secondary }, children: "Revenue" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium uppercase", style: { color: THEME.colors.text.secondary }, children: "Growth" })] }) }), _jsx("tbody", { className: "divide-y", style: { borderColor: THEME.colors.border.DEFAULT }, children: categorySales.map((item, index) => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", style: { color: THEME.colors.text.primary }, children: item.category }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm", style: { color: THEME.colors.text.primary }, children: item.orders }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm", style: { color: THEME.colors.text.primary }, children: ["\u20B1", item.revenue.toLocaleString("en-US", {
                                                        minimumFractionDigits: 2,
                                                    })] }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm", style: { color: "#10b981" }, children: ["+", item.growth, "%"] })] }, index))) })] }) })] })] }));
};
