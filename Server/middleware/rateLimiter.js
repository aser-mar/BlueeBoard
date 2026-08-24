const rateLimit = require("express-rate-limit");

// General API limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message: "Too many requests. Please try again later.",
  },
});

// Login limiter
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes

  max: 15,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message:
      "Too many login attempts. Try again in 15 minutes.",
  },
});

// Register limiter
const registerLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message:
      "Too many registration attempts. Try again in 15 minutes.",
  },
});

// Forgot password limiter
const forgotPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes

  max: 5,

  standardHeaders: true,
  legacyHeaders: false,

  message: {
    message:
      "Too many password reset requests. Please try again in 15 minutes.",
  },
});

module.exports = {
  apiLimiter,
  loginLimiter,
  registerLimiter,
  forgotPasswordLimiter,
};