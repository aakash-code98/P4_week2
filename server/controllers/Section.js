const Section = require("../models/Section");
const Course = require("../models/Course");
const SubSection = require("../models/SubSection");

//create section
exports.createSection = async (req, res) => {
  try {
    //fetch data
    const { sectionName, courseId } = req.body;
    //validate data
    if (!sectionName || !courseId) {
      return res.status(401).json({
        success: false,
        message: "Missing Properties.",
      });
    }
    //create section
    const newSection = await Section.create({ sectionName });
    //update course
    const updatedCourseDetails = await Course.findByIdAndUpdate(
      { _id: courseId },
      { $push: { courseContent: newSection._id } },
      { new: true }
    )
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
        },
      })
      .exec();
    //return res
    res.status(200).json({
      success: true,
      message: "Section created successfully",
      data: updatedCourseDetails,
    });
  } catch (error) {
    console.log("Error ocurred while creating section.", error);
    res.status(500).json({
      success: false,
      message: "Failed to create section",
    });
  }
};
//update section
exports.updateSection = async (req, res) => {
  try {
    //fetch data
    const { updatedName, sectionId, courseId } = req.body;
    //validate data
    if (!updatedName || !sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "Missing properties.",
      });
    }
    //update DB
    const section = await Section.findByIdAndUpdate(
      sectionId,
      { sectionName: updatedName },
      { new: true }
    );
    //get course
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();
    console.log("--- COURSE----", course);
    console.log("--- COURSEID----", courseId);
    //return res
    res.status(200).json({
      success: true,
      message: "Section updated successfully.",
      data: course,
    });
  } catch (error) {
    console.log("Error while updating Section", error);
    res.status(500).json({
      success: false,
      message: "Failed to update the section.",
    });
  }
};
//delete section
exports.deleteSection = async (req, res) => {
  try {
    //get sectionId and courseId-
    const { sectionId, courseId } = req.body;

    const section = await Section.findById(sectionId);
    if (!section) {
      return res
        .status(404)
        .json({ success: false, message: "Section not found" });
    }
    //delete entry from subsection
    await SubSection.deleteMany({ _id: { $in: section.subSection } });
    //find by id and delete
    await Section.findByIdAndDelete(sectionId);
    // delete entry from course schema
    await Course.findByIdAndUpdate(courseId, {
      $pull: { courseContent: sectionId },
    });
    //find the updated course and return
    const course = await Course.findById(courseId)
      .populate({
        path: "courseContent",
        populate: { path: "subSection" },
      })
      .exec();

    //send res
    res.status(200).json({
      success: true,
      message: "Section deleted successfully.",
      data: course,
    });
  } catch (error) {
    console.log("Error while deleting Section", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete the section.",
    });
  }
};
