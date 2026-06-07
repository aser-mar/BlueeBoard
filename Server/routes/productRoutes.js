const express = require("express");

const {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
} = require("../controllers/productController");

const router = express.Router();

// ⭐ FEATURED PRODUCTS
router.get(
  "/featured",
  getFeaturedProducts
);

// GET ALL PRODUCTS
router.get("/", getProducts);

// GET ONE PRODUCT
router.get("/:id", getProductById);

// CREATE PRODUCT
router.post("/", createProduct);

// UPDATE PRODUCT
router.put("/:id", updateProduct);

module.exports = router;