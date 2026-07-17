import api from "./api";

const API_URL = "/orders";

// CREATE ORDER
export const createOrder = async (orderData) => {
  const { data } = await api.post(API_URL, orderData);
  return data;
};

// GET USER ORDERS
export const getMyOrders = async () => {
  const { data } = await api.get(`${API_URL}/my-orders`);
  return data;
};

// GET ALL ORDERS
export const getOrders = async () => {
  const { data } = await api.get(API_URL);
  return data;
};

// UPDATE STATUS
export const updateOrderStatus = async (id, status) => {
  const { data } = await api.put(
    `${API_URL}/${id}/status`,
    { status }
  );

  return data;
};

// CANCEL ORDER
export const cancelOrder = async (id) => {
  const { data } = await api.put(
    `${API_URL}/${id}/cancel`,
    {}
  );

  return data;
};