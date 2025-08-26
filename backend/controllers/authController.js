const User = require("../models/User");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

// Helper: generate JWT token with role info
const generateToken = (id, isAdmin) => {
  console.log("[generateToken] creating token for:", { id, isAdmin });
  return jwt.sign({ id, isAdmin }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc   Register new user
// @route  POST /api/auth/register
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  console.log("[registerUser] incoming:", { name, email });

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      console.warn("[registerUser] user already exists:", email);
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({ name, email, password, isAdmin: false });
    console.log("[registerUser] new user created:", user._id);

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        token: generateToken(user._id, user.isAdmin)
      });
    } else {
      console.error("[registerUser] invalid user data");
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    console.error("[registerUser] error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc   Login user
// @route  POST /api/auth/login
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  console.log("[loginUser] attempt:", { email });

  try {
    const user = await User.findOne({ email });
    console.log("[loginUser] user found:", !!user);

    if (user) {
      const passwordMatch = await user.matchPassword(password);
      console.log("[loginUser] password match:", passwordMatch);

      if (passwordMatch) {
        return res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          isAdmin: user.isAdmin,
          token: generateToken(user._id, user.isAdmin)
        });
      }
    }

    console.warn("[loginUser] invalid credentials:", { email });
    res.status(401).json({ message: "Invalid email or password" });
  } catch (error) {
    console.error("[loginUser] error:", error);
    res.status(500).json({ message: error.message });
  }
};

// @desc   Forgot password
// @route  POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  console.log("[forgotPassword] request:", email);

  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.warn("[forgotPassword] no account for:", email);
      return res.status(200).json({
        message: "If an account exists, you will receive a password reset email."
      });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save();
    console.log("[forgotPassword] resetToken generated for user:", user._id);

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    console.log("[forgotPassword] resetUrl:", resetUrl);

    const message = `
      <h1>Password Reset Request</h1>
      <p>You requested to reset your password. Click the link below to set a new password:</p>
      <a href="${resetUrl}" target="_blank">Reset Password</a>
      <p>This link will expire in 10 minutes.</p>
    `;

    await sendEmail({
      email: user.email,
      subject: "Password Reset - Online Learning Platform",
      message
    });

    console.log("[forgotPassword] reset email sent:", user.email);
    res.json({ message: "If an account exists, you will receive a password reset email." });

  } catch (error) {
    console.error("[forgotPassword] error:", error);
    res.status(500).json({ message: "Email could not be sent" });
  }
};

// @desc   Reset password
// @route  PUT /api/auth/reset-password/:token
const resetPassword = async (req, res) => {
  console.log("[resetPassword] token param:", req.params.token);

  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");

  console.log("[resetPassword] hashed token:", resetPasswordToken);

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() }
    });

    console.log("[resetPassword] user found:", !!user);

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    console.log("[resetPassword] password reset successful for user:", user._id);
    res.json({ message: "Password reset successful" });
  } catch (error) {
    console.error("[resetPassword] error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, loginUser, forgotPassword, resetPassword };
