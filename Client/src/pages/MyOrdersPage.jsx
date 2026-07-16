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

import "./MyOrdersPage.css";

const MyOrdersPage = () => {
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
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchOrders();
    }
  }, [token]);

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
          "Failed to cancel order"
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
            <h1 className="bb-orders-title">My Orders</h1>
            <p className="bb-orders-subtitle">Track and manage your purchases</p>
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
              <h1 className="bb-orders-title">My Orders</h1>
              <p className="bb-orders-subtitle">
                Track and manage your purchases
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
            <h2 className="bb-orders-empty-title">No Orders Yet</h2>
            <p className="bb-orders-empty-text">
              Start shopping and your orders will appear here. Explore our collection of premium products from trusted companies.
            </p>
            <Link to="/" className="bb-orders-empty-link">
              Start Shopping
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
                      Order #{order._id.slice(-6).toUpperCase()}
                    </h3>
                    <span className={`bb-order-status bb-order-status--${order.status}`}>
                      <span className="bb-order-status-icon">
                        {getStatusIcon(order.status)}
                      </span>
                      <span className="bb-order-status-text">
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </span>
                  </div>
                  <div className="bb-order-card-price">
                    <span className="bb-order-price-label">Total</span>
                    <span className="bb-order-price-value">
                      {order.totalPrice} EGP
                    </span>
                  </div>
                </div>

                <div className="bb-order-card-divider"></div>

                <div className="bb-order-card-items">
                  <h4 className="bb-order-items-title">Items Ordered</h4>
                  <div className="bb-order-items-list">
                    {order.items.map((item, index) => (
                      <div key={index} className="bb-order-item">
                        <div className="bb-order-item-info">
                          <span className="bb-order-item-name">
                            {item.product?.name}
                          </span>
                          <span className="bb-order-item-qty">
                            Qty: {item.quantity}
                          </span>
                        </div>
                        {item.product?.price && (
                          <span className="bb-order-item-price">
                            {item.product.price * item.quantity} EGP
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
                          ? "Cancelling..."
                          : "Cancel Order"}
                      </button>
                    )}
                  {(order.status === "shipped" ||
                    order.status === "delivered") && (
                    <div className="bb-order-status-info">
                      <HiOutlineTruck className="bb-order-status-info-icon" />
                      <span>
                        {order.status === "shipped"
                          ? "On its way to you"
                          : "Delivered"}
                      </span>
                    </div>
                  )}
                  {order.status === "cancelled" && (
                    <div className="bb-order-status-info bb-order-status-info--cancelled">
                      <HiOutlineXCircle className="bb-order-status-info-icon" />
                      <span>Order Cancelled</span>
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