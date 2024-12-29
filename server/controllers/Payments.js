const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const {
  courseEnrollmentEmail,
} = require("../mail/templates/courseEnrollmentEmail");
const { default: mongoose } = require("mongoose");

//capture the payment and initiate the razorpay order
exports.capturePayments = async (req, res) => {
  //get courseId and userId
  const { courseId } = req.body;
  const userId = req.user.id;
  //validate courseId
  if (!courseId) {
    return res.json({
      success: false,
      message: "Please provide Course Id",
    });
  }
  //validate courseDetails
  let course;
  try {
    course = await Course.findById({ courseId });
    if (!course) {
      return res.status(403).json({
        success: false,
        message: "Invalid Course Id.",
      });
    }
    //user already paid for the course
    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studentsEnrolled.includes(uid)) {
      return res.status(200).json({
        success: false,
        message: "Student is already enrolled.",
      });
    }
  } catch (error) {
    console.log("Error while fetching course details.", error);
    res.status(500).json({
      success: false,
      message: "Invalid Course Id.",
    });
  }
  //order create
  const amount = course.price;
  const currency = "INR";
  const options = {
    amount: amount * 100,
    currency: currency,
    receipt: Math.random(Date.now()).toString(),
    notes: {
      courseId: courseId,
      userId: userId,
    },
  };
  try {
    //initiate the payment using razorpay
    const paymentResponse = await instance.orders.create(options);
    console.log("Response after initializing payment with razorpay" + paymentResponse);
    //return response
    return res.status(200).json({
      success: true,
      message: "Order initiated successfully.",
      courseName: course.courseName,
      courseDescription: course.courseDescription,
      thumbnail: course.thumbnails,
      orderId: paymentResponse.id,
      currency: paymentResponse.currency,
      amount: paymentResponse.amount,
    });
  } catch (error) {
    console.log("Error while capturing payments" + error);
    res.status(500).json({
      success: false,
      message: "couldn't initiate order.",
    });
  }
};

//verify signature
exports.verifySignature = async (req, res) => {
  const webHookSecret = "123456";
  const signature = req.headers["x-razorpay-signature"];

  //encrypt webhookSecret the same way razorpay encrypted the secret and sent us
  const shasum = crypto.createHmac("sha256", webHookSecret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest("hex");

  //verify signature
  if (signature == digest) {
    console.log("Payment is Authorised.");
    const { userId, courseId } = req.body.payload.payments.entity.notes;
    try {
      //update User schema
      const userUpdated = await User.findByIdAndUpdate(
        { _id: userId },
        { $push: { courses: courseId } },
        { new: true }
      );
      if (!userUpdated) {
        return res.status(500).json({
          success: false,
          message: "User not found.",
        });
      }
      console.log("User updated after verifying payment signature" + userUpdated);
      //update Course schema
      const courseUpdated = await Course.findByIdAndUpdate(
        { _id: courseId },
        { $push: { studentsEnrolled: userId } },
        { new: true }
      );
      if (!courseUpdated) {
        return res.status(500).json({
          success: false,
          message: "Course not found.",
        });
      }
      console.log("Course updated after verifying payment signature" + courseUpdated);

      //send mail
      const emailResponse = await mailSender(
        userUpdated.email,
        "Congratulation",
        "Congratulation you are enrolled in the course"
      );
      res.status(200).json({
        success: true,
        message: "Signature verified and models updated.",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Failed to Update models",
        error,
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Failed to authorise payment.",
      error,
    });
  }
};
