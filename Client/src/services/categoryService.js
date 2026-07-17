import api from "./api";

const API = "/categories";

// GET
export const getCategories =
  async (companyId) => {

    const { data } =
      await api.get(API, {
        params: {
          company: companyId,
        },
      });

    return data;
  };

// UPDATE
export const updateCategory =
  async (
    id,
    categoryData
  ) => {

   const { data } =
    await api.put(
      `${API}/${id}`,
      categoryData
    );

    return data;
  };