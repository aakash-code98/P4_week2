// Import the required modules
const express = require("express");
const router = express.Router();

// Import the required controllers and middleware functions
const {
  logIn,
  signUp,
  sendOtp,
  changePassword,
} = require("../controllers/Auth");
const {
  resetPasswordToken,
  resetPassword,
} = require("../controllers/ResetPassword");

const { auth } = require("../middlewares/auth");

// Routes for LogIn, SignUp, and Authentication

// ********************************************************************************************************
//                                      Authentication routes
// ********************************************************************************************************

// Route for user logIn
router.post("/logIn", logIn);

// Route for user signUp
router.post("/signUp", signUp);

// Route for sending OTP to the user's email
router.post("/sendOtp", sendOtp);

// Route for Changing the password
router.post("/changePassword", auth, changePassword);

// ********************************************************************************************************
//                                      Reset Password
// ********************************************************************************************************

// Route for generating a reset password token
router.post("/reset-password-token", resetPasswordToken);

// Route for resetting user's password after verification
router.post("/reset-password", resetPassword);

// Export the router for use in the main application
module.exports = router;