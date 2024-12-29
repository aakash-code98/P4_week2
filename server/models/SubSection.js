const mongoose = require("mongoose");

const subSectionSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
  },
  timeDuration: {
    type: String,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  videoUrl: {
    type: String,
  },
});

module.exports = mongoose.model("SubSection", subSectionSchema);
