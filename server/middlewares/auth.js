const jwt = require("jsonwebtoken");
require("dotenv").config();

//auth
exports.auth = async (req, res, next) => {
  try {
    //extract token
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header missing",
      });
    }
    const token =
      req.cookies.token || req.body.token || authHeader.split(" ")[1];
    //if token missing, then return response
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token missing",
      });
    }
    //verify token code
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET, {
        algorithms: ["HS256"],
      });
      req.user = decode;
      next();
    } catch (err) {
      //verification error code
      console.log("Error in verifying token", err);

      let message = "Token invalid.";

      if (err.name === "JsonWebTokenError") {
        message = "Malformed token.";
      } else if (err.name === "TokenExpiredError") {
        message = "Token expired.";
      } else if (err.name === "NotBeforeError") {
        message = "Token not active.";
      }

      return res.status(401).json({
        success: false,
        message,
      });
    }
  } catch (error) {
    console.log("Error in auth", error);
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating",
    });
  }
};

//is student
exports.isStudent = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Student") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for students only.",
      });
    }
    next();
  } catch (error) {
    console.log("Error in isStudent", error);
    return res.status(500).json({
      success: false,
      message: "User's account type cannot be verified. Please try again.",
    });
  }
};
//is admin
exports.isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for admin only.",
      });
    }
    next();
  } catch (error) {
    console.log("Error in isAdmin", error);
    return res.status(500).json({
      success: false,
      message: "User's account type cannot be verified. Please try again.",
    });
  }
};

//is instructor
exports.isInstructor = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Instructor") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for instructor only.",
      });
    }
    next();
  } catch (error) {
    console.log("Error in isInstructor", error);
    res.status(500).json({
      success: false,
      message: "User's account type cannot be verified. Please try again.",
    });
  }
};
