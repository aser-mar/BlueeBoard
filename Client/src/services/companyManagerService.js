import axios from "axios";

const API_URL = "http://localhost:5000/api/company-managers";

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

// GET
export const getCompanyManagers = async () => {
  const { data } = await axios.get(API_URL, getConfig());
  return data;
};

// CREATE
export const createCompanyManager = async (managerData) => {
  const { data } = await axios.post(
    API_URL,
    managerData,
    getConfig()
  );

  return data;
};

// GET BY ID
export const getCompanyManagerById = async (id) => {
  const { data } = await axios.get(`${API_URL}/${id}`, getConfig());
  return data;
};

// UPDATE
export const updateCompanyManager = async (id, managerData) => {
  const { data } = await axios.put(`${API_URL}/${id}`, managerData, getConfig());
  return data;
};

// DELETE
export const deleteCompanyManager = async (id) => {
  const { data } = await axios.delete(
    `${API_URL}/${id}`,
    getConfig()
  );

  return data;
};