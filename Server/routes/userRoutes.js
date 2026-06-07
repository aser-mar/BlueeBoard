const express = require("express");
const router = express.Router();

const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/userController");

const { protect } = require("../middleware/authMiddleware");

// PROFILE
router.get("/profile", protect, getUserProfile);

// UPDATE PROFILE
router.put("/profile", protect, updateUserProfile);

module.exports = router;