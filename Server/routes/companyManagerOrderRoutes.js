const express = require("express");
const {
  getMyCompanyOrders,
  updateMyCompanyOrderStatus,
} = require("../controllers/companyManagerOrderController");
const {
  protect,
  companyManagerOnly,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, companyManagerOnly, getMyCompanyOrders);

router.put("/:id/status", protect, companyManagerOnly, updateMyCompanyOrderStatus);

module.exports = router;
