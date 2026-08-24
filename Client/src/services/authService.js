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

// VERIFY EMAIL
export const verifyEmail =
  async (token) => {

    const { data } =
      await api.get(
        `${API}/verify-email/${token}`
      );

    return data;
  };

// RESEND VERIFICATION EMAIL
export const resendVerificationEmail =
  async (userData) => {

    const { data } =
      await api.post(
        `${API}/resend-verification`,
        userData
      );

    return data;
  };

// FORGOT PASSWORD
export const forgotPassword =
  async (email) => {

    const { data } =
      await api.post(
        `${API}/forgot-password`,
        { email }
      );

    return data;
  };

// VALIDATE RESET TOKEN
export const validateResetToken =
  async (token) => {

    const { data } =
      await api.get(
        `${API}/validate-reset-token/${token}`
      );

    return data;
  };

// RESET PASSWORD
export const resetPassword =
  async (token, password) => {

    const { data } =
      await api.put(
        `${API}/reset-password/${token}`,
        { password }
      );

    return data;
  };