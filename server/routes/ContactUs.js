// Import the required modules
const express = require("express");
const router = express.Router();

//handler function
const { contactUs } = require("../controllers/ContactUs");
//route
router.post("/contact", contactUs);
module.exports = router;
