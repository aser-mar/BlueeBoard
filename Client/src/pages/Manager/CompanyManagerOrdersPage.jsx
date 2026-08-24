import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
        setError(t("managerOrders.errLoad"));
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
      alert(t("managerOrders.errUpdate"));
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
            <h1 className="hero-title">{t("managerOrders.title")}</h1>
            <p className="hero-sub">{t("managerOrders.subtitle")}</p>
          </div>
        </div>
      </header>

      {error && <div className="error-banner" role="status">{error}</div>}

      <section className="stats-grid" aria-label="order statistics">
        <div className="stat-card">
          <div className="stat-value">{totalOrders}</div>
          <div className="stat-label">{t("managerOrders.totalOrders")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{pendingOrders}</div>
          <div className="stat-label">{t("managerOrders.pendingOrders")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{deliveredOrders}</div>
          <div className="stat-label">{t("managerOrders.deliveredOrders")}</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{cancelledOrders}</div>
          <div className="stat-label">{t("managerOrders.cancelledOrders")}</div>
        </div>
      </section>

      <section className="controls">
        <div className="search">
          <HiOutlineSearch className="search-icon" />
          <input
            aria-label="Search orders"
            placeholder={t("managerOrders.searchPlaceholder")}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filters">
          <HiOutlineFilter className="filter-icon" />
          {[
            { key: "all", label: t("managerOrders.filterAll") },
            { key: "pending", label: t("managerOrders.filterPending") },
            { key: "confirmed", label: t("managerOrders.filterConfirmed") },
            { key: "shipped", label: t("managerOrders.filterShipped") },
            { key: "delivered", label: t("managerOrders.filterDelivered") },
            { key: "cancelled", label: t("managerOrders.filterCancelled") },
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
            <h3>{t("managerOrders.emptyTitle")}</h3>
            <p>{t("managerOrders.emptySubtitle")}</p>
          </div>
        ) : (
          <table className="orders-table">
            <thead>
              <tr>
                <th>{t("managerOrders.thId")}</th>
                <th>{t("managerOrders.thCustomer")}</th>
                <th>{t("managerOrders.thSubtotal")}</th>
                <th>{t("managerOrders.thStatus")}</th>
                <th>{t("managerOrders.thDate")}</th>
                <th>{t("managerOrders.thActions")}</th>
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
                  <td>{order.createdAt ? new Date(order.createdAt).toLocaleString("en-US", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true }) : t("managerOrders.na")}</td>
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
                        <option value="pending">{t("managerOrders.filterPending")}</option>
                        <option value="confirmed">{t("managerOrders.filterConfirmed")}</option>
                        <option value="shipped">{t("managerOrders.filterShipped")}</option>
                        <option value="delivered">{t("managerOrders.filterDelivered")}</option>
                        <option value="cancelled">{t("managerOrders.filterCancelled")}</option>
                      </select>
                      {updatingId === order._id && <span className="updating">{t("managerOrders.updating")}</span>}
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
            <div className="card-row">{t("managerOrders.mySubtotalLabel")}<strong>{order.companySubtotal?.toLocaleString()} EGP</strong></div>
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
                <option value="pending">{t("managerOrders.filterPending")}</option>
                <option value="confirmed">{t("managerOrders.filterConfirmed")}</option>
                <option value="shipped">{t("managerOrders.filterShipped")}</option>
                <option value="delivered">{t("managerOrders.filterDelivered")}</option>
                <option value="cancelled">{t("managerOrders.filterCancelled")}</option>
              </select>
              {updatingId === order._id && <span className="updating">{t("managerOrders.updating")}</span>}
            </div>
          </article>
        ))}
      </section>

      {selectedOrder && (
        <div className="order-details-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="order-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="order-details-modal__header">
              <h2>{t("managerOrders.modalTitle")}</h2>
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
                <span className="order-details-label">{t("managerOrders.modalOrderId")}</span>
                <span className="order-details-value mono">{selectedOrder._id}</span>
              </div>

              <div className="order-details-row">
                <span className="order-details-label">{t("managerOrders.modalCustomer")}</span>
                <span className="order-details-value">{selectedOrder.customerName}</span>
              </div>

              <div className="order-details-row">
                <span className="order-details-label">{t("managerOrders.modalPhone")}</span>
                <span className="order-details-value">{selectedOrder.phone}</span>
              </div>

              <div className="order-details-row">
                <span className="order-details-label">{t("managerOrders.modalAddress")}</span>
                <span className="order-details-value">{selectedOrder.address}</span>
              </div>

              <div className="order-details-row">
                <span className="order-details-label">{t("managerOrders.modalPayment")}</span>
                <span className="order-details-value" style={{ textTransform: "capitalize" }}>
                  {selectedOrder.paymentMethod}
                </span>
              </div>

              <div className="order-details-row">
                <span className="order-details-label">{t("managerOrders.modalStatus")}</span>
                <span className={`status-badge ${selectedOrder.status}`}>{selectedOrder.status}</span>
              </div>

              <div className="order-details-row">
                <span className="order-details-label">{t("managerOrders.modalDate")}</span>
                <span className="order-details-value">
                  {new Date(selectedOrder.createdAt).toLocaleString("en-US", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit", hour12: true })}
                </span>
              </div>

              <div className="order-details-divider" />

              <h3 className="order-details-items-title">{t("managerOrders.modalItems")}</h3>
              <div className="order-details-items-list">
                {selectedOrder.items.map((item, index) => (
                  <div key={index} className="order-details-item-row">
                    <span>{item.product?.name || t("managerOrders.unknownProduct")}</span>
                    <span>{t("managerOrders.modalQty")}{item.quantity}</span>
                    {item.product?.price && (
                      <span>{item.product.price * item.quantity} EGP</span>
                    )}
                  </div>
                ))}
              </div>

              <div className="order-details-divider" />

              <div className="order-details-row order-details-row--total">
                <span className="order-details-label">{t("managerOrders.modalTotalPrice")}</span>
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
