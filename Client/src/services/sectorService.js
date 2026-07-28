import api from "./api";

const API = "/sectors";

// GET
export const getSectors =
  async () => {
    const { data } =
      await api.get(API);
    return data;
  };

// CREATE
export const createSector =
  async (sectorData) => {
    const { data } =
      await api.post(
        API,
        sectorData
      );
    return data;
  };

// UPDATE
export const updateSector =
  async (
    id,
    sectorData
  ) => {
   const { data } =
    await api.put(
      `${API}/${id}`,
      sectorData
    );
    return data;
  };

// DELETE
export const deleteSector =
  async (id) => {
    const { data } =
      await api.delete(
        `${API}/${id}`
      );
    return data;
  };
