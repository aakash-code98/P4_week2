//!: search cronjob
//! how can we schedule deletion of account after a period of time
const User = require("../models/User");
const Profile = require("../models/Profile");
const Course = require("../models/Course");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

//updateProfile
exports.updateProfile = async (req, res) => {
  try {
    //fetch data
    const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
    //get userId
    const userId = req.user.id;
    //validation
    //console.log("this is userId" = userId);
    if (!contactNumber || !gender) {
      return res.status(401).json({
        success: false,
        message: "Enter required fields.",
      });
    }
    //find profileId

    const userDetails = await User.findById({ _id: userId });
    const profileId = userDetails.additionalDetails;
    const profileDetails = await Profile.findById(profileId);
    //update Profile
    profileDetails.dateOfBirth = dateOfBirth;
    profileDetails.about = about;
    profileDetails.contactNumber = contactNumber;
    profileDetails.gender = gender;

    //Save the updated profile no need to create new additional details(profile)
    //because profile data was saved while creating user during sign up
    await profileDetails.save();
    //return res
    res.status(200).json({
      success: true,
      message: "Profile updated.",
      data: profileDetails,
    });
  } catch (error) {
    console.log("Error while updating Profile", error);
    res.status(500).json({
      success: false,
      message: "Failed to Update profile.",
      error: error.message,
    });
  }
};

//get Profile
exports.getAllUserDetails = async (req, res) => {
  try {
    //get user id
    const userId = req.user.id;
    //validate
    const userDetails = await User.findById({ _id: userId })
      .populate("additionDetails")
      .exec();
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    //return res
    res.status(200).json({
      success: true,
      message: "Data fetched successfully.",
      data: userDetails,
    });
  } catch (error) {
    console.log("Error while fetching Profile", error);
    res.status(500).json({
      success: false,
      message: "Failed to get profile.",
      error: error.message,
    });
  }
};

//delete account
exports.deleteAccount = async (req, res) => {
  try {
    // TODO: Find More on Job Schedule
    // const job = schedule.scheduleJob("10 * * * * *", function () {
    // 	console.log("The answer to life, the universe, and everything!");
    // });
    // console.log(job);

    //get userId
    const userId = req.user.id;
    //validate id
    const userDetails = await User.findById(userId);
    if (!userDetails) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }
    //delete profile
    await Profile.findByIdAndDelete({ _id: userDetails.additionalDetails });
    //unenroll user from courses
    const user = await User.findById(userId).populate("courses");
    for (let course of user.courses) {
      await Course.findByIdAndUpdate(course._id, {
        $pull: { studentsEnrolled: userId },
      });
    }
    //delete user
    await User.findByIdAndDelete({ _id: userId });
    //return res
    res.status(200).json({
      success: true,
      message: "User Deleted Successfully.",
    });
  } catch (error) {
    console.log("Error while deleting Profile", error);
    res.status(500).json({
      success: false,
      message: "Failed to Deleting profile.",
      error: error.message,
    });
  }
};

exports.getAllUserDetails = async (req, res) => {
  try {
    const userId = req.user.id;
    const userDetails = await User.findById(userId)
      .populate("additionalDetails")
      .exec();
    console.log("All user Details" + userDetails);
    res.status(200).json({
      success: true,
      message: "User Data fetched successfully.",
      data: userDetails,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;
    const image = await uploadImageToCloudinary(
      displayPicture,
      process.env.FOLDER_NAME,
      1000,
      1000
    );
    console.log("updateDisplayPicture handler func" + image);
    const updatedUser = await User.findByIdAndUpdate(
      { _id: userId },
      { image: image.secure_url },
      { new: true }
    );
    res.status(200).json({
      success: true,
      message: `Image Updated successfully`,
      data: image.secure_url,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error while updating profile picture",
      error: error.message,
    });
  }
};

exports.getEnrolledCourses = async (req, res) => {
  try {
    const userId = req.user.id;
    const userDetails = await User.findOne({
      _id: userId,
    })
      .populate("courses")
      .exec();
    if (!userDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find user with id: ${userDetails}`,
      });
    }
    res.status(200).json({
      success: true,
      data: userDetails.courses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
