const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String },
  videoUrl: { type: String },
  duration: { type: String }
});

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String, required: true },
    instructor: { type: String, required: true },
    imageUrl: { type: String },
    category: { type: String },
    price: { type: Number, default: 0 }, // 0 means free
    lessons: [lessonSchema]
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);
