const Category = require("../models/Category");

//create category ka handler function

exports.createCategory = async (req, res) => {
  try {
    // fetch data
    const { name, description } = req.body;
    // validate data
    if (!name || !description) {
      return res.status(401).json({
        success: false,
        message: "All fields are required.",
      });
    }
    //create entry in DB
    await Category.create({
      name: name,
      description: description,
    });
    // send response
    return res.status(200).json({
      success: true,
      message: "Category created successfully.",
    });
  } catch (error) {
    console.log("Error while creating category.", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create Category.",
    });
  }
};

//getAllCategories handler function
exports.showAllCategories = async (req, res) => {
  try {
    const allCategories = await Category.find(
      {},
      { name: true, description: true }
    );
    return res.status(200).json({
      success: true,
      message: "All categories retrieved successfully.",
      data: allCategories,
    });
  } catch (error) {
    console.log("Error while retrieved categories.", error);
    return res.status(500).json({
      success: false,
      message: "Failed to retrieved all Categories.",
    });
  }
};

//category page details
exports.categoryPageDetails = async (req, res) => {
  try {
    //get category id
    const categoryId = req.body.categoryId;
    //get courses for specific id
    const selectedCategory = await Category.findById({ _id: categoryId })
      .populate("courses")
      .exec();
    //validate if courses exists
    if (!selectedCategory) {
      return res.status(404).json({
        success: false,
        message: "Data not found.",
      });
    }
    //get courses for different category
    const differentCategories = await Category.find({
      _id: { $ne: categoryId }, //$ne = not equal
    })
      .populate("courses")
      .exec();
    //get top selling course
    const topSellingCategories = await Category.find({
      _id: { $ne: categoryId }, //$ne = not equal
    })
      .populate("courses")
      .exec();
    //return res
    return res.status(200).json({
      success: true,
      data: {
        selectedCategory,
        differentCategories,
        topSellingCategories,
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      success: false,
      message: "Failed to get data. Server error.",
    });
  }
};
