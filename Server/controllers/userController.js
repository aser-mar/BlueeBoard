const User = require("../models/User");
const bcrypt = require("bcryptjs");
const Company = require("../models/Company");
const { validatePassword } = require("../utils/passwordPolicy");

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
    const newPassword = req.body.newPassword ?? req.body.password;
    const currentPassword = req.body.currentPassword;

    if (newPassword) {
      if (!currentPassword) {
        return res.status(400).json({
          message: "Current password is required to change your password.",
        });
      }

      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);

      if (!isCurrentPasswordValid) {
        return res.status(400).json({
          message: "Current password is incorrect.",
        });
      }

      const passwordValidation = validatePassword(newPassword);

      if (!passwordValidation.valid) {
        return res.status(400).json({
          message: passwordValidation.message,
        });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
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