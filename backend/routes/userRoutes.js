const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const {
  getUserProfile,
  updateUserProfile,
  deleteMyAccount,
  getAdminUsers,
  updateUserByAdmin,
  deleteUser,
} = require("../controllers/userController");


const router = express.Router();

// Logged-in user routes
router.get("/profile", protect, getUserProfile);
router.put("/profile", protect, updateUserProfile);
router.delete("/me", protect, deleteMyAccount);

router.route("/:id")
  .put(protect, admin, updateUserByAdmin)
  .delete(protect, admin, deleteUser);

// Admin-only users listing (matches your frontend getAdminUsers call)
router.get("/admin-data", protect, admin, getAdminUsers);

module.exports = router;
