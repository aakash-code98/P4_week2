const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
//reset password token
exports.resetPasswordToken = async (req, res) => {
  try {
    //get email from req body
    const email = req.body.email;
    //check for user
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: `This Email: ${email} is not Registered With Us Enter a Valid Email `,
      });
    }
    //generate token
    const token = crypto.randomBytes(20).toString("hex");
    //update user by adding token and expiration time
    const updatedDetails = await User.findOneAndUpdate(
      { email: email },
      {
        token: token,
        resetPasswordExpires: Date.now() + 5 * 60 * 1000,
      },
      { new: true }
    );

    //create url
    const url = `https://localhost:3000/change-password/${token}`;
    //send mail containing url
    await mailSender(
      email,
      "Password reset link",
      `Password reset request was made. To reset password click the link ${url}`
    );
    //return response
    return res.status(200).json({
      success: true,
      message:
        "Email was send successfully, please check the email and change the password.",
    });
  } catch (error) {
    console.log("Reset password token error: ", error);
    res.status(500).json({
      success: false,
      message: "Reset password token creation failed.",
    });
  }
};

//reset password

exports.resetPassword = async (req, res) => {
  try {
    //take url and password from req body
    const { password, confirmPassword, token } = req.body;
    //validate pass
    if (password !== confirmPassword) {
      return res.status(401).json({
        success: false,
        message: "Password does not match Confirm Password.",
      });
    }
    //get user details
    const userDetails = await User.findOne({ token: token });
    if (!userDetails) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid.",
      });
    }
    //token time check
    if (userDetails.resetPasswordExpires < Date.now()) {
      return res.status(401).json({
        success: false,
        message: "Token expired. Please try again.",
      });
    }
    //hash pass
    const encryptedPassword = await bcrypt.hash(password, 10);
    //update pass
    await User.findOneAndUpdate(
      { token: token },
      { password: encryptedPassword },
      { new: true }
    );
    //return response
    return res.status(200).json({
      success: true,
      message: "Password changed successfully.",
    });
  } catch (error) {
    console.log("Error while resetting password.", error);
    return res.status(500).json({
      status: false,
      message: "Failed to reset password. Please try again.",
    });
  }
};
