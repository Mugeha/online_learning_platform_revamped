const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please add a name"]
  },
  email: {
    type: String,
    required: [true, "Please add an email"],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Please add a password"]
  },
  address: {
    type: String,
    default: ""  // optional field
  },
  isAdmin: {
    type: Boolean,
    default: false // By default, new users are not admins
  },
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],

  resetPasswordToken: String,
  resetPasswordExpire: Date
}, {
  timestamps: true
});
