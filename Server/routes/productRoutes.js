const express = require("express");

const {
  getProducts,
  getFeaturedProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");
const {
  productValidators,
} = require("../middleware/validators/productValidators");

const router = express.Router();

// FEATURED PRODUCTS
router.get(
  "/featured",
  getFeaturedProducts
);

// GET ALL PRODUCTS
router.get("/", getProducts);

// GET ONE PRODUCT
router.get("/:id", getProductById);

// CREATE PRODUCT
router.post("/", protect, productValidators, createProduct);

// UPDATE PRODUCT
router.put("/:id", protect, productValidators, updateProduct);

// DELETE PRODUCT
router.delete("/:id",  protect,adminOnly,deleteProduct);

module.exports = router;