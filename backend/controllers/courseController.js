const Course = require("../models/Course");

// @desc    Get all courses
// @route   GET /api/courses
// @access  Public
const getCourses = async (req, res) => {
  const courses = await Course.find({});
  res.json(courses);
};

// @desc    Get single course by slug
// @route   GET /api/courses/:slug
// @access  Public
const getCourseBySlug = async (req, res) => {
  const course = await Course.findOne({ slug: req.params.slug });
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }
  res.json(course);
};

// @desc    Create new course
// @route   POST /api/courses
// @access  Private/Admin
const createCourse = async (req, res) => {
  const { title, slug, description, instructor, imageUrl, category, price } = req.body;

  const courseExists = await Course.findOne({ slug });
  if (courseExists) {
    return res.status(400).json({ message: "Slug already exists" });
  }

  const course = new Course({
    title,
    slug,
    description,
    instructor,
    imageUrl,
    category,
    price,
    lessons: []
  });

  const createdCourse = await course.save();
  res.status(201).json(createdCourse);
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private/Admin
const updateCourse = async (req, res) => {
  const { title, slug, description, instructor, imageUrl, category, price, lessons } = req.body;
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  course.title = title || course.title;
  course.slug = slug || course.slug;
  course.description = description || course.description;
  course.instructor = instructor || course.instructor;
  course.imageUrl = imageUrl || course.imageUrl;
  course.category = category || course.category;
  course.price = price !== undefined ? price : course.price;
  course.lessons = lessons || course.lessons;

  const updatedCourse = await course.save();
  res.json(updatedCourse);
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private/Admin
const deleteCourse = async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }
  await course.remove();
  res.json({ message: "Course removed" });
};

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
const enrollInCourse = async (req, res) => {
  const courseId = req.params.id;

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({ message: "Course not found" });
  }

  const user = req.user;

  if (user.enrolledCourses.includes(courseId)) {
    return res.status(400).json({ message: "Already enrolled in this course" });
  }

  user.enrolledCourses.push(courseId);
  await user.save();

  res.status(200).json({ message: "Successfully enrolled", course });
};

// @desc    Unenroll from a course
// @route   DELETE /api/courses/:id/unenroll
// @access  Private
const unenrollFromCourse = async (req, res) => {
  const courseId = req.params.id;

  const user = req.user;

  if (!user.enrolledCourses.includes(courseId)) {
    return res.status(400).json({ message: "Not enrolled in this course" });
  }

  user.enrolledCourses = user.enrolledCourses.filter(
    id => id.toString() !== courseId
  );
  await user.save();

  res.status(200).json({ message: "Successfully unenrolled" });
};

// @desc    Get my courses
// @route   GET /api/courses/my
// @access  Private
const getMyCourses = async (req, res) => {
  const user = await req.user.populate("enrolledCourses");
  res.status(200).json(user.enrolledCourses);
};


module.exports = {
  getCourses,
  getCourseBySlug,
  createCourse,
  updateCourse,
  deleteCourse,
  getMyCourses,
  unenrollFromCourse,
  enrollInCourse
};
