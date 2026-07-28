import api from "./api";

const API_URL = "/company-manager/orders";

export const getMyCompanyOrders = async () => {
  const { data } = await api.get(API_URL);
  return data;
};

export const updateMyCompanyOrderStatus = async (id, status) => {
  const { data } = await api.put(`${API_URL}/${id}/status`, { status });
  return data;
};
