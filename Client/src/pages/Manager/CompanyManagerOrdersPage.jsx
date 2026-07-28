import { useEffect, useState } from "react";
import {
  getMyCompanyOrders,
  updateMyCompanyOrderStatus,
} from "../../services/companyManagerOrderService";
import {
  HiOutlineClipboardList,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineTruck,
  HiOutlineEye,
} from "react-icons/hi";

import "../Admin/AdminOrdersPage.css";

const CompanyManagerOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // UI state (frontend filtering only)
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // FETCH ORDERS
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getMyCompanyOrders();
        setOrders(data || []);
      } catch (err) {
        console.log(err);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, []);

  // UPDATE STATUS
  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);
      await updateMyCompanyOrderStatus(id, status);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status } : order
        )
      );
    } catch (err) {
      console.log(err);
      alert("Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  // Derived stats
  const totalOrders = orders.length;
  const pendingOrders = orders.filter((o) => o.status === "pending").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;
  const cancelledOrders = orders.filter((o) => o.status === "cancelled").length;

  // Frontend filtering
  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !search ||
      o._id?.toString().toLowerCase().includes(search.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === "all" || o.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="admin-orders page-surface">
        <div className="skeleton-hero" />
        <div className="skeleton-stats">
          <div />
          <div />
          <div />
          <div />
        </div>
        <div className="skeleton-list">
          <div />
          <div />
          <div />
        </div>
      </div>
    );
  }

  return (
    <div className="admin-orders page-surface">
      <header className="hero">
        <div className="hero-left">
          <div className="hero-icon" aria-hidden>
            <HiOutlineClipboardList />
          </div>
          <div>
            <h1 className="hero-title">My Company Orders</h1>
            <p className="hero-sub">Track and update orders containing your company's products.</p>
          </div>
        </div>
      </header>

      {error && <div className="error-banner" role="status">{error}</div>}

      <section className="stats-grid" aria-label="order statistics">
        <div className="stat-card">
          <div className="stat-value">{totalOrders}</div>
          <div className="stat-label">Total Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{pendingOrders}</div>
          <div className="stat-label">Pending Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{deliveredOrders}</div>
          <div className="stat-label">Delivered Orders</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{cancelledOrders}</div>
          <div className="stat-label">Cancelled Orders</div>
        </div>
      </section>

      <section className="controls">
        <div className="search">
          <HiOutlineSearch className="search-icon" />
          <input
            aria-label="Search orders"
            placeholder="Search by Order ID or Customer name"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filters">
          <HiOutlineFilter className="filter-icon" />
          {[
            { key: "all", label: "All" },
            { key: "pending", label: "Pending" },
            { key: "confirmed", label: "Confirmed" },
            { key: "shipped", label: "Shipped" },
            { key: "delivered", label: "Delivered" },
            { key: "cancelled", label: "Cancelled" },
          ].map((s) => (
            <button
              key={s.key}
              className={`pill ${statusFilter === s.key ? "active" : ""}`}
              onClick={() => setStatusFilter(s.key)}
              aria-pressed={statusFilter === s.key}
            >
              {s.label}
            </button>
          ))}
        </div>
      </section>

      {/* Desktop Table */}
      <section className="table-wrap" aria-live="polite">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <HiOutlineTruck className="empty-icon" />
            <h3>No orders found</h3>
            <p>There are no orders matching your criteria.</p>
          </div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>My Subtotal</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr key={order._id} className="orders-row">
                  <td className="mono">{order._id}</td>
                  <td>
                    <div className="customer-name">{order.customerName}</div>
                    <div className="customer-email">{order.user?.email}</div>
                  </td>
                  <td>{order.companySubtotal?.toLocaleString()} EGP</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>{order.status}</span>
                  </td>
                  <td>{order.createdAt ? new Date(order.createdAt).toLocaleString("en-US", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true }) : "N/A"}</td>
                  <td>
                    <div className="actions">
                      <button
                        type="button"
                        className="view-details-btn"
                        onClick={() => setSelectedOrder(order)}
                        aria-label="View order details"
                      >
                        <HiOutlineEye />
                      </button>
                      <select
                        value={order.status}
                        disabled={updatingId === order._id}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        aria-label={`Change status for order ${order._id}`}
                        className="status-select"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {updatingId === order._id && <span className="updating">Updating...</span>}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {/* Mobile cards */}
      <section className="cards-wrap">
        {filteredOrders.map((order) => (
          <article key={order._id} className="order-card">
            <div className="card-row">
              <div className="card-id">{order._id}</div>
              <div className={`status-badge ${order.status}`}>{order.status}</div>
            </div>
            <div className="card-row muted">{order.customerName}</div>
            <div className="card-row">My Subtotal: <strong>{order.companySubtotal?.toLocaleString()} EGP</strong></div>
            <div className="card-actions">
              <button
                type="button"
                className="view-details-btn"
                onClick={() => setSelectedOrder(order)}
                aria-label="View order details"
              >
                <HiOutlineEye />
              </button>
              <select
                value={order.status}
                disabled={updatingId === order._id}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                className="status-select"
              >
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="shipped">Shipped</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
              {updatingId === order._id && <span className="updating">Updating...</span>}
            </div>
          </article>
        ))}
      </section>

      {selectedOrder && (
        <div className="order-details-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="order-details-modal__header">
              <h2>Order Details</h2>
              <button
                type="button"
                className="order-details-modal__close"
                onClick={() => setSelectedOrder(null)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="order-details-modal__body">
              <div className="order-details-row">
                <span className="order-details-label">Order ID</span>
                <span className="order-details-value mono">{selectedOrder._id}</span>
              </div>

              <div className="order-details-row">
                <span className="order-details-label">Customer Name</span>
                <span className="order-details-value">{selectedOrder.customerName}</span>
              </div>

              <div className="order-details-row">
                <span className="order-details-label">Phone</span>
                <span className="order-details-value">{selectedOrder.phone}</span>
              </div>

              <div className="order-details-row">
                <span className="order-details-label">Address</span>
                <span className="order-details-value">{selectedOrder.address}</span>
              </div>

              <div className="order-details-row">
                <span className="order-details-label">Payment Method</span>
                <span className="order-details-value" style={{ textTransform: "capitalize" }}>
                  {selectedOrder.paymentMethod}
                </span>
              </div>

              <div className="order-details-row">
                <span className="order-details-label">Status</span>
                <span className={`status-badge ${selectedOrder.status}`}>{selectedOrder.status}</span>
              </div>

              <div className="order-details-row">
                <span className="order-details-label">Date</span>
                <span className="order-details-value">
                  {new Date(selectedOrder.createdAt).toLocaleString("en-US", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true })}
                </span>
              </div>

              <div className="order-details-divider" />

              <h3 className="order-details-items-title">Items Ordered</h3>
              <div className="order-details-items-list">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="order-details-item-row">
                    <span>{item.product?.name || "Unknown product"}</span>
                    <span>Qty: {item.quantity}</span>
                    {item.product?.price && (
                      <span>{item.product.price * item.quantity} EGP</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="order-details-divider" />

              <div className="order-details-row order-details-row--total">
                <span className="order-details-label">Total Price</span>
                <span className="order-details-value">{selectedOrder.companySubtotal} EGP</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyManagerOrdersPage;
