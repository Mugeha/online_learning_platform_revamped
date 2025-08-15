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
// Public & Admin
router.route("/")
  .get(getCourses)
  .post(protect, admin, createCourse);

// User-specific (must be logged in)
router.get("/my-courses/list", protect, getMyCourses);
router.post("/:id/enroll", protect, enrollInCourse);
router.delete("/:id/unenroll", protect, unenrollFromCourse);

// Dynamic routes
router.route("/slug/:slug").get(getCourseBySlug); // safer to namespace slug
router.route("/:id")
  .put(protect, admin, updateCourse)
  .delete(protect, admin, deleteCourse);


module.exports = router;
