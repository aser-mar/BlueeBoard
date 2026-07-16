const cloudinary = require("../config/cloudinary");

const deleteImage = async (publicId) => {

  if (!publicId) return;

  try {

    await cloudinary.uploader.destroy(publicId);

  } catch (error) {

    console.log(
      "Cloudinary delete error:",
      error.message
    );

  }

};

module.exports = {
  deleteImage,
};