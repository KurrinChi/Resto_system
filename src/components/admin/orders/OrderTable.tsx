import React, { useState } from "react";
import { Eye, ChevronLeft, ChevronRight } from "lucide-react";
import type { Order } from "../../../types";
import { Badge } from "../../common/Badge";
import { Dropdown } from "../../common/Dropdown";
import { THEME } from "../../../constants/theme";

interface OrderTableProps {
  orders: Order[];
  onView: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: Order["status"]) => void;
}

const ITEMS_PER_PAGE = 10;

export const OrderTable: React.FC<OrderTableProps> = ({
  orders,
  onView,
  onUpdateStatus,
}) => {
  const [currentPage, setCurrentPage] = useState(1);

  const getStatusVariant = (
    status: string
  ): "success" | "warning" | "error" | "info" => {
    switch (status) {
      case "delivered":
        return "success";
      case "ready":
        return "info";
      case "preparing":
        return "warning";
      case "cancelled":
        return "error";
      default:
        return "warning";
    }
  };

  const getPaymentVariant = (
    status: string
  ): "success" | "warning" | "error" => {
    switch (status) {
      case "paid":
        return "success";
      case "pending":
        return "warning";
      case "refunded":
        return "error";
      default:
        return "warning";
    }
  };

  // Calculate pagination
  const totalPages = Math.ceil(orders.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentOrders = orders.slice(startIndex, endIndex);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(prev + 1, totalPages));
  };

  if (orders.length === 0) {
    return (
      <div
        className="flex items-center justify-center flex-1"
        style={{ color: THEME.colors.text.tertiary }}
      >
        <div className="text-center">
          <p className="text-lg font-medium mb-2">No orders found</p>
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
                Items
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: THEME.colors.text.secondary }}
              >
                Total
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
                Payment
              </th>
              <th
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider"
                style={{ color: THEME.colors.text.secondary }}
              >
                Date
              </th>
              <th
                className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider"
                style={{ color: THEME.colors.text.secondary }}
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, index) => (
              <tr
                key={order.id}
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
                  {order.orderNumber}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm font-medium"
                  style={{ color: THEME.colors.text.primary }}
                >
                  {order.customerName}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm"
                  style={{ color: THEME.colors.text.primary }}
                >
                  {order.items.length} item{order.items.length !== 1 ? "s" : ""}
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm font-bold"
                  style={{ color: THEME.colors.text.primary }}
                >
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Dropdown
                    trigger={
                      <span className="cursor-pointer">
                        <Badge variant={getStatusVariant(order.status)}>
                          {order.status.charAt(0).toUpperCase() +
                            order.status.slice(1)}
                        </Badge>
                      </span>
                    }
                    options={[
                      {
                        label: "Pending",
                        value: "pending",
                        onClick: () => onUpdateStatus(order.id, "pending"),
                      },
                      {
                        label: "Preparing",
                        value: "preparing",
                        onClick: () => onUpdateStatus(order.id, "preparing"),
                      },
                      {
                        label: "Ready",
                        value: "ready",
                        onClick: () => onUpdateStatus(order.id, "ready"),
                      },
                      {
                        label: "Delivered",
                        value: "delivered",
                        onClick: () => onUpdateStatus(order.id, "delivered"),
                      },
                      {
                        label: "Cancelled",
                        value: "cancelled",
                        onClick: () => onUpdateStatus(order.id, "cancelled"),
                      },
                    ]}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <Badge variant={getPaymentVariant(order.paymentStatus)}>
                    {order.paymentStatus.charAt(0).toUpperCase() +
                      order.paymentStatus.slice(1)}
                  </Badge>
                </td>
                <td
                  className="px-6 py-4 whitespace-nowrap text-sm"
                  style={{ color: THEME.colors.text.primary }}
                >
                  {new Date(order.orderDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right">
                  <button
                    onClick={() => onView(order)}
                    className="p-2 rounded-lg transition-all border inline-flex items-center gap-2"
                    style={{
                      color: THEME.colors.text.secondary,
                      backgroundColor: "transparent",
                      borderColor: THEME.colors.border.DEFAULT,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor =
                        "rgba(59, 130, 246, 0.1)";
                      e.currentTarget.style.color = "#3b82f6";
                      e.currentTarget.style.borderColor = "#3b82f6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "transparent";
                      e.currentTarget.style.color = THEME.colors.text.secondary;
                      e.currentTarget.style.borderColor =
                        THEME.colors.border.DEFAULT;
                    }}
                  >
                    <Eye className="w-4 h-4" />
                    <span className="text-sm">View</span>
                  </button>
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
              {Math.min(endIndex, orders.length)}
            </span>{" "}
            of{" "}
            <span style={{ color: THEME.colors.text.primary, fontWeight: 600 }}>
              {orders.length}
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
