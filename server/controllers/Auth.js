const User = require("../models/User");
const OTP = require("../models/OTP");
const Profile = require("../models/Profile");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");
const { passwordUpdated } = require("../mail/templates/passwordUpdate");
require("dotenv").config();

//send otp
exports.sendOtp = async (req, res) => {
  try {
    //fetch email from req body
    const { email } = req.body;

    // Check if user is already present
    // Find user with provided email
    const checkUserPresent = await User.findOne({ email });
    // If user found with provided email
    if (checkUserPresent) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: `User is Already Registered`,
      });
    }
    //generate OTP
    let result;
    let otp;
    do {
      otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      });
      result = await OTP.findOne({ otp: otp });
    } while (result);

    //create an entry for OTP
    const otpPayload = { email, otp };
    const otpBody = await OTP.create(otpPayload);
    console.log("Entry for OTP model made " + otpBody);

    //return response successful
    res.status(200).json({
      success: true,
      message: "OTP send successfully",
      otp,
    });
  } catch (error) {
    console.log("Error while sending OTP" + error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//sign up
exports.signUp = async (req, res) => {
  try {
    //fetch data from req body
    const {
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
      accountType,
      contactNumber,
      otp,
    } = req.body;

    // validate data
    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !confirmPassword ||
      !otp
    ) {
      return res.status(403).json({
        success: false,
        message: "All fields are required.",
      });
    }

    // match pass
    if (password !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message:
          "Password and Confirm Password does not match. Please try again.",
      });
    }

    // check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists. Please sign in to continue.",
      });
    }

    // find most recent OTP
    const recentOtp = await OTP.find({ email })
      .sort({ createdAt: -1 })
      .limit(1);
    console.log("Recent OTP is: ", recentOtp);
    // validate otp
    if (recentOtp.length === 0) {
      //OTP not found
      return res.status(400).json({
        success: false,
        message: "OTP not found.",
      });
    } else if (otp !== recentOtp[0].otp) {
      //invalid OTP
      return res.status(400).json({
        success: false,
        message: "OTP is invalid.",
      });
    }

    // hash pass
    const encryptedPassword = await bcrypt.hash(password, 10);
    //create the user
    let approved = "";
    approved === "Instructor" ? (approved = false) : (approved = true);

    // create entry in db
    //create additional detail for user
    const profileDetail = await Profile.create({
      gender: null,
      dateOfBirth: null,
      about: null,
      contactNumber: contactNumber,
    });
    const user = await User.create({
      firstName,
      lastName,
      email,
      contactNumber,
      password: encryptedPassword,
      accountType: accountType,
      approved: approved,
      additionalDetails: profileDetail.id,
      image: `https://api.dicebear.com/5.x/initials/svg?seed=${firstName} ${lastName}`,
    });
    // return res
    return res.status(200).json({
      success: true,
      message: "SignUp successful. User registered.",
      user,
    });
  } catch (error) {
    console.log("Error while signing up the user" + error);
    return res.status(500).json({
      success: false,
      message: "User cannot be registered. Please try again.",
    });
  }
};

//log in
exports.logIn = async (req, res) => {
  try {
    // fetch data from req body
    const { email, password } = req.body;
    //validate data
    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: "All fields are required. Please try again.",
      });
    }

    //user check
    const user = await User.findOne({ email: email }).populate(
      "additionalDetails"
    );

    //if user does not exists and is signing in
    if (!user) {
      // Return 401 Unauthorized status code with error message
      return res.status(401).json({
        success: false,
        message: "User not registered.",
      });
    }

    // match pass
    let comparePass = await bcrypt.compare(password, user.password);

    // generate JWT
    if (comparePass) {
      const payload = {
        email: user.email,
        id: user._id,
        accountType: user.accountType,
      };
      const secret = process.env.JWT_SECRET;
      // console.log("SECRET ------ " + secret);
      const token = jwt.sign(payload, secret, {
        expiresIn: "24h",
        algorithm: "HS256",
      });
      //save token to document in DB
      user.token = token;

      // create cookie and send response
      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      };
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: "Logged in successfully.",
      });
    } else {
      return res.status(401).json({
        success: false,
        message: "Password is incorrect.",
      });
    }
  } catch (error) {
    console.log("Error while trying to logIn" + error);
    return res.status(500).json({
      success: false,
      message: "Login Failure, please try again.",
    });
  }
};

//change password

exports.changePassword = async (req, res) => {
  try {
    // Get user data from req.user
    const userDetails = await User.findById(req.user.id);

    //fetch data from req body
    const { oldPass, newPass, confirmNewPass } = req.body;

    // Validate old password
    const isPasswordMatch = await bcrypt.compare(oldPass, userDetails.password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: "Please enter correct old password.",
      });
    }

    // Validate old password
    if (newPass !== confirmNewPass) {
      return res.status(401).json({
        success: false,
        message:
          "New password and Confirm password does not match. Please try again.",
      });
    }

    //update pwd
    const encryptedPassword = await bcrypt.hash(newPass, 10);
    const updatedUserDetails = await User.findOneAndUpdate(
      { _id: req.user.id },
      {
        password: encryptedPassword,
      },
      { new: true }
    );

    //send mail
    try {
      let title = "Password was updated";
      let name = `${updatedUserDetails.firstName} ${updatedUserDetails.lastName}.`;
      let body = passwordUpdated(updatedUserDetails.email, name);
      let emailResponse = await mailSender(
        updatedUserDetails.email,
        title,
        body
      );
      console.log("Email sent successfully: ", emailResponse.response);
    } catch (error) {
      // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while sending email:", error);
      return res.status(500).json({
        success: false,
        message: "Error occurred while sending email",
        error: error.message,
      });
    }
    //return res
    return res.status(200).json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (error) {
    console.log("Error while handling changePassword" + error);
    return res.status(500).json({
      success: false,
      message: "Password was not updated.",
      error: error.message,
    });
  }
};
