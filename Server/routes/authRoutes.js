const express = require("express");

const {
  login,
  register,
} = require("../controllers/authController");

console.log(login);
console.log(register);

const router = express.Router();

router.post("/login", login);
router.post("/register", register);

module.exports = router;