import api from "./api";

const API_URL =
"/banners";

export const getBanners =
async () => {

  const { data } =
    await api.get(
      API_URL
    );

  return data;
};

export const getBannerById =
async (id) => {

  const { data } =
    await api.get(
      `${API_URL}/${id}`
    );

  return data;
};

export const createBanner =
async (
  bannerData
) => {

  const { data } =
    await api.post(
      API_URL,
      bannerData
    );

  return data;
};

export const updateBanner =
async (
  id,
  bannerData
) => {

  const { data } =
    await api.put(
      `${API_URL}/${id}`,
      bannerData
    );

  return data;
};

export const deleteBanner =
async (
  id
) => {

  const { data } =
    await api.delete(
      `${API_URL}/${id}`
    );

  return data;
};