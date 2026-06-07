import axios from "axios";

const API =
  "http://localhost:5000/api/categories";

// GET
export const getCategories =
  async () => {

    const { data } =
      await axios.get(API);

    return data;
  };

// UPDATE
export const updateCategory =
  async (
    id,
    categoryData
  ) => {

    const { data } =
      await axios.put(
        `${API}/${id}`,
        categoryData
      );

    return data;
  };