const express = require("express");
const {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyCourses,
  enrollInCourse,
  unenrollFromCourse
} = require("../controllers/courseController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

const router = express.Router();

// Public & Admin
router.route("/")
  .get(getCourses)
  .post(protect, admin, createCourse);

router.route("/:slug").get(getCourseBySlug);

router.route("/:id")
  .put(protect, admin, updateCourse)
  .delete(protect, admin, deleteCourse);

// User-specific (must be logged in)
router.get("/my-courses/list", protect, getMyCourses);
router.post("/:id/enroll", protect, enrollInCourse);
router.delete("/:id/unenroll", protect, unenrollFromCourse);

module.exports = router;
