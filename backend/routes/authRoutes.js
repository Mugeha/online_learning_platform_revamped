const express = require("express");
const { registerUser, loginUser, forgotPassword, resetPassword } = require("../controllers/authController");
const forgotPasswordLimiter = require("../middleware/rateLimit");


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.put("/reset-password/:token", resetPassword);

module.exports = router;
