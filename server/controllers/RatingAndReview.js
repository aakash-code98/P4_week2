const RatingAndReview = require("../models/RatingAndReview");
const Course = require("../models/Course");
const mongoose = require("mongoose");

//create rating
exports.createRatingAndReview = async (req, res) => {
  try {
    //get data from req
    const userId = req.user.id;
    const { courseId, rating, review } = req.body;

    //validate data
    if (!userId || !rating || !review || courseId) {
      return res.json({
        success: false,
        message: "Enter all fields.",
      });
    }

    //check if user enrolled or not
    //* findOne and $elemMatch and $eq
    const courseDetails = await Course.findOne({
      _id: courseId,
      studentsEnrolled: { $elemMatch: { $eq: userId } },
    });
    if (!courseDetails) {
      return res.status(404).json({
        success: false,
        message: "Student is not enrolled in the code.",
      });
    }

    //user reviewed already?
    const alreadyReviewed = await RatingAndReview.findOne({
      user: userId,
      course: courseId,
    });
    if (alreadyReviewed) {
      return res.status(403).json({
        success: false,
        message: "Course is already reviewed by the user.",
      });
    }

    //create entry in DB
    const response = await RatingAndReview.create({
      user: userId,
      rating: rating,
      review: review,
      course: courseId,
    });

    //update course
    const courseUpdated = await Course.findByIdAndUpdate(
      { _id: courseId },
      { $push: { ratingAndReviews: response._id } },
      { new: true }
    );
    console.log("Updated Course details: ", courseUpdated);
    //return res
    res.status(200).json({
      success: true,
      message: "Rating and review added.",
      data: response,
    });
  } catch (error) {
    console.log("Error while adding review", error);
    res.status(500).json({
      success: false,
      message: "Failed to add review due to unforeseen error.",
    });
  }
};

//get avg rating
exports.getAvgRating = async (req, res) => {
  //get courseId
  const courseId = req.body.courseId;
  //validate data
  if (!courseId) {
    return res.status(401).json({
      success: false,
      message: "Course id required.",
    });
  }
  try {
    //calculate avg rating
    const result = await RatingAndReview.aggregate([
      //*aggregate is returning an array in this case
      {
        //*find entry using $ match
        $match: {
          course: new mongoose.Types.ObjectId(courseId),
        },
      },
      {
        //*group the entries that we found based on _id
        //*and give avg rating by using $avg on $rating attribute
        $group: {
          //*but _id is null ... so only one group is formed
          _id: null,
          //*using $avg on $rating attribute and saving it in averageRating
          averageRating: { $avg: "$rating" },
        },
      },
    ]);

    //if rating does not exists
    if (result.length <= 0) {
      return res.status(200).json({
        success: true,
        message: "Course does not have any rating yet.",
        averageRating: 0,
      });
    }

    //return res if rating exists
    res.status(200).json({
      success: true,
      message: "task to get avg rating completed successfully.",
      averageRating: result[0].averageRating,
    });
  } catch (error) {
    console.log("Error while getting avg rating", error);
    res.status(500).json({
      success: false,
      message: "Failed to get avg rating due to unforeseen error.",
    });
  }
};

//get rating and review data for specific course
exports.getRatingAndReview = async (req, res) => {
  //get data
  const { courseId } = req.body;
  //check data
  if (!courseId) {
    return res.status(401).json({
      success: false,
      message: "course id required",
    });
  }
  try {
    //*get info from DB
    const ratingAndReview = await RatingAndReview.find(
      { _id: courseId },
      {
        rating: true,
        review: true,
        user: true,
      }
    )
      .populate({
        //*populating user schema's attributes selectively
        path: "user",
        select: "firstName lastName image email",
      })
      .exec();
    // validate info
    if (!ratingAndReview) {
      return res.status(401).json({
        success: false,
        message: "invalid course id",
      });
    }
    //return res
    res.status(200).json({
      success: true,
      message: "All Rating and Reviews retrieved successfully.",
      data: ratingAndReview,
    });
  } catch (error) {
    console.log("Error while retrieved Rating and Reviews.", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve Rating and Reviews.",
    });
  }
};

//get all rating and review data
exports.getAllRatingAndReview = async (req, res) => {
  try {
    //*get info from DB
    const allRatingAndReview = await RatingAndReview.find({})
      .sort({ rating: "desc" })
      .populate({
        //*populating user schema's attributes selectively
        path: "user",
        select: "firstName lastName image email",
      })
      .populate({
        //*populating user schema's attributes selectively
        path: "course",
        select: "courseName",
      })
      .exec();

    //return res
    res.status(200).json({
      success: true,
      message: "All Rating and Reviews retrieved successfully.",
      data: allRatingAndReview,
    });
  } catch (error) {
    console.log("Error while retrieved all Rating and Reviews.", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve Rating and Reviews.",
    });
  }
};
