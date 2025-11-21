import React, { useState, useEffect } from "react";
import { MapPin, Navigation } from "lucide-react";
import { SearchBar } from "../../common/SearchBar";
import { TrackingTable } from "./TrackingTable";
import { TrackingMap } from "./TrackingMap";
import { THEME } from "../../../constants/theme";
import type { CustomerTracking as CustomerTrackingType } from "../../../types";
import { ordersApi } from "../../../services/apiservice";

export const CustomerTracking: React.FC = () => {
  const [trackingData, setTrackingData] = useState<CustomerTrackingType[]>([]);
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
          .filter((order: any) => ['received', 'preparing', 'ready'].includes(order.orderStatus))
          .map((order: any) => ({
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
    } catch (err) {
      console.error('Error fetching tracking data:', err);
    } finally {
      setLoading(false);
    }
  };
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTracking, setSelectedTracking] =
    useState<CustomerTrackingType | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const handleViewLocation = (tracking: CustomerTrackingType) => {
    setSelectedTracking(tracking);
  };

  const filteredTracking = trackingData.filter((tracking) => {
    const matchesSearch =
      tracking.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tracking.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || tracking.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  // Calculate stats
  const stats = {
    preparing: trackingData.filter((t) => t.status === "preparing").length,
    outForDelivery: trackingData.filter((t) => t.status === "out_for_delivery")
      .length,
    delivered: trackingData.filter((t) => t.status === "delivered").length,
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Page Header */}
      <div className="flex-shrink-0">
        <h2
          className="text-2xl font-bold"
          style={{ color: THEME.colors.text.primary }}
        >
          Customer Tracking
        </h2>
        <p className="mt-1" style={{ color: THEME.colors.text.secondary }}>
          Real-time order tracking and delivery management
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-shrink-0">
        <div
          className="p-4 rounded-2xl border"
          style={{
            backgroundColor: THEME.colors.background.secondary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "rgba(245, 158, 11, 0.1)" }}
            >
              <Navigation className="w-6 h-6" style={{ color: "#f59e0b" }} />
            </div>
            <div>
              <p
                className="text-2xl font-bold"
                style={{ color: THEME.colors.text.primary }}
              >
                {stats.preparing}
              </p>
              <p
                className="text-sm"
                style={{ color: THEME.colors.text.tertiary }}
              >
                Preparing
              </p>
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
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "rgba(59, 130, 246, 0.1)" }}
            >
              <MapPin className="w-6 h-6" style={{ color: "#3b82f6" }} />
            </div>
            <div>
              <p
                className="text-2xl font-bold"
                style={{ color: THEME.colors.text.primary }}
              >
                {stats.outForDelivery}
              </p>
              <p
                className="text-sm"
                style={{ color: THEME.colors.text.tertiary }}
              >
                Out for Delivery
              </p>
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
          <div className="flex items-center gap-4">
            <div
              className="p-3 rounded-lg"
              style={{ backgroundColor: "rgba(16, 185, 129, 0.1)" }}
            >
              <MapPin className="w-6 h-6" style={{ color: "#10b981" }} />
            </div>
            <div>
              <p
                className="text-2xl font-bold"
                style={{ color: THEME.colors.text.primary }}
              >
                {stats.delivered}
              </p>
              <p
                className="text-sm"
                style={{ color: THEME.colors.text.tertiary }}
              >
                Delivered
              </p>
            </div>
          </div>
        </div>
      </div>

    

      {/* Filters and Search */}
      <div
        className="p-4 rounded-2xl border flex-shrink-0"
        style={{
          backgroundColor: THEME.colors.background.secondary,
          borderColor: THEME.colors.border.DEFAULT,
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <SearchBar
            placeholder="Search orders..."
            value={searchQuery}
            onChange={setSearchQuery}
          />

          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
            style={{
              backgroundColor: THEME.colors.background.tertiary,
              color: THEME.colors.text.primary,
              borderWidth: "1px",
              borderColor: THEME.colors.border.DEFAULT,
            }}
          >
            <option value="all">All Status</option>
            <option value="preparing">Preparing</option>
            <option value="out_for_delivery">Out for Delivery</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>
      </div>

      {/* Tracking Table */}
      <div
        className="rounded-2xl border overflow-hidden flex-1 flex flex-col"
        style={{
          backgroundColor: THEME.colors.background.secondary,
          borderColor: THEME.colors.border.DEFAULT,
        }}
      >
        <TrackingTable
          trackingData={filteredTracking}
          onViewLocation={handleViewLocation}
        />
      </div>
    </div>
  );
};
