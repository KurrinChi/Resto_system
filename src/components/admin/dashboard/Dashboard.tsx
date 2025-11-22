import React, { useState, useEffect } from "react";
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  Star,
  Package,
} from "lucide-react";
import { THEME } from "../../../constants/theme";
import { dashboardApi, ordersApi, reportsApi } from "../../../services/apiservice";

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [topItems, setTopItems] = useState<any[]>([]);

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
    } catch (err: any) {
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
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p style={{ color: THEME.colors.text.tertiary }}>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Hero Section with Large Metrics */}
      <div
        className="rounded-3xl p-8 backdrop-blur-md border relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(139, 69, 19, 0.15) 0%, rgba(139, 69, 19, 0.05) 100%)",
          borderColor: THEME.colors.border.DEFAULT,
        }}
      >
        {/* Large Revenue Number */}
        <div className="flex items-center gap-4 mb-6">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center"
            style={{ backgroundColor: THEME.colors.background.tertiary }}
          >
            <DollarSign
              className="w-6 h-6"
              style={{ color: THEME.colors.text.primary }}
            />
          </div>
          <div>
            <p
              className="text-xs"
              style={{ color: THEME.colors.text.tertiary }}
            >
              Total Revenue (This Month)
            </p>
            <h1
              className="text-5xl font-bold"
              style={{ color: THEME.colors.text.primary }}
            >
              ${stats?.total_revenue?.toLocaleString() || '0'}<span className="text-2xl">.00</span>
            </h1>
          </div>
        </div>

        {/* Metrics Pills */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Completed */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ backgroundColor: "rgba(16, 185, 129, 0.2)" }}
          >
            <CheckCircle className="w-4 h-4" style={{ color: "#10b981" }} />
            <span
              className="text-sm font-medium"
              style={{ color: THEME.colors.text.primary }}
            >
              {stats?.completed_orders || 0}
            </span>
            <span
              className="text-xs"
              style={{ color: THEME.colors.text.tertiary }}
            >
              Completed
            </span>
          </div>

          {/* Preparing */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ backgroundColor: "rgba(245, 158, 11, 0.2)" }}
          >
            <Clock className="w-4 h-4" style={{ color: "#f59e0b" }} />
            <span
              className="text-sm font-medium"
              style={{ color: THEME.colors.text.primary }}
            >
              {stats?.preparing_orders || 0}
            </span>
            <span
              className="text-xs"
              style={{ color: THEME.colors.text.tertiary }}
            >
              Preparing
            </span>
          </div>

          {/* Pending */}
          <div
            className="flex items-center gap-2 px-4 py-2 rounded-full border-2 border-dashed"
            style={{
              backgroundColor: "rgba(156, 163, 175, 0.1)",
              borderColor: THEME.colors.border.light,
            }}
          >
            <span
              className="text-sm font-medium"
              style={{ color: THEME.colors.text.primary }}
            >
              {stats?.pending_orders || 0}
            </span>
            <span
              className="text-xs"
              style={{ color: THEME.colors.text.tertiary }}
            >
              Pending
            </span>
          </div>
        </div>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-6 text-sm">
          <div>
            <span style={{ color: THEME.colors.text.tertiary }}>
              Total Orders:{" "}
            </span>
            <span
              style={{ color: THEME.colors.text.primary }}
              className="font-medium"
            >
              {stats?.total_orders || 0}
            </span>
          </div>
          <div>
            <span style={{ color: THEME.colors.text.tertiary }}>Today: </span>
            <span
              style={{ color: THEME.colors.text.primary }}
              className="font-medium"
            >
              {stats?.today_orders || 0} orders (${(stats?.today_revenue || 0).toFixed(2)})
            </span>
          </div>
          <div>
            <span style={{ color: THEME.colors.text.tertiary }}>
              Menu Items:{" "}
            </span>
            <span
              style={{ color: THEME.colors.text.primary }}
              className="font-medium"
            >
              {stats?.total_menu_items || 0}
            </span>
          </div>
          <div>
            <span style={{ color: THEME.colors.text.tertiary }}>
              Total Users:{" "}
            </span>
            <span
              style={{ color: THEME.colors.text.primary }}
              className="font-medium"
            >
              {stats?.total_users || 0}
            </span>
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div
          className="p-6 rounded-2xl backdrop-blur-sm border"
          style={{
            backgroundColor: THEME.colors.background.secondary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
            >
              <ShoppingBag className="w-5 h-5" style={{ color: "#10b981" }} />
            </div>
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{
                backgroundColor: "rgba(16, 185, 129, 0.1)",
                color: "#10b981",
              }}
            >
              +12%
            </span>
          </div>
          <p
            className="text-2xl font-bold mb-1"
            style={{ color: THEME.colors.text.primary }}
          >
            {stats?.total_orders?.toLocaleString() || '0'}
          </p>
          <p className="text-xs" style={{ color: THEME.colors.text.tertiary }}>
            Total Orders
          </p>
        </div>

        {/* Active Customers */}
        <div
          className="p-6 rounded-2xl backdrop-blur-sm border"
          style={{
            backgroundColor: THEME.colors.background.secondary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
            >
              <Users className="w-5 h-5" style={{ color: "#3b82f6" }} />
            </div>
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                color: "#3b82f6",
              }}
            >
              +8%
            </span>
          </div>
          <p
            className="text-2xl font-bold mb-1"
            style={{ color: THEME.colors.text.primary }}
          >
            {stats?.active_customers || stats?.total_users || '0'}
          </p>
          <p className="text-xs" style={{ color: THEME.colors.text.tertiary }}>
            Active Customers
          </p>
        </div>

        {/* Average Order Value */}
        <div
          className="p-6 rounded-2xl backdrop-blur-sm border"
          style={{
            backgroundColor: THEME.colors.background.secondary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
            >
              <TrendingUp className="w-5 h-5" style={{ color: "#f59e0b" }} />
            </div>
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                color: "#f59e0b",
              }}
            >
              +24%
            </span>
          </div>
          <p
            className="text-2xl font-bold mb-1"
            style={{ color: THEME.colors.text.primary }}
          >
            ${stats?.avg_order_value?.toFixed(2) || '0.00'}
          </p>
          <p className="text-xs" style={{ color: THEME.colors.text.tertiary }}>
            Avg Order Value
          </p>
        </div>

        {/* Pending Orders */}
        <div
          className="p-6 rounded-2xl backdrop-blur-sm border"
          style={{
            backgroundColor: THEME.colors.background.secondary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "rgba(239, 68, 68, 0.1)" }}
            >
              <Clock className="w-5 h-5" style={{ color: "#ef4444" }} />
            </div>
            <span
              className="text-xs px-2 py-1 rounded-full"
              style={{
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                color: "#ef4444",
              }}
            >
              12
            </span>
          </div>
          <p
            className="text-2xl font-bold mb-1"
            style={{ color: THEME.colors.text.primary }}
          >
            {stats?.pending_orders || '0'}
          </p>
          <p className="text-xs" style={{ color: THEME.colors.text.tertiary }}>
            Pending Orders
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div
          className="p-6 rounded-2xl backdrop-blur-sm border"
          style={{
            backgroundColor: THEME.colors.background.secondary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <h3
            className="text-lg font-semibold mb-6"
            style={{ color: THEME.colors.text.primary }}
          >
            Recent Activity
          </h3>
          <div className="space-y-4">
            {recentOrders.length > 0 ? recentOrders.map((order: any, index: number) => {
              const statusColors: any = {
                pending: "#f59e0b",
                confirmed: "#3b82f6",
                preparing: "#8b5cf6",
                ready: "#10b981",
                delivering: "#06b6d4",
                completed: "#10b981",
                cancelled: "#ef4444"
              };
              const color = statusColors[order.orderStatus] || "#6b7280";
              
              return (
                <div key={index} className="flex items-center gap-4">
                  <div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ backgroundColor: color }}
                  />
                  <div className="flex-1">
                    <p
                      className="text-sm"
                      style={{ color: THEME.colors.text.primary }}
                    >
                      Order {order.id} - {order.customerFullName || order.fullName || order.name || 'Guest'} (${parseFloat(order.totalFee || 0).toFixed(2)})
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: THEME.colors.text.tertiary }}
                    >
                      {order.orderStatus} • {order.orderType}
                    </p>
                  </div>
                </div>
              );
            }) : (
              <p className="text-sm" style={{ color: THEME.colors.text.tertiary }}>
                No recent orders
              </p>
            )}
          </div>
        </div>

        {/* Top Menu Items */}
        <div
          className="p-6 rounded-2xl backdrop-blur-sm border"
          style={{
            backgroundColor: THEME.colors.background.secondary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <h3
            className="text-lg font-semibold mb-6"
            style={{ color: THEME.colors.text.primary }}
          >
            Top Selling Items
          </h3>
          <div className="space-y-4">
            {topItems.length > 0 ? topItems.map((item: any, index: number) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-xl"
                style={{ backgroundColor: THEME.colors.background.tertiary }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{
                      backgroundColor: `rgba(${
                        index === 0
                          ? "16, 185, 129"
                          : index === 1
                          ? "59, 130, 246"
                          : "245, 158, 11"
                      }, 0.1)`,
                    }}
                  >
                    <Package
                      className="w-4 h-4"
                      style={{
                        color:
                          index === 0
                            ? "#10b981"
                            : index === 1
                            ? "#3b82f6"
                            : "#f59e0b",
                      }}
                    />
                  </div>
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: THEME.colors.text.primary }}
                    >
                      {item.name}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: THEME.colors.text.tertiary }}
                    >
                      {item.count} orders
                    </p>
                  </div>
                </div>
                <p
                  className="text-sm font-bold"
                  style={{ color: THEME.colors.text.primary }}
                >
                  ${(item.revenue || 0).toFixed(2)}
                </p>
              </div>
            )) : (
              <p className="text-sm" style={{ color: THEME.colors.text.tertiary }}>
                No sales data available
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div
        className="p-6 rounded-2xl backdrop-blur-sm border"
        style={{
          backgroundColor: THEME.colors.background.secondary,
          borderColor: THEME.colors.border.DEFAULT,
        }}
      >
        <h3
          className="text-lg font-semibold mb-6"
          style={{ color: THEME.colors.text.primary }}
        >
          Performance Summary
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p
              className="text-xs mb-2"
              style={{ color: THEME.colors.text.tertiary }}
            >
              Customer Satisfaction
            </p>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5" style={{ color: "#f59e0b" }} />
              <p
                className="text-2xl font-bold"
                style={{ color: THEME.colors.text.primary }}
              >
                4.8
              </p>
            </div>
          </div>
          <div>
            <p
              className="text-xs mb-2"
              style={{ color: THEME.colors.text.tertiary }}
            >
              Avg Delivery Time
            </p>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: "#3b82f6" }} />
              <p
                className="text-2xl font-bold"
                style={{ color: THEME.colors.text.primary }}
              >
                28m
              </p>
            </div>
          </div>
          <div>
            <p
              className="text-xs mb-2"
              style={{ color: THEME.colors.text.tertiary }}
            >
              Order Completion
            </p>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" style={{ color: "#10b981" }} />
              <p
                className="text-2xl font-bold"
                style={{ color: THEME.colors.text.primary }}
              >
                96%
              </p>
            </div>
          </div>
          <div>
            <p
              className="text-xs mb-2"
              style={{ color: THEME.colors.text.tertiary }}
            >
              Repeat Customers
            </p>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" style={{ color: "#8b5cf6" }} />
              <p
                className="text-2xl font-bold"
                style={{ color: THEME.colors.text.primary }}
              >
                68%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
