const User = require("../models/User");
const asyncHandler = require("express-async-handler");

// GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
});

// PUT /api/users/profile
// @access Private
// Accepts: { name?, email?, address?, currentPassword?, newPassword? }
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  const { name, email, address, currentPassword, newPassword } = req.body;

  if (email && email !== user.email) {
    const taken = await User.findOne({ email });
    if (taken) {
      res.status(400);
      throw new Error("Email already in use");
    }
    user.email = email;
  }

  if (name) user.name = name;
  if (typeof address !== "undefined") user.address = address;

  if (newPassword) {
    if (!currentPassword) {
      res.status(400);
      throw new Error("Current password required");
    }
    const ok = await user.matchPassword(currentPassword);
    if (!ok) {
      res.status(400);
      throw new Error("Current password is incorrect");
    }
    user.password = newPassword; // pre-save hook hashes
  }

  await user.save();
  const sanitized = await User.findById(user._id).select("-password");
  res.json(sanitized);
});

// DELETE /api/users/me
// @access Private
const deleteMyAccount = asyncHandler(async (req, res) => {
  await User.deleteOne({ _id: req.user._id });
  res.json({ message: "Account deleted" });
});

// GET /api/users/admin-data
// @access Admin
const getAdminUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json({ users });
});

// DELETE /api/users/:id
// @access Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// PUT /api/users/:id
// @access Admin
const updateUserByAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.address = req.body.address || user.address;
    user.isAdmin = req.body.isAdmin ?? user.isAdmin;

    const updatedUser = await user.save();
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      address: updatedUser.address,
      isAdmin: updatedUser.isAdmin,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  getUserProfile,
  updateUserProfile,
  deleteMyAccount,
  getAdminUsers,
  updateUserByAdmin,
  deleteUser,
};
