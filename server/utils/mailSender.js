const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

// Create a new OAuth2 client
const OAuth2 = google.auth.OAuth2;

const oauth2Client = new OAuth2(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  "https://localhost:4000" // Redirect URL
);

oauth2Client.setCredentials({
  refresh_token: process.env.REFRESH_TOKEN,
});

//*----------------------------------------------------------
const mailSender = async (email, title, body) => {
  try {
    const accessToken = await oauth2Client.getAccessToken();
    // Create a transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: process.env.USER_EMAIL, // Your Gmail address
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken.token,
      },
    });

    // Email options
    const mailOptions = {
      from: `${process.env.USER_EMAIL}`,
      to: `${email}`,
      subject: `${title}`,
      text: body,
    };

    // Send the email
    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent. ------------------ message from utils");
    return result;
  } catch (error) {
    console.log("Error in mailSender.js", error);
  }
};

module.exports = mailSender;
