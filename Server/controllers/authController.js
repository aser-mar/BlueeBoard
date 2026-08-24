const User = require("../models/User");

const bcrypt = require("bcryptjs");

const crypto = require("crypto");

const jwt = require("jsonwebtoken");

const sendEmail = require("../utils/sendEmail");
const { validatePassword } = require("../utils/passwordPolicy");

const generateVerificationToken = () => {
  return {
    verificationToken: crypto.randomBytes(32).toString("hex"),
    verificationTokenExpires: new Date(Date.now() + 24 * 60 * 60 * 1000),
  };
};

const sendVerificationEmail = async (user, verificationToken) => {
  const verifyUrl = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  await sendEmail({
    to: user.email,
    subject: "Verify your BlueeBoard account",
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #f6f8fb; padding: 40px 20px;">
        <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);">
          <div style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 28px 24px 20px; text-align: center;">
            <img src="https://blueeboard.com/web-app-manifest-512x512.png" alt="BlueeBoard" width="56" height="56" style="display: inline-block; border-radius: 12px; margin-bottom: 12px; border: 1px solid #dfe7ee; background: #ffffff;" />
            <h1 style="color: #0f172a; font-size: 22px; margin: 0; font-weight: 800; letter-spacing: -0.4px;">BlueeBoard</h1>
          </div>

          <div style="padding: 32px 28px;">
            <h2 style="color: #0f172a; font-size: 20px; margin: 0 0 12px; line-height: 1.4;">Welcome, ${user.name}!</h2>
            <p style="color: #475569; font-size: 14px; line-height: 1.7; margin: 0 0 24px;">
              Thanks for creating an account with BlueeBoard. Please confirm your email address to activate your account and start exploring.
            </p>

            <div style="text-align: center; margin: 28px 0;">
              <a href="${verifyUrl}" style="display: inline-block; background: #0f766e; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 14px; box-shadow: 0 8px 18px rgba(15, 118, 110, 0.16);">
                Verify My Email
              </a>
            </div>

            <p style="color: #64748b; font-size: 12px; line-height: 1.7; margin: 24px 0 0;">
              If the button above doesn't work, copy and paste this link into your browser:<br />
              <a href="${verifyUrl}" style="color: #0f766e; word-break: break-all; font-weight: 600;">${verifyUrl}</a>
            </p>

            <p style="color: #64748b; font-size: 12px; line-height: 1.7; margin: 16px 0 0;">
              Didn't create this account? You can safely ignore this email.
            </p>
          </div>
        </div>

        <p style="text-align: center; color: #64748b; font-size: 11px; margin-top: 20px; letter-spacing: 0.02em;">
          © ${new Date().getFullYear()} BlueeBoard. All rights reserved.
        </p>
      </div>
    `,
  });
};

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

    if (!user.isVerified && user.verificationToken) {
      return res.status(403).json({
        message: "Please verify your email before logging in.",
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

    const passwordValidation = validatePassword(password);

    if (!passwordValidation.valid) {
      return res.status(400).json({
        message: passwordValidation.message,
      });
    }

    const hashedPassword =
      await bcrypt.hash(
        password,
        10
      );

    const { verificationToken, verificationTokenExpires } = generateVerificationToken();

    const user =
      await User.create({
        name,
        email,
        password:
          hashedPassword,
        role: "user",
        isVerified: false,
        verificationToken,
        verificationTokenExpires,
      });

    await sendVerificationEmail(user, verificationToken);

    res.status(201).json({
      message:
        "Registration successful. Please check your email to verify your account.",
    });

  } catch (error) {

    res.status(500).json({
      message:
        error.message,
    });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).json({
        message: "Invalid verification link.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Your account is already verified.",
      });
    }

    const hasExpired = user.verificationTokenExpires
      ? new Date(user.verificationTokenExpires) < new Date()
      : false;

    if (hasExpired) {
      return res.status(400).json({
        message: "This verification link has expired. Please request a new verification email.",
      });
    }

    user.isVerified = true;
    user.verificationToken = null;
    user.verificationTokenExpires = null;
    await user.save();

    res.json({
      message: "Email verified successfully. You can now log in.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const resendVerificationEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    if (user.isVerified) {
      return res.status(400).json({
        message: "Your account is already verified.",
      });
    }

    const cooldownMs = 60 * 1000;
    const now = Date.now();
    const lastSentAt = user.verificationSentAt ? new Date(user.verificationSentAt).getTime() : 0;

    if (lastSentAt && now - lastSentAt < cooldownMs) {
      return res.status(429).json({
        message: "Please wait before requesting another verification email.",
      });
    }

    const { verificationToken, verificationTokenExpires } = generateVerificationToken();

    user.verificationToken = verificationToken;
    user.verificationTokenExpires = verificationTokenExpires;
    user.verificationSentAt = new Date();
    await user.save();

    await sendVerificationEmail(user, verificationToken);

    res.json({
      message: "A new verification email has been sent successfully.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        message: "If an account with that email exists, a password reset link has been sent.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetExpires = Date.now() + 60 * 60 * 1000;

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetExpires;
    await user.save();

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: user.email,
      subject: "Reset your BlueeBoard password",
      html: `
        <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; background: #f6f8fb; padding: 40px 20px;">
          <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 18px; overflow: hidden; box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);">
            <div style="background: #f8fafc; border-bottom: 1px solid #e2e8f0; padding: 28px 24px 20px; text-align: center;">
              <img src="https://blueeboard.com/web-app-manifest-512x512.png" alt="BlueeBoard" width="56" height="56" style="display: inline-block; border-radius: 12px; margin-bottom: 12px; border: 1px solid #dfe7ee; background: #ffffff;" />
              <h1 style="color: #0f172a; font-size: 22px; margin: 0; font-weight: 800; letter-spacing: -0.4px;">BlueeBoard</h1>
            </div>

            <div style="padding: 32px 28px;">
              <h2 style="color: #0f172a; font-size: 20px; margin: 0 0 12px; line-height: 1.4;">Reset your password</h2>
              <p style="color: #475569; font-size: 14px; line-height: 1.7; margin: 0 0 20px;">
                We received a request to reset your BlueeBoard password. Click the button below to choose a new one.
              </p>

              <div style="background: #f8fafc; border: 1px solid #dfe7ee; border-radius: 10px; padding: 12px 16px; margin-bottom: 24px;">
                <p style="color: #0f172a; font-size: 13px; margin: 0; font-weight: 600; line-height: 1.6;">
                  ⏰ This link will expire in 1 hour for your security.
                </p>
              </div>

              <div style="text-align: center; margin: 28px 0;">
                <a href="${resetUrl}" style="display: inline-block; background: #0f766e; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 14px; box-shadow: 0 8px 18px rgba(15, 118, 110, 0.16);">
                  Reset My Password
                </a>
              </div>

              <p style="color: #64748b; font-size: 12px; line-height: 1.7; margin: 24px 0 0;">
                If the button above doesn't work, copy and paste this link into your browser:<br />
                <a href="${resetUrl}" style="color: #0f766e; word-break: break-all; font-weight: 600;">${resetUrl}</a>
              </p>

              <p style="color: #64748b; font-size: 12px; line-height: 1.7; margin: 16px 0 0;">
                Didn't request this? You can safely ignore this email — your password will remain unchanged.
              </p>
            </div>
          </div>

          <p style="text-align: center; color: #64748b; font-size: 11px; margin-top: 20px; letter-spacing: 0.02em;">
            © ${new Date().getFullYear()} BlueeBoard. All rights reserved.
          </p>
        </div>
      `,
    });

    res.json({
      message: "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const validateResetToken = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "This reset link is invalid or has expired. Please request a new one.",
      });
    }

    res.status(200).json({
      message: "Reset token is valid.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        message: "This reset link is invalid or has expired. Please request a new one.",
      });
    }

    const passwordValidation = validatePassword(password);

    if (!passwordValidation.valid) {
      return res.status(400).json({
        message: passwordValidation.message,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    res.json({
      message: "Password reset successfully. You can now log in with your new password.",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = {
  login,
  register,
  verifyEmail,
  resendVerificationEmail,
  forgotPassword,
  validateResetToken,
  resetPassword,
};