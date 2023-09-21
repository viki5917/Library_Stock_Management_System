const mongoose = require("mongoose");

const userOTPVerificationSchema = new mongoose.Schema({
  userId: {
    type: String,
  },
  otp: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  expireAt: {
    type: Date,
  },
});

const UserOTPVerification = new mongoose.model(
  "UserVerification",
  userOTPVerificationSchema
);

module.exports = UserOTPVerification;
