const express = require("express");
const validateToken = require("../middleware/validateTokenHandler");
const {
  registerUser,
  verifyOtpEmail,
  resendOTPVerificationEmail,
  loginUser,
  forgetPassword,
  resetPassword,
  currentUser,
  allBooks,
} = require("../controllers/userController");

const router = express.Router();

//register new user
router.post("/register", registerUser);

//verify email by otp after register
router.post("/verifyotp", verifyOtpEmail);

//resend otp to verify email
router.post("/resendverifyotp", resendOTPVerificationEmail);

//login user
router.post("/login", loginUser);

//forget password
router.post("/forgetpassword", forgetPassword);

//reset password by entering otp
router.put("/resetpassword", resetPassword);

//get current logged in user details
router.get("/currentuser", validateToken, currentUser);

//all books from the library
router.get("/allbooks", validateToken, allBooks);

module.exports = router;
