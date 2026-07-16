import axios from "axios";
import api from "./api";

const API_URL =
  "http://localhost:5000/api/products";

// GET ALL PRODUCTS
export const getProducts =
  async (params = {}) => {

    const { data } =
      await axios.get(
        API_URL,
        {
          params,
        }
      );

    return data;
  };

// ⭐ GET FEATURED PRODUCTS
export const getFeaturedProducts =
  async () => {

    const { data } =
      await axios.get(
        `${API_URL}/featured`
      );

    return data;
  };

// GET PRODUCT BY ID
export const getProductById =
  async (id) => {

    const { data } =
      await axios.get(
        `${API_URL}/${id}`
      );

    return data;
  };

// CREATE PRODUCT
export const createProduct = async (productData) => {

  const { data } = await api.post(
    "/products",
    productData
  );

  return data;
};

// UPDATE PRODUCT
export const updateProduct = async (
  id,
  productData
) => {

  const { data } = await api.put(
  `/products/${id}`,
  productData
);

return data;
};

// DELETE PRODUCT
export const deleteProduct = async (
id
) => {

  const { data } = await api.delete(
  `/products/${id}`
);

return data;
};