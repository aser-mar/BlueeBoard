const express =
  require("express");

const {
  createCompany,
  getCompanies,
  getCompanyById,
  deleteCompany,
  updateCompany,
} = require(
  "../controllers/companyController"
);

const {
  protect,
  adminOnly,
} = require(
  "../middleware/authMiddleware"
);

const router =
  express.Router();

router.post(
  "/",
  protect,
  adminOnly,
  createCompany
);

router.get(
  "/",
  getCompanies
);

router.get(
  "/:id",
  getCompanyById
);

router.delete(
  "/:id",
  protect,
  adminOnly,
  deleteCompany
);

router.put(
  "/:id",
  protect,
  adminOnly,
  updateCompany
);

module.exports = router;