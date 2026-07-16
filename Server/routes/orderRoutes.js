const express =
  require("express");

const {
  createOrder,
  getOrders,
  getMyOrders,
  updateOrderStatus,
  cancelOrder,
} = require(
  "../controllers/orderController"
);

const {
  protect,
  adminOnly,
} = require(
  "../middleware/authMiddleware"
);
const {
  orderValidators,
} = require("../middleware/validators/orderValidators");

const router =
  express.Router();

// CREATE ORDER
router.post(
  "/",
  protect,
  orderValidators,
  createOrder
);

// USER ORDERS
router.get(
  "/my-orders",
  protect,
  getMyOrders
);

// ADMIN ORDERS
router.get(
  "/",
  protect,
  adminOnly,
  getOrders
);

// UPDATE STATUS
router.put(
  "/:id/status",
  protect,
  adminOnly,
  updateOrderStatus
);

router.put(
  "/:id/cancel",
  protect,
  cancelOrder
);

module.exports =
  router;