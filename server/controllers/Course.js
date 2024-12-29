const Course = require("../models/Course");
const Category = require("../models/Category");
const User = require("../models/User");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress");
const { uploadImageToCloudinary } = require("../utils/imageUploader");
const { convertSecondsToDuration } = require("../utils/secToDuration");

//createCourse handler function
exports.createCourse = async (req, res) => {
  try {
    //data fetch
    let {
      courseName,
      courseDescription,
      whatYouWillLearn,
      price,
      category,
      tag,
      status,
      instructions,
    } = req.body;

    const userId = req.user.id;
    //file fetch
    const thumbnail = req.files.thumbnailImage;
    if (!thumbnail)
      return res
        .status(500)
        .json({ success: false, message: "couldn't get thumbnail." });

    //validation
    if (
      !courseName ||
      !courseDescription ||
      !whatYouWillLearn ||
      !price ||
      !category ||
      !tag
    ) {
      return res.status(401).json({
        success: false,
        message: "All fields are necessary.",
      });
    }
    if (!status || status === undefined) {
      status = "Draft";
    }

    // Check if the user is an instructor
    const instructorDetails = await User.findById(userId, {
      accountType: "Instructor",
    });

    if (!instructorDetails) {
      return res.status(404).json({
        success: false,
        message: " Instructor details not found.",
      });
    }

    //category value
    const filter = { _id: category };
    const categoryDetails = await Category.findOne(filter);
    if (!categoryDetails) {
      return res.status(401).json({
        success: false,
        message: " Category details not found.",
      });
    }

    //image upload and get url
    const thumbnailUploadResponse = await uploadImageToCloudinary(
      thumbnail,
      process.env.FOLDER_NAME
    );

    //create course entry in Course DB
    const newCourse = await Course.create({
      courseName: courseName,
      courseDescription: courseDescription,
      instructor: instructorDetails._id,
      whatYouWillLearn: whatYouWillLearn,
      price: price,
      category: categoryDetails._id,
      thumbnail: thumbnailUploadResponse.secure_url,
      tag: tag,
      status: status,
      instructions: instructions,
    });

    //create course entry in User DB
    await User.findByIdAndUpdate(
      { _id: instructorDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    //create course entry in Category DB
    await Category.findByIdAndUpdate(
      { _id: categoryDetails._id },
      {
        $push: {
          courses: newCourse._id,
        },
      },
      { new: true }
    );

    //return response
    return res.status(200).json({
      success: true,
      message: "Course created successfully.",
      data: newCourse,
    });
  } catch (error) {
    console.log("Error while creating course.", error);
    return res.status(500).json({
      success: false,
      message: "Sorry couldn't create course. Please try again.",
    });
  }
};

//getAllCourse handler function
exports.getAllCourses = async (req, res) => {
  try {
    const allCourses = await Course.find(
      { status: "Published" },
      {
        courseName: true,
        price: true,
        thumbnail: true,
        instructor: true,
        ratingAndReviews: true,
        studentsEnrolled: true,
        courseDescription: true,
        category: true,
      }
    )
      .populate("instructor")
      .exec();

    res.status(200).json({
      success: true,
      message: "Data for all courses fetched successfully.",
      data: allCourses,
    });
  } catch (error) {
    console.log("Error while getting all courses" + error);
    res.status(500).json({
      success: false,
      message: "Cannot fetch courses.",
      error: error.message,
    });
  }
};

//get course details
exports.getCourseDetails = async (req, res) => {
  try {
    //get course id
    const { courseId } = req.body;
    //find course details
    const courseDetails = await Course.find({ _id: courseId })
      .populate({
        path: "instructor",
        populate: {
          path: "additionDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subsection",
        },
      });
    //validation
    if (!courseDetails) {
      return res.status(401).json({
        success: false,
        message: `Could not  find the course with ${courseId}`,
      });
    }
    //return res

    res.status(200).json({
      success: true,
      message: "Course details fetched successfully.",
      data: courseDetails,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//delete course
exports.deleteCourse = async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      throw new Error("Course Id is required");
    }
    //find course
    const course = await Course.findById(courseId);
    if (!course) {
      throw new Error("Course not found");
    }

    //unenroll students from the course
    const enrolledStudents = course.studentsEnrolled;
    for (const studentId of enrolledStudents) {
      await User.findByIdAndUpdate(studentId, { $pull: { courses: courseId } });
    }

    const courseSections = course.courseContent;

    // Delete subsections
    for (const sectionId of courseSections) {
      const section = await Section.findById(sectionId);
      if (section) {
        const subSections = section.subSection;
        for (const subSectionId of subSections) {
          await SubSection.findByIdAndDelete(subSectionId);
        }
      }
      //Delete Section
      await Section.findByIdAndDelete(sectionId);
    }

    //Delete Course
    await Course.findByIdAndDelete(courseId);
    return res
      .status(200)
      .json({ success: true, message: "Course deletion successful" });
  } catch (error) {
    console.log("Error in delete Course-----", error);
    return res.status(500).json({
      success: false,
      message: "Couldn't delete course",
      error: error.message,
    });
  }
};

//edit course
exports.editCourse = async (req, res) => {
  try {
    //get course id
    const { courseId } = req.body;
    const updates = req.body;
    //find course details
    const course = await Course.findById(courseId);
    //validation
    if (!course) {
      return res.status(401).json({
        success: false,
        message: `Could not  find the course with ${courseId}`,
      });
    }
    //if thumbnail Image is found, update it
    if (req.files) {
      const thumbnail = req.files.thumbnailImage;
      const thumbnailImage = await uploadImageToCloudinary(
        thumbnail,
        process.env.FOLDER_NAME
      );
      course.thumbnail = thumbnailImage.secure_url;
      console.log("thumbnail updated");
    }
    // Update only the fields that are present in the req body
    for (const key in updates) {
      if (updates.hasOwnProperty(key)) {
        if (key === "tag" || key === "instructions") {
          course[key] = JSON.parse(updates[key]);
        } else {
          course[key] = updates[key];
        }
      }
    }
    // save course
    await course.save();

    const updatedCourse = await Course.findOne({ _id: courseId })
      .populate({
        path: "instructor",
        populate: { path: "additionalDetails" },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({ path: "courseContent", populate: { path: "subSection" } })
      .exec();
    //return res
    res.status(200).json({
      success: true,
      message: "Course updated successfully.",
      data: updatedCourse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

//getFullCourseDetails
exports.getFullCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id;
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReviews")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();

    let courseProgressCount = await CourseProgress.findOne({
      courseID: courseId,
      userId: userId,
    });

    console.log("courseProgressCount : ", courseProgressCount);

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      });
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0;
    courseDetails.courseContent.forEach((content) => {
      content.subSection.forEach((subSection) => {
        const timeDurationInSeconds = parseInt(subSection.timeDuration);
        totalDurationInSeconds += timeDurationInSeconds;
      });
    });

    const totalDuration = convertSecondsToDuration(totalDurationInSeconds);

    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
        completedVideos: courseProgressCount?.completedVideos
          ? courseProgressCount?.completedVideos
          : [],
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
//getInstructorCourses
exports.getInstructorCourses = async (req, res) => {
  try {
    //get instructor id
    const instructorId = req.user.id;
    if (!instructorId) {
      return res.status(401).json({
        success: false,
        message: "Instructor Id is required",
      });
    }
    //Find all courses belonging to the instructor
    const instructorCourses = await Course.find({ _id: instructorId }).sort({
      createdAt: -1,
    });
    //Return the instructor's courses
    return res.status(200).json({
      success: true,
      data: instructorCourses,
      message: "Courses fetched successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch Instructor Courses.",
      error: error.message,
    });
  }
};
