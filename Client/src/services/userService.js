import axios from "axios";

const API = "http://localhost:5000/api/users";

// GET PROFILE
export const getProfile = async (token) => {
  const { data } = await axios.get(`${API}/profile`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};

// UPDATE PROFILE
export const updateProfile = async (payload, token) => {
  const { data } = await axios.put(`${API}/profile`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return data;
};