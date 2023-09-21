//for password hashing
const bcrypt = require("bcrypt");

//to generate token
const jwt = require("jsonwebtoken");

//env variables
require("dotenv").config();

//email handler
const nodemailer = require("nodemailer");

//mongodb user model
const User = require("../models/userModel");

//mongodb books model
const { Books } = require("../models/booksModel");

//mongodb userOTPVerification model
const UserOTPVerification = require("../models/userOTPVerificationModel");

//nodemailer stuff
let transporter = nodemailer.createTransport({
  service: "gmail", //use gmail service to send emails from this account
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

// transporter verify
transporter.verify((error) => {
  if (error) {
    console.log("Error verifying transporter:", error);
  } else {
    console.log("Transporter is ready for messages");
  }
});

//@desc Register a user
//@route POST /api/user/register
//@access public
const registerUser = async (req, res) => {
  let { name, email, address, phone, password } = req.body;

  //check all the missing fields.
  if (!name || !email || !address || !phone || !password)
    return res
      .status(400)
      .json({ error: "Please enter all the required fields" });

  //name validation
  if (name.length > 25 && !/^[a-zA-Z ]*$/.test(name))
    return res.status(400).json({ error: "Name should contains only letters" });

  //email validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (!emailRegex.test(email))
    return res
      .status(400)
      .json({ error: "Please enter a valid email address" });

  //password validation
  if (password.length <= 6)
    return res
      .status(400)
      .json({ error: "password must be atleast 6 characters long" });

  //phone validation
  const phoneRegex = /^[6789]\d{9}$/;
  if (!phoneRegex.test(phone))
    return res.status(400).json({ error: "Please enter a valid phone number" });

  try {
    const doesUserAlreadyExist = await User.findOne({ email });

    if (doesUserAlreadyExist)
      return res.status(400).json({
        error: `User already exist with that email`,
      });

    //hash password
    const hashedPassword = await bcrypt.hash(password, 12);
    const newUser = User({
      name,
      email,
      address,
      phone,
      password: hashedPassword,
      verified: false,
    });

    //save the user
    await newUser
      .save()
      .then((result) => {
        sendOTPVerificationEmail(result, res);
      })
      .catch((err) => {
        console.log(err);
        res
          .status(400)
          .json({ error: "An error occurred while saving the user account" });
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
};

//send otp verification email
const sendOTPVerificationEmail = async ({ _id, email }, res) => {
  try {
    const otp = `${Math.floor(1000 + Math.random() * 9000)}`;

    //mail options
    const mailOptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify Your Email",
      html: `<p>Enter <b>${otp}</b> in the app to verify your email address</p><p>This Code <b>expires in 1hr</b></p>`,
    };

    //hash the otp
    const hashedOTP = await bcrypt.hash(otp, 12);
    const newOTPVerification = await new UserOTPVerification({
      userId: _id,
      otp: hashedOTP,
      createdAt: Date.now(),
      expireAt: new Date(Date.now() + 3600000),
    });

    await transporter.sendMail(mailOptions);
    //save otp record
    await newOTPVerification.save();
    return res.status(200).json({
      message: "verification otp email sent",
      data: { userId: _id, email },
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//@desc Verify otp email
//@route POST /api/user/verifyotp
//@access private
const verifyOtpEmail = async (req, res) => {
  try {
    let { userId, otp } = req.body;
    //otp field validation
    if (!userId || !otp) {
      return res
        .status(400)
        .json({ error: "Empty otp details are not allowed" });
    } else {
      const userOTPVerificationRecords = await UserOTPVerification.findOne({
        userId,
      });
      if (!userOTPVerificationRecords) {
        //no record found
        return res.status(404).json({
          error:
            "Account record doesn't exist,or user has been verified already.Please signup or login",
        });
      } else {
        //user otp record exist

        const expireAt = userOTPVerificationRecords.expireAt;
        const hashedOTP = userOTPVerificationRecords.otp;

        if (expireAt < Date.now()) {
          //user otp record has expired
          await UserOTPVerification.deleteMany({ userId });
          return res
            .status(403)
            .json({ error: "OTP has expired,Please request again" });
        } else {
          const validOTP = await bcrypt.compare(otp, hashedOTP);
          // if the OTP is wrong
          if (!validOTP) {
            return res.status(401).json({ error: "Invalid OTP" });
          } else {
            //otp success
            await User.updateOne({ _id: userId }, { verified: true });
            await UserOTPVerification.deleteMany({ userId });
            return res
              .status(200)
              .json({ message: "User email verified successfully" });
          }
        }
      }
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//@desc Resend Verification OTP
//@route POST /api/user/resendverifyotp
//@access private
const resendOTPVerificationEmail = async (req, res) => {
  try {
    let { userId, email } = req.body;

    if (!userId || !email) {
      return res.status(400).json({ error: "please provide all details" });
    } else {
      await UserOTPVerification.deleteMany({ userId });
      sendOTPVerificationEmail({ _id: userId, email }, res);
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//@desc Login user
//@route POST /api/user/login
//@access public
const loginUser = async (req, res) => {
  let { email, password } = req.body;

  //field validation
  if (!email || !password)
    return res
      .status(400)
      .json({ error: "Please enter all the required fields" });

  //email validation
  const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  if (!emailRegex.test(email))
    return res
      .status(400)
      .json({ error: "Please enter a valid email address" });

  try {
    //finding user by email
    const doesUserExist = await User.findOne({ email });

    //if email doesn't exist
    if (!doesUserExist)
      return res.status(400).json({ error: `Invalid email or password` });

    //if email exist, then checking password
    const doesPasswordMatch = await bcrypt.compare(
      password,
      doesUserExist.password
    );

    //if password doesn't match
    if (!doesPasswordMatch)
      return res.status(400).json({ error: "Invalid email or password" });

    //if user is not verified
    if (!doesUserExist.verified) {
      await User.deleteMany({ email });
      await UserOTPVerification.deleteMany({ userId: doesUserExist._id });
      return res.status(400).json({ error: `User not verified signup again` });
    }

    const payload = { _id: doesUserExist._id };

    //if email and password matches,generate token
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    const user = { ...doesUserExist._doc, password: undefined };

    return res.status(200).json({ token, user });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//@desc Forget Password
//@route POST /api/user/forgetpassword
//@access public
const forgetPassword = async (req, res) => {
  const { email } = req.body;
  //field validation
  if (!email)
    return res.status(400).json({ error: "Please enter email address" });

  //email validation
  const emailRegex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailRegex.test(email))
    return res
      .status(400)
      .json({ error: "Please enter a valid email address" });

  try {
    //finding user by email
    const doesUserExist = await User.findOne({ email });

    //if email doesn't exist
    if (!doesUserExist)
      return res
        .status(400)
        .json({ error: `User doesn't exist Signup to login` });

    //if user exist and but not verified
    if (doesUserExist && !doesUserExist.verified) {
      return res
        .status(400)
        .json({ error: "user doesn't verify email address" });
    }
    sendOTPVerificationEmail(doesUserExist, res);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//@desc Verify Otp and Reset Password
//@route PUT /api/user/resetpassword
//@access private
const resetPassword = async (req, res) => {
  try {
    const { userId, otp, newpassword } = req.body;

    //field validation
    if (!userId || !newpassword || !otp) {
      return res.status(400).json({ error: "All fields are mandotary" });
    }

    //password validation
    if (newpassword.length <= 6)
      return res
        .status(400)
        .json({ error: "password must be atleast 6 characters long" });

    //checking otp is correct or not
    const userOTPVerificationRecords = await UserOTPVerification.findOne({
      userId,
    });
    if (!userOTPVerificationRecords) {
      //no record found
      return res.status(404).json({
        error: "Something went wrong try again later",
      });
    } else {
      //user otp record exist

      const expireAt = userOTPVerificationRecords.expireAt;
      const hashedOTP = userOTPVerificationRecords.otp;

      if (expireAt < Date.now()) {
        //user otp record has expired
        await UserOTPVerification.deleteMany({ userId });
        return res
          .status(403)
          .json({ error: "OTP has expired,Please request again" });
      } else {
        const validOTP = await bcrypt.compare(otp, hashedOTP);
        // if the OTP is wrong
        if (!validOTP) {
          return res.status(401).json({ error: "Invalid OTP" });
        }

        //otp success

        //hash password
        const hashedPassword = await bcrypt.hash(newpassword, 12);
        const user = await User.findByIdAndUpdate(
          { _id: userId },
          { password: hashedPassword },
          { new: true }
        );
        await UserOTPVerification.deleteMany({ userId });
        return res
          .status(200)
          .json({ message: "User Password Updated successfully" });
      }
    }
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//@desc Current user
//@route GET /api/user/currentuser
//@access private
const currentUser = async (req, res) => {
  try {
    const currentuser = { ...req.user._doc };
    return res.status(200).json({ currentuser });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

//@desc All Books
//@route GET /api/user/allbooks
//@access private
const allBooks = async (req, res) => {
  try {
    const myBooks = await Books.find({});
    return res.status(200).json({ myBooks: myBooks.reverse() });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
  verifyOtpEmail,
  resendOTPVerificationEmail,
  forgetPassword,
  resetPassword,
  currentUser,
  allBooks,
};
