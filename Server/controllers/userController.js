const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Company = require("../models/Company");

// GET PROFILE
const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);

  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE PROFILE
const updateUserProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name =
      req.body.name || user.name;

    user.email =
      req.body.email || user.email;

    // PASSWORD UPDATE
    if (req.body.password) {

      const hashedPassword =
        await bcrypt.hash(
          req.body.password,
          10
        );

      user.password =
        hashedPassword;
    }

    const updatedUser =
      await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      role: updatedUser.role,
    });

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};



module.exports = {
  getUserProfile,
  updateUserProfile,
};