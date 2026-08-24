import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { getOrders, updateOrderStatus } from "../../services/orderService";
import {
  HiOutlineClipboardList,
  HiOutlineSearch,
  HiOutlineFilter,
  HiOutlineTruck,
  HiOutlineEye,
} from "react-icons/hi";
import { useTranslation } from "react-i18next";

import "./AdminOrdersPage.css";

const AdminOrdersPage = () => {
  const { t } = useTranslation();
  const { token } = useSelector((state) => state.auth);

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
        const data = await getOrders(token);
        setOrders(data || []);
      } catch (error) {
        console.log(error);
        setError(t("adminOrders.errLoad"));
      } finally {
        setLoading(false);
      }
    };

    loadOrders();
  }, [token, t]);

  // UPDATE STATUS (keep existing functionality)
  const handleStatusChange = async (id, status) => {
    try {
      setUpdatingId(id);
      const updated = await updateOrderStatus(id, status, token);
      setOrders((prev) => prev.map((order) => (order._id === id ? updated : order)));
    } catch (error) {
      console.log(error);
      alert(t("adminOrders.errUpdate"));
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
            <h1 className="hero-title">{t("adminOrders.title")}</h1>
            <p className="hero-sub">{t("adminOrders.subtitle")}</p>
          </div>
        </div>
      </header>

      {error && <div className="error-banner" role="status">{error}</div>}

      <section className="stats-grid" aria-label="order statistics">
        <div className="stat-card">
          <div className="stat-value">{totalOrders}</div>
          <div className="stat-label">{t("adminOrders.totalOrders")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{pendingOrders}</div>
          <div className="stat-label">{t("adminOrders.pendingOrders")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{deliveredOrders}</div>
          <div className="stat-label">{t("adminOrders.deliveredOrders")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{cancelledOrders}</div>
          <div className="stat-label">{t("adminOrders.cancelledOrders")}</div>
        </div>
      </section>

      <section className="controls">
        <div className="search">
          <HiOutlineSearch className="search-icon" />
          <input
            aria-label="Search orders"
            placeholder={t("adminOrders.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filters">
          <HiOutlineFilter className="filter-icon" />
          {[
            { key: "all", label: t("adminOrders.filterAll") },
            { key: "pending", label: t("adminOrders.filterPending") },
            { key: "confirmed", label: t("adminOrders.filterConfirmed") },
            { key: "shipped", label: t("adminOrders.filterShipped") },
            { key: "delivered", label: t("adminOrders.filterDelivered") },
            { key: "cancelled", label: t("adminOrders.filterCancelled") },
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
            <h3>{t("adminOrders.emptyTitle")}</h3>
            <p>{t("adminOrders.emptySubtitle")}</p>
          </div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>{t("adminOrders.thId")}</th>
                <th>{t("adminOrders.thCustomer")}</th>
                <th>{t("adminOrders.thTotal")}</th>
                <th>{t("adminOrders.thStatus")}</th>
                <th>{t("adminOrders.thDate")}</th>
                <th>{t("adminOrders.thActions")}</th>
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
                  <td>{order.totalPrice}{t("adminOrders.currency")}</td>
                  <td>
                    <span className={`status-badge ${order.status}`}>{t(`adminOrders.filter${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`)}</span>
                  </td>
                  <td>{order.createdAt || order.updatedAt ? new Date(order.createdAt || order.updatedAt).toLocaleString("en-US", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true }) : t("adminOrders.na")}</td><td>
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
                        <option value="pending">{t("adminOrders.filterPending")}</option>
                        <option value="confirmed">{t("adminOrders.filterConfirmed")}</option>
                        <option value="shipped">{t("adminOrders.filterShipped")}</option>
                        <option value="delivered">{t("adminOrders.filterDelivered")}</option>
                        <option value="cancelled">{t("adminOrders.filterCancelled")}</option>
                      </select>
                      {updatingId === order._id && <span className="updating">{t("adminOrders.updating")}</span>}
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
              <div className={`status-badge ${order.status}`}>{t(`adminOrders.filter${order.status.charAt(0).toUpperCase() + order.status.slice(1)}`)}</div>
            </div>
            <div className="card-row muted">{order.customerName}</div>
            <div className="card-row">{t("adminOrders.totalLabel")}<strong>{order.totalPrice}{t("adminOrders.currency")}</strong></div>
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
                <option value="pending">{t("adminOrders.filterPending")}</option>
                <option value="confirmed">{t("adminOrders.filterConfirmed")}</option>
                <option value="shipped">{t("adminOrders.filterShipped")}</option>
                <option value="delivered">{t("adminOrders.filterDelivered")}</option>
                <option value="cancelled">{t("adminOrders.filterCancelled")}</option>
              </select>
              {updatingId === order._id && <span className="updating">{t("adminOrders.updating")}</span>}
            </div>
          </article>
        ))}
      </section>

      {selectedOrder && (
        <div className="order-details-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="order-details-modal__header">
              <h2>{t("adminOrders.modalTitle")}</h2>
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
                <span className="order-details-label">{t("adminOrders.thId")}</span>
                <span className="order-details-value mono">{selectedOrder._id}</span>
              </div>

              <div className="order-details-row">
                <span className="order-details-label">{t("adminOrders.thCustomer")}</span>
                <span className="order-details-value">{selectedOrder.customerName}</span>
              </div>

              <div className="order-details-row">
                <span className="order-details-label">{t("adminOrders.modalPhone")}</span>
                <span className="order-details-value">{selectedOrder.phone}</span>
              </div>

              <div className="order-details-row">
                <span className="order-details-label">{t("adminOrders.modalAddress")}</span>
                <span className="order-details-value">{selectedOrder.address}</span>
              </div>

              <div className="order-details-row">
                <span className="order-details-label">{t("adminOrders.modalPayment")}</span>
                <span className="order-details-value" style={{ textTransform: "capitalize" }}>
                  {selectedOrder.paymentMethod}
                </span>
              </div>

              <div className="order-details-row">
                <span className="order-details-label">{t("adminOrders.thStatus")}</span>
                <span className={`status-badge ${selectedOrder.status}`}>{t(`adminOrders.filter${selectedOrder.status.charAt(0).toUpperCase() + selectedOrder.status.slice(1)}`)}</span>
              </div>

              <div className="order-details-row">
                <span className="order-details-label">{t("adminOrders.thDate")}</span>
                <span className="order-details-value">
                  {new Date(selectedOrder.createdAt).toLocaleString("en-US", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true })}
                </span>
              </div>

              <div className="order-details-divider" />

              <h3 className="order-details-items-title">{t("adminOrders.modalItems")}</h3>
              <div className="order-details-items-list">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="order-details-item-row">
                    <span>{item.product?.name || t("adminOrders.unknownProduct")}</span>
                    <span>{t("adminOrders.modalQty")}{item.quantity}</span>
                    {item.product?.price && (
                      <span>{item.product.price * item.quantity}{t("adminOrders.currency")}</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="order-details-divider" />

              <div className="order-details-row order-details-row--total">
                <span className="order-details-label">{t("adminOrders.thTotal")}</span>
                <span className="order-details-value">{selectedOrder.totalPrice}{t("adminOrders.currency")}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;