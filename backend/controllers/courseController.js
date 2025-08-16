const Course = require("../models/courseModel");
const User = require("../models/userModel");

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  try {
    const courses = await Course.find({});
    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses" });
  }
};

// @desc    Get single course by slug
// @route   GET /api/courses/slug/:slug
// @access  Public
const getCourseBySlug = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug });
    if (course) {
      res.json(course);
    } else {
      res.status(404).json({ message: "Course not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching course" });
  }
};

// @desc    Create a new course
// @route   POST /api/courses
// @access  Admin
const createCourse = async (req, res) => {
  try {
    const { title, description, slug } = req.body;

    const existing = await Course.findOne({ slug });
    if (existing) {
      return res.status(400).json({ message: "Slug already exists" });
    }

    const course = new Course({ title, description, slug });
    const createdCourse = await course.save();

    res.status(201).json(createdCourse);
  } catch (error) {
    res.status(500).json({ message: "Error creating course" });
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Admin
const updateCourse = async (req, res) => {
  try {
    const { title, description, slug } = req.body;
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // check slug uniqueness if updating
    if (slug && slug !== course.slug) {
      const existing = await Course.findOne({ slug });
      if (existing) {
        return res.status(400).json({ message: "Slug already exists" });
      }
      course.slug = slug;
    }

    course.title = title || course.title;
    course.description = description || course.description;

    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: "Error updating course" });
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Admin
const deleteCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    await course.deleteOne();
    res.json({ message: "Course removed" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course" });
  }
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
const enrollInCourse = async (req, res) => {
  try {
    const course = await Course.findById(req.params.id);
    const user = await User.findById(req.user._id);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (user.enrolledCourses.includes(course._id)) {
      return res.status(400).json({ message: "Already enrolled" });
    }

    user.enrolledCourses.push(course._id);
    await user.save();

    res.json({ message: "Enrolled successfully", courseId: course._id });
  } catch (error) {
    res.status(500).json({ message: "Error enrolling in course" });
  }
};

// @desc    Unenroll from a course
// @route   DELETE /api/courses/:id/unenroll
// @access  Private
const unenrollFromCourse = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user.enrolledCourses.includes(req.params.id)) {
      return res.status(400).json({ message: "Not enrolled in this course" });
    }

    user.enrolledCourses = user.enrolledCourses.filter(
      (courseId) => courseId.toString() !== req.params.id
    );

    await user.save();
    res.json({ message: "Unenrolled successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unenrolling from course" });
  }
};

// @desc    Get my enrolled courses
// @route   GET /api/courses/my-courses/list
// @access  Private
const getMyCourses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("enrolledCourses");
    res.json(user.enrolledCourses || []);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrolled courses" });
  }
};

// @desc    Get all enrollments (admin only)
// @route   GET /api/courses/enrollments
// @access  Private/Admin
const getAllEnrollments = asyncHandler(async (req, res) => {
  const courses = await Course.find({})
    .populate("enrolledUsers", "name email") // populate user info
    .select("title slug enrolledUsers");

  // flatten into enrollment records
  const enrollments = [];

  courses.forEach((course) => {
    course.enrolledUsers.forEach((user) => {
      enrollments.push({
        _id: `${course._id}-${user._id}`, // pseudo id
        user,
        course: {
          _id: course._id,
          title: course.title,
          slug: course.slug,
        },
        enrolledAt: user.createdAt || new Date(), // if you track enrollment time separately, use that
      });
    });
  });

  res.json(enrollments);
});


module.exports = {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  enrollInCourse,
  unenrollFromCourse,
  getMyCourses,
  getAllEnrollments,
};
