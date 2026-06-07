import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import {
  getMyOrders,
  cancelOrder,
} from "../services/orderService";

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

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "orange";
      case "confirmed":
        return "blue";
      case "shipped":
        return "purple";
      case "delivered":
        return "green";
      case "cancelled":
        return "red";
      default:
        return "#333";
    }
  };

  if (loading) {
    return (
      <h2 style={{ padding: "20px" }}>
        Loading orders...
      </h2>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>My Orders</h1>

      {error && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {orders.length === 0 ? (
        <h3>You have no orders yet</h3>
      ) : (
        orders.map((order) => (
          <div
            key={order._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "15px",
              borderRadius: "10px",
              background: "#fff",
            }}
          >
            <h3>
              Order #{order._id.slice(-6)}
            </h3>

            <p>
              Total:{" "}
              <b>
                {order.totalPrice} EGP
              </b>
            </p>

            <p>
              Status:{" "}
              <b
                style={{
                  color: getStatusColor(
                    order.status
                  ),
                }}
              >
                {order.status}
              </b>
            </p>

            <h4>Items:</h4>

            {order.items.map(
              (item, index) => (
                <p key={index}>
                  {item.product?.name} x{" "}
                  {item.quantity}
                </p>
              )
            )}

            {/* CANCEL BUTTON */}
            {order.status !== "shipped" &&
              order.status !== "delivered" &&
              order.status !== "cancelled" && (
                <button
                  onClick={() =>
                    handleCancel(
                      order._id
                    )
                  }
                  disabled={
                    updatingId ===
                    order._id
                  }
                  style={{
                    marginTop: "10px",
                    padding: "8px 12px",
                    background:
                      updatingId ===
                      order._id
                        ? "#999"
                        : "red",
                    color: "white",
                    border: "none",
                    borderRadius:
                      "6px",
                    cursor:
                      updatingId ===
                      order._id
                        ? "not-allowed"
                        : "pointer",
                  }}
                >
                  {updatingId ===
                  order._id
                    ? "Cancelling..."
                    : "Cancel Order"}
                </button>
              )}
          </div>
        ))
      )}
    </div>
  );
};

export default MyOrdersPage;