import axios from "axios";

const API_URL =
  "http://localhost:5000/api/companies";

export const getCompanies =
  async () => {

    const response =
      await axios.get(API_URL);

    return response.data;
};

export const getCompanyById =
  async (id) => {

    const response =
      await axios.get(
        `${API_URL}/${id}`
      );

    return response.data;
};

export const createCompany =
  async (companyData) => {

    const userInfo = JSON.parse(
      localStorage.getItem(
        "persist:root"
      )
    );

    const user = JSON.parse(
      userInfo.auth
    );

    const token =
      user.userInfo.token;

    const config = {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    };

    const response =
      await axios.post(
        API_URL,
        companyData,
        config
      );

    return response.data;
};

export const deleteCompany =
  async (id) => {

    const userInfo = JSON.parse(
      localStorage.getItem(
        "persist:root"
      )
    );

    const user = JSON.parse(
      userInfo.auth
    );

    const token =
      user.userInfo.token;

    const config = {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    };

    const response =
      await axios.delete(
        `${API_URL}/${id}`,
        config
      );

    return response.data;
};

export const updateCompany =
  async (id, companyData) => {

    const userInfo = JSON.parse(
      localStorage.getItem(
        "persist:root"
      )
    );

    const user = JSON.parse(
      userInfo.auth
    );

    const token =
      user.userInfo.token;

    const config = {
      headers: {
        Authorization:
          `Bearer ${token}`,
      },
    };

    const response =
      await axios.put(
        `${API_URL}/${id}`,
        companyData,
        config
      );

    return response.data;
};