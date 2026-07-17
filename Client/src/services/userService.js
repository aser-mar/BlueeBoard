import api from "./api";

const API = "/users";

// GET PROFILE
export const getProfile = async (token) => {
  const { data } = await api.get(`${API}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

// UPDATE PROFILE
export const updateProfile = async (payload, token) => {
  const { data } = await api.put(`${API}/profile`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};