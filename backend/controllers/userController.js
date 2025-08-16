const User = require("../models/User");

// GET /api/users/profile
// @access Private
exports.getUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
};

// PUT /api/users/profile
// @access Private
// Accepts: { name?, email?, address?, currentPassword?, newPassword? }
exports.updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, email, address, currentPassword, newPassword } = req.body;

  if (email && email !== user.email) {
    const taken = await User.findOne({ email });
    if (taken) return res.status(400).json({ message: "Email already in use" });
    user.email = email;
  }

  if (name) user.name = name;
  if (typeof address !== "undefined") user.address = address; // safe even if not in schema

  // Password change (optional, but if requested, require currentPassword)
  if (newPassword) {
    if (!currentPassword) {
      return res.status(400).json({ message: "Current password required" });
    }
    const ok = await user.matchPassword(currentPassword);
    if (!ok) return res.status(400).json({ message: "Current password is incorrect" });
    user.password = newPassword; // hashed by pre-save hook
  }

  await user.save();
  const sanitized = await User.findById(user._id).select("-password");
  res.json(sanitized);
};

// DELETE /api/users/me
// @access Private
exports.deleteMyAccount = async (req, res) => {
  await User.deleteOne({ _id: req.user._id });
  // If later you add Enrollment documents, clean them up here.
  res.json({ message: "Account deleted" });
};

// GET /api/users/admin-data
// @access Admin
exports.getAdminUsers = async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ message: "Admin-only data", users });
};
