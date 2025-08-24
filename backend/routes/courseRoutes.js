// routes/courseRoutes.js
const express = require("express");
const {
  getCourses,
  getCourseBySlug,
  getMyCourses,
  enrollInCourse,
  unenrollFromCourse,
} = require("../controllers/courseController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Public
router.get("/", getCourses);
router.get("/slug/:slug", getCourseBySlug);

// User-specific
router.get("/my-courses/list", protect, getMyCourses);
router.post("/:id/enroll", protect, enrollInCourse);
router.delete("/:id/unenroll", protect, unenrollFromCourse);

module.exports = router;
