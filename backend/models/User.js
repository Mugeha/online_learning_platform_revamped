const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");


// Define schema for User
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
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

// Pre-save middleware: Hash password before saving to DB
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password in DB
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
// Method to generate reset token
userSchema.methods.getResetPasswordToken = function () {
  // Generate raw token
  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and store in DB
  this.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");

  // Set expiration time (10 minutes)
  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

module.exports = mongoose.model("User", userSchema);
