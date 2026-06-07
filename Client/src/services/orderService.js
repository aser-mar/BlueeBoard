import axios from "axios";

const API_URL =
  "http://localhost:5000/api/orders";

// CREATE ORDER
export const createOrder =
  async (
    orderData,
    token
  ) => {

    const { data } =
      await axios.post(
        API_URL,
        orderData,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
  };

// GET USER ORDERS
export const getMyOrders =
  async (token) => {

    const { data } =
      await axios.get(
        `${API_URL}/my-orders`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
  };

// GET ALL ORDERS
export const getOrders =
  async (token) => {

    const { data } =
      await axios.get(
        API_URL,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
  };

// UPDATE STATUS
export const updateOrderStatus =
  async (
    id,
    status,
    token
  ) => {

    const { data } =
      await axios.put(
        `${API_URL}/${id}/status`,
        { status },
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

    return data;
  };

  // CANCEL ORDER
  export const cancelOrder = async (id, token) => {
  const { data } = await axios.put(
    `http://localhost:5000/api/orders/${id}/cancel`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return data;
};