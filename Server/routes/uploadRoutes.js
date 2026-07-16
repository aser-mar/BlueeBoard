const express = require("express");
const multer = require("multer");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

/**
 * UPLOAD IMAGE
 */
router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        message: "No file received",
      });
    }

    const streamUpload = () => {
      return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { folder: "uploads" },
          (error, result) => {
            if (error) return reject(error);
            resolve(result);
          }
        );

        streamifier
          .createReadStream(req.file.buffer)
          .pipe(stream);
      });
    };

    const result = await streamUpload();

    return res.json({
      url: result.secure_url,
      public_id: result.public_id,
    });

  } catch (error) {
    console.log("UPLOAD ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
});

/**
 * DELETE IMAGE FROM CLOUDINARY
 */
router.post("/delete", async (req, res) => {
  try {
    const { publicId } = req.body;

    if (!publicId) {
      return res.status(400).json({
        message: "publicId is required",
      });
    }

    const result = await cloudinary.uploader.destroy(publicId);

    return res.json({
      success: true,
      result,
    });

  } catch (error) {
    console.log("DELETE ERROR:", error);

    return res.status(500).json({
      message: error.message,
    });
  }
});

module.exports = router;