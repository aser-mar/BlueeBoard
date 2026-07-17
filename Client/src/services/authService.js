import api from "./api";

const API = "/auth";

// LOGIN
export const loginUser =
  async (userData) => {

    const { data } =
      await api.post(
        `${API}/login`,
        userData
      );

    return data;
  };

// REGISTER
export const registerUser =
  async (userData) => {

    const { data } =
      await api.post(
        `${API}/register`,
        userData
      );

    return data;
  };