import React, { useState, useEffect } from "react";
import {
  Download,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
} from "lucide-react";
import { Button } from "../../common/Button";
import { ReportFilters } from "./ReportFilters";
import { RevenueChart } from "./charts/RevenueChart";
import { OrdersDonutChart } from "./charts/OrdersDonutChart";
import { TopItemsChart } from "./charts/TopItemsChart";
import { CustomerGrowthChart } from "./charts/CustomerGrowthChart";
import { exportSingleSheetReport } from "../../../utils/exportUtils";
import { THEME } from "../../../constants/theme";
import { reportsApi, dashboardApi } from "../../../services/apiservice";

interface AnalyticsStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrder: number;
  revenueGrowth: number;
  orderGrowth: number;
}

interface CategorySales {
  category: string;
  orders: number;
  revenue: number;
  growth: number;
}

export const ReportsAnalytics: React.FC = () => {
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [reportType, setReportType] = useState("sales");
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState<AnalyticsStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalCustomers: 0,
    averageOrder: 0,
    revenueGrowth: 0,
    orderGrowth: 0,
  });

  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [ordersStatusData, setOrdersStatusData] = useState<any[]>([]);
  const [topItemsData, setTopItemsData] = useState<any[]>([]);
  const [customerGrowthData, setCustomerGrowthData] = useState<any[]>([]);
  const [categorySales, setCategorySales] = useState<CategorySales[]>([]);

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

      if (dashboardResponse.success) {
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
          { name: "Received", value: data.pending_orders || 0 },
          { name: "Preparing", value: data.preparing_orders || 0 },
          { name: "Ready", value: data.ready_orders || 0 },
          { name: "Completed", value: data.completed_orders || 0 },
        ].filter(item => item.value > 0);
        
        console.log('Orders Status Data:', statusData);
        setOrdersStatusData(statusData);
      }

      // Set popular items data
      if (popularItemsResponse.success && popularItemsResponse.data && popularItemsResponse.data.length > 0) {
        const items = popularItemsResponse.data.map((item: any) => ({
          name: item.name || 'Unknown',
          sales: item.count || 0
        }));
        console.log('Top Items Data:', items);
        setTopItemsData(items);
      } else {
        console.log('No popular items data');
        setTopItemsData([]);
      }

      // Set revenue trend data
      if (revenueTrendResponse.success && revenueTrendResponse.data && revenueTrendResponse.data.length > 0) {
        const trendData = revenueTrendResponse.data.map((item: any) => ({
          date: item.date,
          revenue: parseFloat(item.revenue) || 0
        }));
        console.log('Revenue Trend Data:', trendData);
        setRevenueData(trendData);
      } else {
        console.log('No revenue trend data');
        setRevenueData([]);
      }

      // Set category sales data
      if (categorySalesResponse.success && categorySalesResponse.data && categorySalesResponse.data.length > 0) {
        console.log('Category Sales Data:', categorySalesResponse.data);
        setCategorySales(categorySalesResponse.data);
      } else {
        console.log('No category sales data');
        setCategorySales([]);
      }
      
      setLoading(false);
    } catch (err: any) {
      console.error('Error fetching analytics data:', err);
      setLoading(false);
    }
  };

  const handleExportReport = () => {
    try {
      exportSingleSheetReport(
        stats,
        revenueData,
        ordersStatusData,
        topItemsData,
        customerGrowthData,
        categorySales,
        reportType,
        dateRange
      );

      setTimeout(() => {
        alert("Report exported successfully! Check your downloads folder.");
      }, 100);
    } catch (error) {
      console.error("Error exporting report:", error);
      alert("Error exporting report. Please try again.");
    }
  };

  return (
    <div className="space-y-4 h-full overflow-y-auto pb-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ color: THEME.colors.text.primary }}
          >
            Reports & Analytics
          </h2>
          <p className="mt-1" style={{ color: THEME.colors.text.secondary }}>
            Track your business performance and insights
          </p>
        </div>
        <Button
          onClick={handleExportReport}
          icon={<Download className="w-5 h-5" />}
        >
          Export Report
        </Button>
      </div>

      {/* Filters */}
      <div
        className="p-4 rounded-2xl border"
        style={{
          backgroundColor: THEME.colors.background.secondary,
          borderColor: THEME.colors.border.DEFAULT,
        }}
      >
        <ReportFilters
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          reportType={reportType}
          onReportTypeChange={setReportType}
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div
          className="p-4 rounded-2xl border"
          style={{
            backgroundColor: THEME.colors.background.secondary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm mb-1"
                style={{ color: THEME.colors.text.tertiary }}
              >
                Total Revenue
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: THEME.colors.text.primary }}
              >
                $
                {stats.totalRevenue.toLocaleString("en-US", {
                  minimumFractionDigits: 2,
                })}
              </p>
              <p
                className="text-xs mt-1 flex items-center gap-1"
                style={{ color: "#10b981" }}
              >
                <TrendingUp className="w-3 h-3" />+{stats.revenueGrowth}% from
                last period
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
            >
              <DollarSign className="w-6 h-6" style={{ color: "#3b82f6" }} />
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-2xl border"
          style={{
            backgroundColor: THEME.colors.background.secondary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm mb-1"
                style={{ color: THEME.colors.text.tertiary }}
              >
                Total Orders
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: THEME.colors.text.primary }}
              >
                {stats.totalOrders.toLocaleString()}
              </p>
              <p
                className="text-xs mt-1 flex items-center gap-1"
                style={{ color: "#10b981" }}
              >
                <TrendingUp className="w-3 h-3" />+{stats.orderGrowth}% from
                last period
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
            >
              <ShoppingBag className="w-6 h-6" style={{ color: "#10b981" }} />
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-2xl border"
          style={{
            backgroundColor: THEME.colors.background.secondary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm mb-1"
                style={{ color: THEME.colors.text.tertiary }}
              >
                Total Customers
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: THEME.colors.text.primary }}
              >
                {stats.totalCustomers.toLocaleString()}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: THEME.colors.text.muted }}
              >
                Active customers
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}
            >
              <Users className="w-6 h-6" style={{ color: "#8b5cf6" }} />
            </div>
          </div>
        </div>

        <div
          className="p-4 rounded-2xl border"
          style={{
            backgroundColor: THEME.colors.background.secondary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p
                className="text-sm mb-1"
                style={{ color: THEME.colors.text.tertiary }}
              >
                Average Order
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: THEME.colors.text.primary }}
              >
                ${stats.averageOrder.toFixed(2)}
              </p>
              <p
                className="text-xs mt-1"
                style={{ color: THEME.colors.text.muted }}
              >
                Per order value
              </p>
            </div>
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
            >
              <DollarSign className="w-6 h-6" style={{ color: "#f59e0b" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            backgroundColor: THEME.colors.background.secondary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <div
            className="px-6 py-4 border-b"
            style={{ borderColor: THEME.colors.border.DEFAULT }}
          >
            <h3
              className="text-lg font-semibold"
              style={{ color: THEME.colors.text.primary }}
            >
              Revenue Trend
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p style={{ color: THEME.colors.text.secondary }}>Loading...</p>
                </div>
              ) : revenueData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p style={{ color: THEME.colors.text.secondary }}>No revenue data available</p>
                </div>
              ) : (
                <RevenueChart data={revenueData} />
              )}
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            backgroundColor: THEME.colors.background.secondary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <div
            className="px-6 py-4 border-b"
            style={{ borderColor: THEME.colors.border.DEFAULT }}
          >
            <h3
              className="text-lg font-semibold"
              style={{ color: THEME.colors.text.primary }}
            >
              Orders by Status
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p style={{ color: THEME.colors.text.secondary }}>Loading...</p>
                </div>
              ) : ordersStatusData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p style={{ color: THEME.colors.text.secondary }}>No order data available</p>
                </div>
              ) : (
                <OrdersDonutChart data={ordersStatusData} />
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            backgroundColor: THEME.colors.background.secondary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <div
            className="px-6 py-4 border-b"
            style={{ borderColor: THEME.colors.border.DEFAULT }}
          >
            <h3
              className="text-lg font-semibold"
              style={{ color: THEME.colors.text.primary }}
            >
              Top Selling Items
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p style={{ color: THEME.colors.text.secondary }}>Loading...</p>
                </div>
              ) : topItemsData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p style={{ color: THEME.colors.text.secondary }}>No items data available</p>
                </div>
              ) : (
                <TopItemsChart data={topItemsData} />
              )}
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl border overflow-hidden"
          style={{
            backgroundColor: THEME.colors.background.secondary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <div
            className="px-6 py-4 border-b"
            style={{ borderColor: THEME.colors.border.DEFAULT }}
          >
            <h3
              className="text-lg font-semibold"
              style={{ color: THEME.colors.text.primary }}
            >
              Customer Growth
            </h3>
          </div>
          <div className="p-6">
            <div className="h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <p style={{ color: THEME.colors.text.secondary }}>Loading...</p>
                </div>
              ) : customerGrowthData.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p style={{ color: THEME.colors.text.secondary }}>No customer data available</p>
                </div>
              ) : (
                <CustomerGrowthChart data={customerGrowthData} />
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Sales by Category */}
      <div
        className="rounded-2xl border overflow-hidden"
        style={{
          backgroundColor: THEME.colors.background.secondary,
          borderColor: THEME.colors.border.DEFAULT,
        }}
      >
        <div
          className="px-6 py-4 border-b"
          style={{ borderColor: THEME.colors.border.DEFAULT }}
        >
          <h3
            className="text-lg font-semibold"
            style={{ color: THEME.colors.text.primary }}
          >
            Sales by Category
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead
              style={{
                backgroundColor: THEME.colors.background.tertiary,
                borderBottom: `1px solid ${THEME.colors.border.DEFAULT}`,
              }}
            >
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase"
                  style={{ color: THEME.colors.text.secondary }}
                >
                  Category
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase"
                  style={{ color: THEME.colors.text.secondary }}
                >
                  Orders
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase"
                  style={{ color: THEME.colors.text.secondary }}
                >
                  Revenue
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium uppercase"
                  style={{ color: THEME.colors.text.secondary }}
                >
                  Growth
                </th>
              </tr>
            </thead>
            <tbody
              className="divide-y"
              style={{ borderColor: THEME.colors.border.DEFAULT }}
            >
              {categorySales.map((item, index) => (
                <tr key={index}>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                    style={{ color: THEME.colors.text.primary }}
                  >
                    {item.category}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm"
                    style={{ color: THEME.colors.text.primary }}
                  >
                    {item.orders}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm"
                    style={{ color: THEME.colors.text.primary }}
                  >
                    ₱
                    {item.revenue.toLocaleString("en-US", {
                      minimumFractionDigits: 2,
                    })}
                  </td>
                  <td
                    className="px-6 py-4 whitespace-nowrap text-sm"
                    style={{ color: "#10b981" }}
                  >
                    +{item.growth}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
