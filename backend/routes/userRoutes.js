const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const User = require("../models/User");

const router = express.Router();

// Logged-in user route
router.get("/profile", protect, (req, res) => {
  res.json({
    message: "User profile data",
    user: req.user
  });
});

// Admin-only route
router.get("/admin-data", protect, admin, async (req, res) => {
  const users = await User.find().select("-password");
  res.json({
    message: "Admin-only data",
    users
  });
});

module.exports = router;
