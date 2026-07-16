import api from "./api";

const API_URL = "/company-manager/products";

export const getMyCompanyProducts = async () => {
  const { data } = await api.get(API_URL);

  return data;
};

export const getMyCompanyProductById =
  async (id) => {

    const { data } =
      await api.get(
        `${API_URL}/${id}`
      );

    return data;
  };

export const createMyCompanyProduct =
  async (productData) => {

    const { data } =
      await api.post(
        API_URL,
        productData
      );

    return data;
  };

export const updateMyCompanyProduct =
  async (
    id,
    productData
  ) => {

    const { data } =
      await api.put(
        `${API_URL}/${id}`,
        productData
      );

    return data;
  };

export const deleteMyCompanyProduct =
  async (id) => {

    const { data } = await api.delete(
      `${API_URL}/${id}`
    );

    return data;
  };