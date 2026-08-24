const express = require("express");
const {
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
} = require("../middleware/rateLimiter");

const {
  login,
  register,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  validateResetToken,
  resetPassword,
} = require("../controllers/authController");

const router = express.Router();

router.post(
  "/login",
  loginLimiter,
  login
);
router.post(
  "/register",
  registerLimiter,
  register
);

router.get(
  "/verify-email/:token",
  verifyEmail
);

router.post(
  "/resend-verification",
  resendVerificationEmail
);

router.post(
  "/forgot-password",
  forgotPasswordLimiter,
  forgotPassword
);

router.get(
  "/validate-reset-token/:token",
  validateResetToken
);

router.put(
  "/reset-password/:token",
  resetPassword
);

module.exports = router;