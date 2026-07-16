import axios from "axios";

/**
 * UPLOAD IMAGE TO CLOUDINARY
 * returns: { url, public_id }
 */
export const uploadImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append("image", file);

    const { data } = await axios.post(
      "http://localhost:5000/api/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return data; // { url, public_id }
  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    throw error;
  }
};

/**
 * DELETE IMAGE FROM CLOUDINARY
 */
export const deleteImage = async (publicId) => {
  if (!publicId) return;

  try {
    const { data } = await axios.post(
      "http://localhost:5000/api/upload/delete",
      {
        publicId,
      }
    );

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};