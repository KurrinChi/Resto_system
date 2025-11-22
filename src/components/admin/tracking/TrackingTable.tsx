import React, { useState } from "react";
import { RefreshCw, ChevronLeft, ChevronRight } from "lucide-react";
import { Badge } from "../../common/Badge";
import { THEME } from "../../../constants/theme";
import type { CustomerTracking } from "../../../types";

interface TrackingTableProps {
  trackingData: CustomerTracking[];
  onUpdateStatus: (tracking: CustomerTracking) => void;
}

const ITEMS_PER_PAGE = 10;

export const TrackingTable: React.FC<TrackingTableProps> = ({
  trackingData,
  onUpdateStatus,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const getStatusVariant = (status: string): "success" | "warning" | "info" => {
    switch (status) {
      case "delivered":
        return "success";
      case "out_for_delivery":
        return "info";
      case "preparing":
        return "warning";
      default:
        return "warning";
    }
  };

  const formatStatus = (status: string): string => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  // Calculate pagination
  const totalPages = Math.ceil(trackingData.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentItems = trackingData.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (trackingData.length === 0) {
    return (
      <div
        className="flex items-center justify-center flex-1"
        style={{ color: THEME.colors.text.tertiary }}
      >
        <div className="text-center py-12">
          <p className="text-lg font-medium mb-2">No tracking data found</p>
          <p className="text-sm">Try adjusting your search or filters</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Table Container */}
      <div className="overflow-x-auto flex-1">
        <table className="w-full">
          <thead className="sticky top-0 z-10">
            <tr
              style={{
                backgroundColor: THEME.colors.background.tertiary,
                borderBottom: `2px solid ${THEME.colors.border.light}`,
              }}
            >
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: THEME.colors.text.secondary }}
              >
                Order #
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: THEME.colors.text.secondary }}
              >
                Customer
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: THEME.colors.text.secondary }}
              >
                Driver
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: THEME.colors.text.secondary }}
              >
                Status
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: THEME.colors.text.secondary }}
              >
                Est. Delivery
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: THEME.colors.text.secondary }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((tracking, index) => (
              <tr
                key={tracking.orderId}
                className="transition-all duration-200"
                style={{
                  backgroundColor:
                    index % 2 === 0
                      ? THEME.colors.background.secondary
                      : THEME.colors.background.tertiary,
                  borderBottom: `1px solid ${THEME.colors.border.dark}`,
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor =
                    THEME.colors.background.hover;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor =
                    index % 2 === 0
                      ? THEME.colors.background.secondary
                      : THEME.colors.background.tertiary;
                }}
              >
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm font-semibold"
                  style={{ color: THEME.colors.text.primary }}
                >
                  {tracking.orderNumber}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                  style={{ color: THEME.colors.text.primary }}
                >
                  {tracking.customerName}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm"
                  style={{ color: THEME.colors.text.primary }}
                >
                  {tracking.driver || "Not assigned"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getStatusVariant(tracking.status)}>
                    {formatStatus(tracking.status)}
                  </Badge>
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm"
                  style={{ color: THEME.colors.text.primary }}
                >
                  {new Date(tracking.estimatedDelivery).toLocaleString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <select
                    value={tracking.status}
                    onChange={(e) => onUpdateStatus({...tracking, status: e.target.value})}
                    className="px-3 py-1.5 rounded-lg text-sm border transition-all focus:outline-none focus:ring-2"
                    style={{
                      backgroundColor: THEME.colors.background.tertiary,
                      color: THEME.colors.text.primary,
                      borderColor: THEME.colors.border.DEFAULT,
                    }}
                  >
                    <option value="received">Received</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="delivered">Delivered</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div
        className="flex items-center justify-between px-6 py-3 border-t flex-shrink-0"
        style={{
          backgroundColor: THEME.colors.background.tertiary,
          borderColor: THEME.colors.border.DEFAULT,
        }}
      >
        <div className="flex items-center gap-2">
          <p className="text-sm" style={{ color: THEME.colors.text.secondary }}>
            Showing{" "}
            <span style={{ color: THEME.colors.text.primary, fontWeight: 600 }}>
              {startIndex + 1}
            </span>{" "}
            to{" "}
            <span style={{ color: THEME.colors.text.primary, fontWeight: 600 }}>
              {Math.min(endIndex, trackingData.length)}
            </span>{" "}
            of{" "}
            <span style={{ color: THEME.colors.text.primary, fontWeight: 600 }}>
              {trackingData.length}
            </span>{" "}
            orders
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: THEME.colors.background.secondary,
              color: THEME.colors.text.primary,
              borderWidth: "1px",
              borderColor: THEME.colors.border.DEFAULT,
            }}
            onMouseEnter={(e) => {
              if (currentPage !== 1) {
                e.currentTarget.style.backgroundColor =
                  THEME.colors.background.hover;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                THEME.colors.background.secondary;
            }}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-1">
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let page;
              if (totalPages <= 5) {
                page = i + 1;
              } else if (currentPage <= 3) {
                page = i + 1;
              } else if (currentPage >= totalPages - 2) {
                page = totalPages - 4 + i;
              } else {
                page = currentPage - 2 + i;
              }
              return page;
            }).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className="px-3 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  backgroundColor:
                    page === currentPage
                      ? THEME.colors.primary.DEFAULT
                      : THEME.colors.background.secondary,
                  color:
                    page === currentPage
                      ? THEME.colors.text.primary
                      : THEME.colors.text.secondary,
                  borderWidth: "1px",
                  borderColor:
                    page === currentPage
                      ? "transparent"
                      : THEME.colors.border.DEFAULT,
                }}
                onMouseEnter={(e) => {
                  if (page !== currentPage) {
                    e.currentTarget.style.backgroundColor =
                      THEME.colors.background.hover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (page !== currentPage) {
                    e.currentTarget.style.backgroundColor =
                      THEME.colors.background.secondary;
                  }
                }}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            style={{
              backgroundColor: THEME.colors.background.secondary,
              color: THEME.colors.text.primary,
              borderWidth: "1px",
              borderColor: THEME.colors.border.DEFAULT,
            }}
            onMouseEnter={(e) => {
              if (currentPage !== totalPages) {
                e.currentTarget.style.backgroundColor =
                  THEME.colors.background.hover;
              }
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor =
                THEME.colors.background.secondary;
            }}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
