import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";

import {
  getMyOrders,
  cancelOrder,
} from "../services/orderService";

import {
  HiOutlineClipboardList,
  HiOutlineTruck,
  HiOutlineCheckCircle,
  HiOutlineXCircle,
  HiOutlineShoppingBag,
  HiOutlineExclamationCircle,
} from "react-icons/hi";
import { useTranslation } from "react-i18next";

import "./MyOrdersPage.css";

const MyOrdersPage = () => {
  const { t } = useTranslation();
  const { token, userInfo } = useSelector(
    (state) => state.auth
  );

  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState(null);

  // redirect if not logged in
  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    }
  }, [userInfo, navigate]);

  // fetch orders
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);

        const data = await getMyOrders(token);

        setOrders(data || []);
      } catch (error) {
        console.log(error);
        setError(t("orders.errLoad"));
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token, t]);

  // cancel order
  const handleCancel = async (id) => {
    try {
      setUpdatingId(id);

      const updated = await cancelOrder(id, token);

      setOrders((prev) =>
        prev.map((order) =>
          order._id === id ? updated : order
        )
      );
    } catch (error) {
      console.log(error);
      alert(
        error?.response?.data?.message ||
          t("orders.errCancel")
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <HiOutlineExclamationCircle />;
      case "confirmed":
        return <HiOutlineCheckCircle />;
      case "shipped":
        return <HiOutlineTruck />;
      case "delivered":
        return <HiOutlineCheckCircle />;
      case "cancelled":
        return <HiOutlineXCircle />;
      default:
        return <HiOutlineClipboardList />;
    }
  };

  if (loading) {
    return (
      <div className="bb-orders-wrapper">
        <div className="bb-orders-container">
          <div className="bb-orders-header">
            <h1 className="bb-orders-title">{t("orders.title")}</h1>
            <p className="bb-orders-subtitle">{t("orders.subtitle")}</p>
          </div>

          <div className="bb-orders-loading">
            <div className="bb-skeleton bb-skeleton--card"></div>
            <div className="bb-skeleton bb-skeleton--card"></div>
            <div className="bb-skeleton bb-skeleton--card"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bb-orders-wrapper">
      <div className="bb-orders-container">
        <div className="bb-orders-header">
          <div className="bb-orders-header-top">
            <div className="bb-orders-icon">
              <HiOutlineClipboardList />
            </div>
            <div>
              <h1 className="bb-orders-title">{t("orders.title")}</h1>
              <p className="bb-orders-subtitle">
                {t("orders.subtitle")}
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="bb-orders-error">
            <HiOutlineExclamationCircle />
            <span>{error}</span>
          </div>
        )}

        {orders.length === 0 ? (
          <div className="bb-orders-empty">
            <div className="bb-orders-empty-icon">
              <HiOutlineShoppingBag />
            </div>
            <h2 className="bb-orders-empty-title">{t("orders.emptyTitle")}</h2>
            <p className="bb-orders-empty-text">
              {t("orders.emptyDesc")}
            </p>
            <Link to="/" className="bb-orders-empty-link">
              {t("orders.startShopping")}
            </Link>
          </div>
        ) : (
          <div className="bb-orders-list">
            {orders.map((order) => (
              <div
                key={order._id}
                className="bb-order-card"
              >
                <div className="bb-order-card-header">
                  <div className="bb-order-card-title-section">
                    <h3 className="bb-order-card-title">
                      {t("orders.orderId", { id: order._id.slice(-6).toUpperCase() })}
                    </h3>
                    <span className={`bb-order-status bb-order-status--${order.status}`}>
                      <span className="bb-order-status-icon">
                        {getStatusIcon(order.status)}
                      </span>
                      <span className="bb-order-status-text">
                        {t(`orders.status.${order.status}`)}
                      </span>
                    </span>
                  </div>
                  <div className="bb-order-card-price">
                    <span className="bb-order-price-label">{t("cart.total")}</span>
                    <span className="bb-order-price-value">
                      {order.totalPrice} {t("common.currency")}
                    </span>
                  </div>
                </div>

                <div className="bb-order-card-divider"></div>

                <div className="bb-order-card-items">
                  <h4 className="bb-order-items-title">{t("orders.itemsOrdered")}</h4>
                  <div className="bb-order-items-list">
                    {order.items.map((item, index) => (
                      <div key={index} className="bb-order-item">
                        <div className="bb-order-item-info">
                          <span className="bb-order-item-name">
                            {item.product?.name}
                          </span>
                          <span className="bb-order-item-qty">
                            {t("checkout.qty")}: {item.quantity}
                          </span>
                        </div>
                        {item.product?.price && (
                          <span className="bb-order-item-price">
                            {item.product.price * item.quantity} {t("common.currency")}
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bb-order-card-divider"></div>

                <div className="bb-order-card-footer">
                  {order.status !== "shipped" &&
                    order.status !== "delivered" &&
                    order.status !== "cancelled" && (
                      <button
                        onClick={() => handleCancel(order._id)}
                        disabled={updatingId === order._id}
                        className="bb-order-cancel-btn"
                      >
                        {updatingId === order._id
                          ? t("orders.cancelling")
                          : t("orders.cancelOrder")}
                      </button>
                    )}
                  {(order.status === "shipped" ||
                    order.status === "delivered") && (
                    <div className="bb-order-status-info">
                      <HiOutlineTruck className="bb-order-status-info-icon" />
                      <span>
                        {order.status === "shipped"
                          ? t("orders.statusShipped")
                          : t("orders.statusDelivered")}
                      </span>
                    </div>
                  )}
                  {order.status === "cancelled" && (
                    <div className="bb-order-status-info bb-order-status-info--cancelled">
                      <HiOutlineXCircle className="bb-order-status-info-icon" />
                      <span>{t("orders.statusCancelled")}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrdersPage;