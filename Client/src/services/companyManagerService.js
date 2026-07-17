import api from "./api";

const API_URL = "/company-managers";

// GET
export const getCompanyManagers = async () => {
  const { data } = await api.get(API_URL);  
  return data;
};

// CREATE
export const createCompanyManager = async (managerData) => {
  const { data } = await api.post(API_URL, managerData);
  return data;
};

// GET BY ID
export const getCompanyManagerById = async (id) => {
  const { data } = await api.get(`${API_URL}/${id}`);
  return data;
};

// UPDATE
export const updateCompanyManager = async (id, managerData) => {
  const { data } = await api.put(`${API_URL}/${id}`, managerData);
  return data;
};

// DELETE
export const deleteCompanyManager = async (id) => {
  const { data } = await api.delete(`${API_URL}/${id}`);
  return data;
};