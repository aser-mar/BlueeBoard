const express = require("express");

const {
  createCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

const {
  protect,
  adminOnly,
} = require("../middleware/authMiddleware");
const {
  categoryValidators,
} = require("../middleware/validators/categoryValidators");

const router = express.Router();

// PUBLIC
router.get(
  "/",
  getCategories
);

// ADMIN
router.post(
  "/",
  protect,
  adminOnly,
  categoryValidators,
  createCategory
);

router.put(
  "/:id",
  protect,
  adminOnly,
  categoryValidators,
  updateCategory
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteCategory
);

module.exports = router;