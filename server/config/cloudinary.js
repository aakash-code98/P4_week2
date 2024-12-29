const cloudinary = require("cloudinary").v2;
require("dotenv").config();

exports.cloudinaryConnect = () => {
  try {
    cloudinary.config({
      // config cloudinary to upload media
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
  } catch (error) {
    console.log("Error while configuring and connecting to cloudinary", error);
  }
};
