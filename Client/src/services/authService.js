import axios from "axios";

const API =
  "http://localhost:5000/api/auth";

// LOGIN
export const loginUser =
  async (userData) => {

    const { data } =
      await axios.post(
        `${API}/login`,
        userData
      );

    return data;
  };

// REGISTER
export const registerUser =
  async (userData) => {

    const { data } =
      await axios.post(
        `${API}/register`,
        userData
      );

    return data;
  };