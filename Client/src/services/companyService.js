import api from "./api";

const API_URL =
  "/companies";

// GET ALL
export const getCompanies =
  async () => {
    const response =
      await api.get(API_URL);

    return response.data;
  };

// GET BY ID
export const getCompanyById =
  async (id) => {
    const response =
      await api.get(
        `${API_URL}/${id}`
      );

    return response.data;
  };

// CREATE
export const createCompany =
  async (companyData) => {
    const response =
      await api.post(
        API_URL,
        companyData
      );

    return response.data;
  };

// UPDATE
export const updateCompany =
  async (id, companyData) => {
    const response =
      await api.put(
        `${API_URL}/${id}`,
        companyData
      );

    return response.data;
  };

// DELETE
export const deleteCompany =
  async (id) => {
    const response =
      await api.delete(
        `${API_URL}/${id}`
      );

    return response.data;
  };