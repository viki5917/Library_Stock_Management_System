const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "Email address already exist"],
    },
    address: {
      type: String,
      required: [true, "address is required"],
    },
    phone: {
      type: Number,
      required: [true, "Phone number is required"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    verified: {
      type: Boolean,
    },
  },
  {
    timestamps: true,
  }
);

const User = new mongoose.model("User", userSchema);

module.exports = User;
