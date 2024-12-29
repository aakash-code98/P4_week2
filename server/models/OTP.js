const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
  },
  otp: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now(),
    required: true,
    expires: 300,
  },
});

// Define a function to send emails
async function sendVerificationEmail(email, otp) {
  try {
    // Send the email
    const mailResponse = await mailSender(
      email,
      "Verification email from StudyNotion",
      emailTemplate(otp)
    );
    console.log("Email send successfully.", mailResponse);
  } catch (error) {
    console.log("Error occurred while sending the mail. ", error);
    throw error;
  }
}

// Define a post-save hook to send email after the document has been saved
OTPSchema.post("save", async function (next) {
  console.log("New document saved to database");

  // Only send an email when a new document is created
  if (this.isNew) {
    await sendVerificationEmail(this.email, this.otp);
  }
  next();
});

module.exports = mongoose.model("OTP", OTPSchema);
