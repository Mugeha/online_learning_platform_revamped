const express = require("express");
const {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse
} = require("../controllers/courseController");

const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminMiddleware");

const router = express.Router();

router.route("/")
  .get(getCourses)
  .post(protect, admin, createCourse);

router.route("/:slug").get(getCourseBySlug);

router.route("/:id")
  .put(protect, admin, updateCourse)
  .delete(protect, admin, deleteCourse);

module.exports = router;
