import axios
from "axios";

const API_URL =
"http://localhost:5000/api/banners";

export const getBanners =
async () => {

  const { data } =
    await axios.get(
      API_URL
    );

  return data;
};

export const getBannerById =
async (id) => {

  const { data } =
    await axios.get(
      `${API_URL}/${id}`
    );

  return data;
};

export const createBanner =
async (
  bannerData,
  token
) => {

  const config = {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  };

  const { data } =
    await axios.post(
      API_URL,
      bannerData,
      config
    );

  return data;
};

export const updateBanner =
async (
  id,
  bannerData,
  token
) => {

  const config = {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  };

  const { data } =
    await axios.put(
      `${API_URL}/${id}`,
      bannerData,
      config
    );

  return data;
};

export const deleteBanner =
async (
  id,
  token
) => {

  const config = {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  };

  const { data } =
    await axios.delete(
      `${API_URL}/${id}`,
      config
    );

  return data;
};