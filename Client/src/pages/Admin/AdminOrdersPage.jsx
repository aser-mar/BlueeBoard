import {
  useEffect,
  useState,
} from "react";

import {
  useSelector,
} from "react-redux";

import {
  getOrders,
  updateOrderStatus,
} from "../../services/orderService";

const AdminOrdersPage =
  () => {

    const { token } =
      useSelector(
        (state) =>
          state.auth
      );

    const [orders, setOrders] =
      useState([]);

    const [loading, setLoading] =
      useState(true);

    const [error, setError] =
      useState("");

    const [
      updatingId,
      setUpdatingId,
    ] = useState(null);

    // FETCH ORDERS

    useEffect(() => {

      const loadOrders =
        async () => {

          try {

            const data =
              await getOrders(
                token
              );

            setOrders(
              data || []
            );

          } catch (error) {

            console.log(
              error
            );

            setError(
              "Failed to load orders"
            );

          } finally {

            setLoading(false);
          }
        };

      loadOrders();

    }, [token]);

    // UPDATE STATUS

    const handleStatusChange =
      async (
        id,
        status
      ) => {

        try {

          setUpdatingId(id);

          const updated =
            await updateOrderStatus(
              id,
              status,
              token
            );

          setOrders(
            (prev) =>
              prev.map(
                (order) =>
                  order._id ===
                  id
                    ? updated
                    : order
              )
          );

        } catch (error) {

          console.log(
            error
          );

          alert(
            "Failed to update order"
          );

        } finally {

          setUpdatingId(
            null
          );
        }
      };

    if (loading) {

      return (
        <h2
          style={{
            padding:
              "20px",
          }}
        >
          Loading Orders...
        </h2>
      );
    }

    return (

      <div
        style={{
          padding:
            "20px",
        }}
      >

        <h1>
          Admin Orders
        </h1>

        {
          error && (

            <p
              style={{
                color:
                  "red",
              }}
            >
              {error}
            </p>
          )
        }

        {
          orders.length ===
          0 ? (

            <h3>
              No Orders Found
            </h3>

          ) : (

            orders.map(
              (order) => (

                <div
                  key={
                    order._id
                  }

                  style={{
                    border:
                      "1px solid #ccc",

                    padding:
                      "15px",

                    marginBottom:
                      "20px",

                    borderRadius:
                      "10px",
                  }}
                >

                  {/* CUSTOMER */}

                  <h3>
                    Customer:
                    {" "}
                    {
                      order.customerName
                    }
                  </h3>

                  <p>
                    User Email:
                    {" "}
                    {
                      order.user
                        ?.email
                    }
                  </p>

                  <p>
                    Phone:
                    {" "}
                    {
                      order.phone
                    }
                  </p>

                  <p>
                    Address:
                    {" "}
                    {
                      order.address
                    }
                  </p>

                  {/* ITEMS */}

                  <div>

                    <h4>
                      Items:
                    </h4>

                    {
                      order.items.map(
                        (
                          item,
                          index
                        ) => (

                          <p
                            key={
                              index
                            }
                          >
                            {
                              item
                                .product
                                ?.name
                            }
                            {" "}
                            x
                            {" "}
                            {
                              item.quantity
                            }
                          </p>
                        )
                      )
                    }

                  </div>

                  {/* TOTAL */}

                  <h4>
                    Total:
                    {" "}
                    {
                      order.totalPrice
                    }
                    {" "}
                    EGP
                  </h4>

                  {/* STATUS */}

                  <p>
                    Status:
                    <strong>
                      {" "}
                      {
                        order.status
                      }
                    </strong>
                  </p>

                  {/* UPDATE STATUS */}

                  <select
                    value={
                      order.status
                    }

                    disabled={
                      updatingId ===
                      order._id
                    }

                    onChange={(
                      e
                    ) =>
                      handleStatusChange(
                        order._id,
                        e.target
                          .value
                      )
                    }
                  >

                    <option value="pending">
                      Pending
                    </option>

                    <option value="confirmed">
                      Confirmed
                    </option>

                    <option value="shipped">
                      Shipped
                    </option>

                    <option value="delivered">
                      Delivered
                    </option>

                    <option value="cancelled">
                      Cancelled
                    </option>

                  </select>

                  {
                    updatingId ===
                      order._id && (

                      <p>
                        Updating...
                      </p>
                    )
                  }

                </div>
              )
            )
          )
        }

      </div>
    );
  };

export default
AdminOrdersPage;

