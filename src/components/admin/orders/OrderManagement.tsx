import React, { useState, useEffect } from "react";
import { Download } from "lucide-react";
import { Button } from "../../common/Button";
import { SearchBar } from "../../common/SearchBar";
import { Modal } from "../../common/Modal";
import { OrderTable } from "./OrderTable.tsx";
import { OrderModal } from "./OrderModal.tsx";
import { THEME } from "../../../constants/theme";
import type { Order } from "../../../types";
import { ordersApi } from "../../../services/apiservice";

export const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [filterPayment, setFilterPayment] = useState<string>("all");
  const [isCancelConfirmOpen, setIsCancelConfirmOpen] = useState(false);
  const [orderToCancel, setOrderToCancel] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await ordersApi.getAll();
      if (response.success) {
        // Transform Firebase data to match Order interface
        const ordersData = response.data.map((order: any) => ({
          id: order.id,
          orderNumber: order.id || `ORD-${order.id.slice(0, 8)}`,
          customerId: order.userId || order.guestInfo?.email || '',
          customerName: order.customerName || order.guestInfo?.name || order.userId || 'Guest',
          items: order.orderList?.map((item: any) => ({
            menuItemId: item.menuId,
            name: item.menuName,
            quantity: item.quantity || 1,
            price: item.price || item.unitPrice || 0,
            specialInstructions: item.notes
          })) || [],
          status: order.orderStatus || 'pending',
          total: order.totalFee || 0,
          paymentStatus: order.paymentMethod === 'cod' ? 'pending' : 'paid',
          orderDate: order.createdAt || order.dayKey,
          deliveryAddress: order.deliveryAddress?.fullAddress || (order.tableNumber ? `Table ${order.tableNumber}` : ''),
          notes: order.orderList?.[0]?.notes || ''
        }));
        setOrders(ordersData);
      }
    } catch (err: any) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleUpdateOrderStatus = async (
    orderId: string,
    newStatus: Order["status"]
  ) => {
    try {
      const response = await ordersApi.updateStatus(orderId, newStatus);
      if (response.success) {
        setOrders(
          orders.map((order) =>
            order.id === orderId ? { ...order, status: newStatus } : order
          )
        );
      }
    } catch (err: any) {
      alert('Error updating order status: ' + err.message);
    }
  };

  const handleCancelOrder = (orderId: string) => {
    setOrderToCancel(orderId);
    setIsCancelConfirmOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (orderToCancel) {
      try {
        // Update status to cancelled in Firebase
        const response = await ordersApi.updateStatus(orderToCancel, 'cancelled');
        
        if (response.success) {
          // Update local state
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
        } else {
          alert('Failed to cancel order');
        }
      } catch (err: any) {
        alert('Error cancelling order: ' + err.message);
      } finally {
        setIsCancelConfirmOpen(false);
        setOrderToCancel(null);
      }
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
