// routes/adminRoutes.js
const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");
const {
  createCourse,
  updateCourse,
  deleteCourse,
  getAllEnrollments,
  getAdminAnalytics,
} = require("../controllers/courseController");
const {
  getAdminUsers,
  updateUserByAdmin,
  deleteUser,
} = require("../controllers/userController");

const router = express.Router();

// All routes here are protected + admin
router.use(protect, admin);

// Courses (Admin only)
router.post("/courses", createCourse);
router.put("/courses/:id", updateCourse);
router.delete("/courses/:id", deleteCourse);
router.get("/courses/enrollments", getAllEnrollments);
router.get("/courses/analytics", getAdminAnalytics);

// Users (Admin only)
router.get("/users", getAdminUsers);
router.put("/users/:id", updateUserByAdmin);
router.delete("/users/:id", deleteUser);

module.exports = router;
