import React, { useState } from "react";
import { MapPin, Navigation } from "lucide-react";
import { SearchBar } from "../../common/SearchBar";
import { TrackingTable } from "./TrackingTable.tsx";
import { TrackingMap } from "./TrackingMap.tsx";
import { THEME } from "../../../constants/theme";
import type { CustomerTracking as CustomerTrackingType } from "../../../types";

// Mock data
const mockTrackingData: CustomerTrackingType[] = [
  {
    orderId: "1",
    orderNumber: "ORD-2024-001",
    customerName: "John Doe",
    status: "out_for_delivery",
    estimatedDelivery: "2024-10-21T14:30:00",
    location: { lat: 40.7128, lng: -74.006 },
    driver: "Mike Johnson",
  },
  {
    orderId: "2",
    orderNumber: "ORD-2024-002",
    customerName: "Jane Smith",
    status: "preparing",
    estimatedDelivery: "2024-10-21T15:00:00",
    driver: "Sarah Williams",
  },
  {
    orderId: "3",
    orderNumber: "ORD-2024-003",
    customerName: "Bob Johnson",
    status: "delivered",
    estimatedDelivery: "2024-10-21T13:45:00",
    location: { lat: 40.7589, lng: -73.9851 },
    driver: "Tom Brown",
  },
];

export const CustomerTracking: React.FC = () => {
  const [trackingData] = useState<CustomerTrackingType[]>(mockTrackingData);
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
