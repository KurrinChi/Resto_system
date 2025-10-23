import React from "react";
import { Modal } from "../../common/Modal";
import { Badge } from "../../common/Badge";
import { THEME } from "../../../constants/theme";
import type { Order } from "../../../types";

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
}

export const OrderModal: React.FC<OrderModalProps> = ({
  isOpen,
  onClose,
  order,
}) => {
  if (!order) return null;

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Order Details - ${order.orderNumber}`}
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Order Status and Payment */}
        <div className="flex gap-4">
          <div className="flex-1">
            <p
              className="text-sm mb-1"
              style={{ color: THEME.colors.text.tertiary }}
            >
              Order Status
            </p>
            <Badge variant={getStatusVariant(order.status)} size="lg">
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </div>
          <div className="flex-1">
            <p
              className="text-sm mb-1"
              style={{ color: THEME.colors.text.tertiary }}
            >
              Payment Status
            </p>
            <Badge
              variant={order.paymentStatus === "paid" ? "success" : "warning"}
              size="lg"
            >
              {order.paymentStatus.charAt(0).toUpperCase() +
                order.paymentStatus.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <h3
            className="font-semibold mb-2"
            style={{ color: THEME.colors.text.primary }}
          >
            Customer Information
          </h3>
          <div
            className="rounded-lg p-4 space-y-2"
            style={{
              backgroundColor: THEME.colors.background.tertiary,
              borderWidth: "1px",
              borderColor: THEME.colors.border.DEFAULT,
            }}
          >
            <div className="flex justify-between">
              <span style={{ color: THEME.colors.text.tertiary }}>Name:</span>
              <span
                className="font-medium"
                style={{ color: THEME.colors.text.primary }}
              >
                {order.customerName}
              </span>
            </div>
            <div className="flex justify-between">
              <span style={{ color: THEME.colors.text.tertiary }}>
                Order Date:
              </span>
              <span
                className="font-medium"
                style={{ color: THEME.colors.text.primary }}
              >
                {new Date(order.orderDate).toLocaleString()}
              </span>
            </div>
            {order.deliveryAddress && (
              <div className="flex justify-between">
                <span style={{ color: THEME.colors.text.tertiary }}>
                  Delivery Address:
                </span>
                <span
                  className="font-medium text-right"
                  style={{ color: THEME.colors.text.primary }}
                >
                  {order.deliveryAddress}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Order Items */}
        <div>
          <h3
            className="font-semibold mb-2"
            style={{ color: THEME.colors.text.primary }}
          >
            Order Items
          </h3>
          <div
            className="rounded-lg overflow-hidden"
            style={{
              borderWidth: "1px",
              borderColor: THEME.colors.border.DEFAULT,
            }}
          >
            <table className="w-full">
              <thead
                style={{ backgroundColor: THEME.colors.background.tertiary }}
              >
                <tr>
                  <th
                    className="px-4 py-2 text-left text-sm font-medium"
                    style={{ color: THEME.colors.text.secondary }}
                  >
                    Item
                  </th>
                  <th
                    className="px-4 py-2 text-left text-sm font-medium"
                    style={{ color: THEME.colors.text.secondary }}
                  >
                    Qty
                  </th>
                  <th
                    className="px-4 py-2 text-left text-sm font-medium"
                    style={{ color: THEME.colors.text.secondary }}
                  >
                    Price
                  </th>
                  <th
                    className="px-4 py-2 text-right text-sm font-medium"
                    style={{ color: THEME.colors.text.secondary }}
                  >
                    Subtotal
                  </th>
                </tr>
              </thead>
              <tbody
                className="divide-y"
                style={{ borderColor: THEME.colors.border.DEFAULT }}
              >
                {order.items.map((item, index) => (
                  <tr
                    key={index}
                    style={{
                      backgroundColor:
                        index % 2 === 0
                          ? THEME.colors.background.secondary
                          : THEME.colors.background.tertiary,
                    }}
                  >
                    <td
                      className="px-4 py-3 text-sm"
                      style={{ color: THEME.colors.text.primary }}
                    >
                      {item.name}
                    </td>
                    <td
                      className="px-4 py-3 text-sm"
                      style={{ color: THEME.colors.text.primary }}
                    >
                      {item.quantity}
                    </td>
                    <td
                      className="px-4 py-3 text-sm"
                      style={{ color: THEME.colors.text.primary }}
                    >
                      ${item.price.toFixed(2)}
                    </td>
                    <td
                      className="px-4 py-3 text-sm text-right"
                      style={{ color: THEME.colors.text.primary }}
                    >
                      ${(item.quantity * item.price).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot
                style={{ backgroundColor: THEME.colors.background.tertiary }}
              >
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-3 text-right font-semibold"
                    style={{ color: THEME.colors.text.primary }}
                  >
                    Total:
                  </td>
                  <td
                    className="px-4 py-3 text-right font-bold text-lg"
                    style={{ color: THEME.colors.text.primary }}
                  >
                    ${order.total.toFixed(2)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Notes */}
        {order.notes && (
          <div>
            <h3
              className="font-semibold mb-2"
              style={{ color: THEME.colors.text.primary }}
            >
              Notes
            </h3>
            <div
              className="rounded-lg p-4"
              style={{
                backgroundColor: "rgba(245, 158, 11, 0.1)",
                borderWidth: "1px",
                borderColor: "rgba(245, 158, 11, 0.3)",
              }}
            >
              <p
                className="text-sm"
                style={{ color: THEME.colors.text.primary }}
              >
                {order.notes}
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
