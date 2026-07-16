const express = require("express");
const router = express.Router();

const {
  createCompanyManager,
  getCompanyManagers,
  deleteCompanyManager,
  getCompanyManagerById,
  updateCompanyManager,
} = require("../controllers/companyManagerController");

const { protect, adminOnly } = require("../middleware/authMiddleware");
const {
  createCompanyManagerValidators,
  updateCompanyManagerValidators,
} = require("../middleware/validators/companyManagerValidators");


router.post(
  "/",
  protect,
  adminOnly,
  createCompanyManagerValidators,
  createCompanyManager
);
router.get("/", protect, adminOnly, getCompanyManagers);
router.get("/:id", protect, adminOnly, getCompanyManagerById);
router.put(
  "/:id",
  protect,
  adminOnly,
  updateCompanyManagerValidators,
  updateCompanyManager
);
router.delete("/:id", protect, adminOnly, deleteCompanyManager);

module.exports = router;