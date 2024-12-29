// Import the required modules
const express = require("express");
const router = express.Router();

const { capturePayments, verifySignature } = require("../controllers/Payments");
const { auth, isStudent } = require("../middlewares/auth");



router.post("/capturePayment", auth, isStudent, capturePayments);
router.post("/verifySignature", verifySignature);

module.exports = router;
