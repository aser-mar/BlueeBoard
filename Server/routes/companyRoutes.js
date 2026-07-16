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
const {
  companyValidators,
} = require("../middleware/validators/companyValidators");

const router =
  express.Router();

router.post(
  "/",
  protect,
  adminOnly,
  companyValidators,
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
  companyValidators,
  updateCompany
);

module.exports = router;