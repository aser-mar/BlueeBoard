const express = require("express");
const {
  getMyCompanyProducts,
  getMyCompanyProductById,
  createMyCompanyProduct,
  updateMyCompanyProduct,
  deleteMyCompanyProduct,
} = require("../controllers/companyManagerProductController");
const {
  protect,
  companyManagerOnly,
} = require("../middleware/authMiddleware");

const {
  productValidators,
  updateProductValidators,
} = require("../middleware/validators/productValidators");

const router = express.Router();

router.get(
  "/",
  protect,
  companyManagerOnly,
  getMyCompanyProducts
);

router.get(
  "/:id",
  protect,
  companyManagerOnly,
  getMyCompanyProductById
);

router.post(
  "/",
  protect,
  companyManagerOnly,
  productValidators,
  createMyCompanyProduct
);

router.put(
  "/:id",
  protect,
  companyManagerOnly,
  updateProductValidators,
  updateMyCompanyProduct
);

router.delete(
  "/:id",
  protect,
  companyManagerOnly,
  deleteMyCompanyProduct
);

module.exports = router;