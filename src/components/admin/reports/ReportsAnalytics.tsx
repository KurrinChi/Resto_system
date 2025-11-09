import React, { useState, useEffect } from "react";
import {
  Download,
  TrendingUp,
  DollarSign,
  ShoppingBag,
  Users,
} from "lucide-react";
import { Button } from "../../common/Button";
import { ReportFilters } from "./ReportFilters.tsx";
import { RevenueChart } from "./charts/RevenueChart.tsx";
import { OrdersDonutChart } from "./charts/OrdersDonutChart.tsx";
import { TopItemsChart } from "./charts/TopItemsChart.tsx";
import { CustomerGrowthChart } from "./charts/CustomerGrowthChart.tsx";
import { exportSingleSheetReport } from "../../../utils/exportUtils";
import { THEME } from "../../../constants/theme";

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
  // loading state removed for demo/static data

  const stats: AnalyticsStats = {
    totalRevenue: 45678.9,
    totalOrders: 1234,
    totalCustomers: 567,
    averageOrder: 37.02,
    revenueGrowth: 12.5,
    orderGrowth: 8.3,
  };

  const revenueData = [
    { date: "Oct 17", revenue: 4200 },
    { date: "Oct 18", revenue: 3800 },
    { date: "Oct 19", revenue: 5100 },
    { date: "Oct 20", revenue: 4600 },
    { date: "Oct 21", revenue: 5400 },
    { date: "Oct 22", revenue: 6200 },
    { date: "Oct 23", revenue: 5800 },
  ];

  const ordersStatusData = [
    { name: "Pending", value: 120 },
    { name: "Preparing", value: 280 },
    { name: "Ready", value: 180 },
    { name: "Delivered", value: 520 },
    { name: "Cancelled", value: 45 },
  ];

  const topItemsData = [
    { name: "Classic Burger", sales: 245 },
    { name: "Margherita Pizza", sales: 189 },
    { name: "Grilled Salmon", sales: 167 },
    { name: "Caesar Salad", sales: 134 },
    { name: "Pasta Carbonara", sales: 98 },
  ];

  const customerGrowthData = [
    { month: "Apr", customers: 320 },
    { month: "May", customers: 380 },
    { month: "Jun", customers: 420 },
    { month: "Jul", customers: 450 },
    { month: "Aug", customers: 490 },
    { month: "Sep", customers: 530 },
    { month: "Oct", customers: 567 },
  ];

  const categorySales: CategorySales[] = [
    { category: "Burgers", orders: 345, revenue: 4481.55, growth: 15.3 },
    { category: "Pizza", orders: 289, revenue: 4332.11, growth: 12.8 },
    { category: "Pasta", orders: 201, revenue: 2811.99, growth: 8.2 },
  ];

  useEffect(() => {
    fetchAnalyticsData();
  }, [dateRange, reportType]);

  const fetchAnalyticsData = async () => {
    try {
      // TODO: Replace with actual API calls
      // const response = await fetch(`/api/analytics?start=${dateRange.start}&end=${dateRange.end}&type=${reportType}`);
      // const data = await response.json();
      // setStats(data.stats);
      // setRevenueData(data.revenueData);
      // setOrdersStatusData(data.ordersStatusData);
      // setTopItemsData(data.topItemsData);
      // setCustomerGrowthData(data.customerGrowthData);
      // setCategorySales(data.categorySales);

      await new Promise((resolve) => setTimeout(resolve, 500));
    } catch (error) {
      console.error("Error fetching analytics:", error);
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
              <RevenueChart data={revenueData} />
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
              <OrdersDonutChart data={ordersStatusData} />
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
              <TopItemsChart data={topItemsData} />
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
              <CustomerGrowthChart data={customerGrowthData} />
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
                    $
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
