const SubSection = require("../models/SubSection");
const Section = require("../models/Section");
const uploadImageToCloudinary = require("../utils/imageUploader");

//create subSection
exports.createSubSection = async (req, res) => {
  try {
    //fetch data
    const { title, description, timeDuration, sectionId } = req.body;
    const video = req.files.video;
    //validate data
    if (!title || !description || !sectionId) {
      return res.status(401).json({
        success: false,
        message: "Missing Properties.",
      });
    }
    if (!video) {
      return res.status(401).json({
        success: false,
        message: "Missing Video.",
      });
    }
    // upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    console.log("Upload details in create sub section --- ", uploadDetails);
    //create subSection
    const subSection = await SubSection.create({
      title: title,
      timeDuration: timeDuration,
      description: description,
      videoUrl: uploadDetails.secure_url,
    });
    //update section
    const updatedSection = await Section.findByIdAndUpdate(
      { _id: sectionId },
      { $push: { subSection: subSection._id } },
      { new: true }
    )
      .populate("subSection")
      .exec();
    console.log("updated section Details " + updatedSection);

    //return res
    res.status(200).json({
      success: true,
      message: "SubSection created successfully",
      data: updatedSection,
    });
  } catch (error) {
    console.log("Error ocurred while creating subSection.", error);
    res.status(500).json({
      success: false,
      message: "Failed to create subSection",
    });
  }
};
//update subSection
exports.updateSubSection = async (req, res) => {
  try {
    //fetch data
    const { subSectionId, description, timeDuration, title, sectionId } =
      req.body;
    let video;
    //validate data
    if (!title || !description || !subSectionId) {
      return res.status(400).json({
        success: false,
        message: "Missing properties.",
      });
    }
    if (req.files && req.files.video !== undefined) {
      video = req.files.videoFile;
    }
    if (!video)
      return res
        .status(404)
        .json({ success: false, message: "Video not received." });
    //upload video to cloudinary
    const uploadDetails = await uploadImageToCloudinary(
      video,
      process.env.FOLDER_NAME
    );
    //update DB
    const updatedSubSection = await SubSection.findByIdAndUpdate(
      { _id: subSectionId },
      {
        title: title,
        description: description,
        timeDuration: timeDuration,
        videoUrl: uploadDetails.secure_url,
      },
      { new: true }
    );
    //response data
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );
    //return res
    res.status(200).json({
      success: true,
      message: "SubSection updated successfully.",
      data: updatedSection,
    });
  } catch (error) {
    console.log("Error while updating SubSection", error);
    res.status(500).json({
      success: false,
      message: "Failed to update the subSection.",
    });
  }
};
//delete subSection
exports.deleteSubSection = async (req, res) => {
  try {
    //getId - assuming that id send in params
    const { subSectionId, sectionId } = req.params;
    //find by id and delete
    const subSection = await SubSection.findByIdAndDelete({
      _id: subSectionId,
    });
    if (!subSection)
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found." });
    // delete entry from section schema
    await Section.findByIdAndDelete(
      {
        _id: sectionId,
      },
      { $pull: { subSection: subSectionId } }
    );
    //response data
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    );
    //send res
    res.status(200).json({
      success: true,
      message: "SubSection deleted successfully.",
      data: updatedSection,
    });
  } catch (error) {
    console.log("Error while deleting SubSection", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete the SubSection.",
    });
  }
};
