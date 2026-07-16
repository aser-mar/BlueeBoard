const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

// GENERATE TOKEN
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
      company: user.company,
    },

    process.env.JWT_SECRET,

    {
      expiresIn: "7d",
    }
  );
};

// LOGIN
const login = async (req, res) => {

  try {

    const { email, password } =
      req.body;

    const user =
      await User.findOne({
        email,
      });

    if (!user) {

      return res
        .status(401)
        .json({
          message:
            "Invalid credentials",
        });
    }

    const isMatch =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!isMatch) {

      return res
        .status(401)
        .json({
          message:
            "Invalid credentials",
        });
    }

    const token =
      generateToken(user);

    res.json({
      message:
        "Login successful",

      userInfo: {
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,

  company: user.company,

  isAdmin:
    user.role === "admin",

  isCompanyManager:
    user.role === "companyManager",
},

      token,
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });
  }
};

// REGISTER
const register = async (req, res) => {

  try {

    const {
      name,
      email,
      password,
    } = req.body;

    const existUser =
      await User.findOne({
        email,
      });

    if (existUser) {

      return res
        .status(400)
        .json({
          message:
            "User already exists",
        });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const user =
      await User.create({
        name,
        email,
        password:
          hashedPassword,
        role: "user",
      });

    const token =
      generateToken(user);

    res.status(201).json({
      message:
        "User created",

      userInfo: {
  _id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,

  company: user.company,

  isAdmin:
    user.role === "admin",

  isCompanyManager:
    user.role === "companyManager",
},

      token,
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });
  }
};

module.exports = {
  login,
  register,
};