const express = require("express");
const {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyCourses,
  enrollInCourse,
  unenrollFromCourse,
} = require("../controllers/courseController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

const router = express.Router();

// Public
router.get("/", getCourses);
router.get("/slug/:slug", getCourseBySlug);

// Admin-only
router.post("/", protect, admin, createCourse);
router.put("/:id", protect, admin, updateCourse);
router.delete("/:id", protect, admin, deleteCourse);

// User-specific
router.get("/my-courses/list", protect, getMyCourses);
router.post("/:id/enroll", protect, enrollInCourse);
router.delete("/:id/unenroll", protect, unenrollFromCourse);

module.exports = router;
