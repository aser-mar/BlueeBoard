import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getOrders, updateOrderStatus } from "../../services/orderService";
import {
  HiOutlineClipboardList,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineTruck,
  // HiOutlineBadgeCheck,
} from "react-icons/hi";

import "./AdminOrdersPage.css";

const AdminOrdersPage = () => {
  const { token } = useSelector((state) => state.auth);

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // UI state (frontend filtering only)
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // FETCH ORDERS
  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await getOrders(token);
        setOrders(data || []);
      } catch (error) {
        console.log(error);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token]);

  // UPDATE STATUS (keep existing functionality)
  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);
      const updated = await updateOrderStatus(id, status, token);
      setOrders((prev) => prev.map((order) => (order._id === id ? updated : order)));
    } catch (error) {
      console.log(error);
      alert("Failed to update order");
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
            <h1 className="hero-title">Manage Orders</h1>
            <p className="hero-sub">Track, update and manage customer orders.</p>
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
                <th>Total Price</th>
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
                  <td>{order.totalPrice} EGP</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>{order.status}</span>
                  </td>
                  <td>{order.createdAt || order.updatedAt ? new Date(order.createdAt || order.updatedAt).toLocaleString() : "N/A"}</td><td>
                    <div className="actions">
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
            <div className="card-row">Total: <strong>{order.totalPrice} EGP</strong></div>
            <div className="card-actions">
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
    </div>
  );
};

export default AdminOrdersPage;