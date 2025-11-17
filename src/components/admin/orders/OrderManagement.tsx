import React, { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "../../common/Button";
import { SearchBar } from "../../common/SearchBar";
import { Modal } from "../../common/Modal";
import { OrderTable } from "./OrderTable.tsx";
import { OrderModal } from "./OrderModal.tsx";
import { THEME } from "../../../constants/theme";
import type { Order } from "../../../types";

// Mock data
const mockOrders: Order[] = [
  {
    id: "1",
    orderNumber: "ORD-2024-001",
    customerId: "1",
    customerName: "John Doe",
    items: [
      { menuItemId: "1", name: "Classic Burger", quantity: 2, price: 12.99 },
      { menuItemId: "3", name: "Caesar Salad", quantity: 1, price: 9.99 },
    ],
    status: "preparing",
    total: 35.97,
    paymentStatus: "paid",
    orderDate: "2024-10-21T10:30:00",
    deliveryAddress: "123 Main St, Apt 4B",
  },
  {
    id: "2",
    orderNumber: "ORD-2024-002",
    customerId: "2",
    customerName: "Jane Smith",
    items: [
      { menuItemId: "2", name: "Margherita Pizza", quantity: 1, price: 14.99 },
    ],
    status: "ready",
    total: 14.99,
    paymentStatus: "paid",
    orderDate: "2024-10-21T11:15:00",
    deliveryAddress: "456 Oak Ave",
  },
  {
    id: "3",
    orderNumber: "ORD-2024-003",
    customerId: "3",
    customerName: "Bob Johnson",
    items: [
      { menuItemId: "5", name: "Grilled Salmon", quantity: 1, price: 19.99 },
      { menuItemId: "3", name: "Caesar Salad", quantity: 1, price: 9.99 },
    ],
    status: "delivered",
    total: 29.98,
    paymentStatus: "paid",
    orderDate: "2024-10-21T09:45:00",
    deliveryAddress: "789 Pine Rd",
  },
  {
    id: "4",
    orderNumber: "ORD-2024-004",
    customerId: "4",
    customerName: "Alice Brown",
    items: [
      { menuItemId: "1", name: "Classic Burger", quantity: 3, price: 12.99 },
    ],
    status: "pending",
    total: 38.97,
    paymentStatus: "pending",
    orderDate: "2024-10-21T12:00:00",
    deliveryAddress: "321 Elm St",
  },
  {
    id: "5",
    orderNumber: "ORD-2024-005",
    customerId: "5",
    customerName: "Charlie Wilson",
    items: [
      { menuItemId: "4", name: "Pasta Carbonara", quantity: 2, price: 13.99 },
    ],
    status: "cancelled",
    total: 27.98,
    paymentStatus: "refunded",
    orderDate: "2024-10-21T10:00:00",
    notes: "Customer requested cancellation",
  },
];

export const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPayment, setFilterPayment] = useState<string>("all");
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateOrderStatus = (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  const handleCancelOrder = (orderId: string) => {
    setOrderToCancel(orderId);
    setIsCancelConfirmOpen(true);
  };

  const handleConfirmCancel = () => {
    if (orderToCancel) {
      setOrders(
        orders.map((order) =>
          order.id === orderToCancel
            ? {
                ...order,
                status: "cancelled",
                paymentStatus: order.paymentStatus === "paid" ? "refunded" : order.paymentStatus,
              }
            : order
        )
      );
      setIsCancelConfirmOpen(false);
      setOrderToCancel(null);
    }
  };

  const handleCancelConfirm = () => {
    setIsCancelConfirmOpen(false);
    setOrderToCancel(null);
  };

  const handleExportOrders = () => {
    console.log("Exporting orders...");
    alert("Orders exported successfully!");
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || order.status === filterStatus;
    const matchesPayment =
      filterPayment === "all" || order.paymentStatus === filterPayment;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  // Calculate stats
  const stats = {
    total: orders.length,
    pending: orders.filter((o) => o.status === "pending").length,
    preparing: orders.filter((o) => o.status === "preparing").length,
    ready: orders.filter((o) => o.status === "ready").length,
    delivered: orders.filter((o) => o.status === "delivered").length,
  };

  return (
    <div className="flex flex-col h-full space-y-4">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 flex-shrink-0">
        <div>
          <h2
            className="text-2xl font-bold"
            style={{ color: THEME.colors.text.primary }}
          >
            Order Management
          </h2>
          <p className="mt-1" style={{ color: THEME.colors.text.secondary }}>
            Track and manage customer orders
          </p>
        </div>
        <Button
          onClick={handleExportOrders}
          icon={<Download className="w-5 h-5" />}
          variant="secondary"
        >
          Export Orders
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 flex-shrink-0">
        <div
          className="p-4 rounded-2xl border text-center"
          style={{
            backgroundColor: THEME.colors.background.secondary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <p
            className="text-2xl font-bold"
            style={{ color: THEME.colors.text.primary }}
          >
            {stats.total}
          </p>
          <p
            className="text-sm mt-1"
            style={{ color: THEME.colors.text.tertiary }}
          >
            Total Orders
          </p>
        </div>
        <div
          className="p-4 rounded-2xl border text-center"
          style={{
            backgroundColor: THEME.colors.background.secondary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <p className="text-2xl font-bold" style={{ color: "#f59e0b" }}>
            {stats.pending}
          </p>
          <p
            className="text-sm mt-1"
            style={{ color: THEME.colors.text.tertiary }}
          >
            Pending
          </p>
        </div>
        <div
          className="p-4 rounded-2xl border text-center"
          style={{
            backgroundColor: THEME.colors.background.secondary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <p className="text-2xl font-bold" style={{ color: "#3b82f6" }}>
            {stats.preparing}
          </p>
          <p
            className="text-sm mt-1"
            style={{ color: THEME.colors.text.tertiary }}
          >
            Preparing
          </p>
        </div>
        <div
          className="p-4 rounded-2xl border text-center"
          style={{
            backgroundColor: THEME.colors.background.secondary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <p className="text-2xl font-bold" style={{ color: "#8b5cf6" }}>
            {stats.ready}
          </p>
          <p
            className="text-sm mt-1"
            style={{ color: THEME.colors.text.tertiary }}
          >
            Ready
          </p>
        </div>
        <div
          className="p-4 rounded-2xl border text-center"
          style={{
            backgroundColor: THEME.colors.background.secondary,
            borderColor: THEME.colors.border.DEFAULT,
          }}
        >
          <p className="text-2xl font-bold" style={{ color: "#10b981" }}>
            {stats.delivered}
          </p>
          <p
            className="text-sm mt-1"
            style={{ color: THEME.colors.text.tertiary }}
          >
            Delivered
          </p>
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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <SearchBar
              placeholder="Search orders..."
              value={searchQuery}
              onChange={setSearchQuery}
            />
          </div>

          <div>
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
              <option value="pending">Pending</option>
              <option value="preparing">Preparing</option>
              <option value="ready">Ready</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <select
              value={filterPayment}
              onChange={(e) => setFilterPayment(e.target.value)}
              className="w-full px-4 py-2 rounded-lg focus:outline-none focus:ring-2 transition-all"
              style={{
                backgroundColor: THEME.colors.background.tertiary,
                color: THEME.colors.text.primary,
                borderWidth: "1px",
                borderColor: THEME.colors.border.DEFAULT,
              }}
            >
              <option value="all">All Payments</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div
        className="rounded-2xl border overflow-hidden flex-1 flex flex-col"
        style={{
          backgroundColor: THEME.colors.background.secondary,
          borderColor: THEME.colors.border.DEFAULT,
        }}
      >
        <OrderTable
          orders={filteredOrders}
          onView={handleViewOrder}
          onUpdateStatus={handleUpdateOrderStatus}
          onCancelOrder={handleCancelOrder}
        />
      </div>

      {/* Order Details Modal */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        order={selectedOrder}
      />

      {/* Cancel Order Confirmation Modal */}
      <Modal
        isOpen={isCancelConfirmOpen}
        onClose={handleCancelConfirm}
        title="Cancel Order"
        maxWidth="sm"
        footer={
          <div className="flex items-center gap-3 justify-end">
            <Button
              onClick={handleCancelConfirm}
              variant="secondary"
            >
              Keep Order
            </Button>
            <Button
              onClick={handleConfirmCancel}
              variant="danger"
            >
              Cancel Order
            </Button>
          </div>
        }
      >
        <div className="p-6">
          <p style={{ color: THEME.colors.text.primary }} className="mb-4">
            Are you sure you want to cancel this order?
          </p>
          <p style={{ color: THEME.colors.text.secondary }} className="text-sm">
            {orderToCancel && orders.find((o) => o.id === orderToCancel)?.orderNumber && (
              <>
                Order <strong>{orders.find((o) => o.id === orderToCancel)?.orderNumber}</strong> will be cancelled
                {orders.find((o) => o.id === orderToCancel)?.paymentStatus === "paid" && (
                  <> and refunded</>
                )}
                .
              </>
            )}
          </p>
        </div>
      </Modal>
    </div>
  );
};
