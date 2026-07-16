const express = require("express");
const {
  loginLimiter,
} = require("../middleware/rateLimiter");

const {
  login,
  register,
} = require("../controllers/authController");


const router = express.Router();

router.post(
  "/login",
  loginLimiter,
  login
);
router.post("/register", register);

module.exports = router;