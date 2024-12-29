const mailSender = require("../utils/mailSender");
const ContactUs = require("../models/ContactUs");
require("dotenv").config();

//contact us handler
exports.contactUs = async (req, res) => {
  //get data from req.body
  const { firstName, lastName, email, phoneNumber, message } = req.body;
  //validate data
  if ((!firstName, !lastName, !email, !phoneNumber, !message)) {
    return res.status(403).json({
      success: false,
      message: "All fields required.",
    });
  }
  try {
    //save details in DB
    const ContactUsDetail = await ContactUs.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      phoneNumber: phoneNumber,
      message: message,
    });
    //send mail to self
    const myEmail = process.env.MY_EMAIL;
    const date = Date.now().toLocaleString();
    const title = "StudyNotion | Contact us | Message";
    const body = `${firstName} ${lastName} has filed the Contact Us form on ${date}. Email is : ${email} and Contact number is : ${phoneNumber}\n------------------------\nMessage is: ${message}. `;
    const mailToSelfResponse = await mailSender(myEmail, title, body);
    //send mail to guest
    const mailToClientResponse = await mailSender(
      email,
      "Contact Us from StudyNotion",
      `Hi ${firstName}. We have seen that you have contacted us. We will get to you shortly regarding your query. Thank you for your patience`
    );
    //return res
    return res.status(200).json({
      success: true,
      message: "Your message is received. We will contact you shortly.",
    });
  } catch (error) {
    console.log("Error while sending mail for contact us.", error);
    return res.status(500).json({
      success: false,
      message: "Failed to register your query. Server error",
    });
  }
};
