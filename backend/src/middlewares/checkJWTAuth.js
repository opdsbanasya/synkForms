const jwt = require("jsonwebtoken");
const User = require("../models/Users");

const checkJWTAuth = async (req, res, next) => {
  try {
    const token = req.cookies?.token;
    const accessMode = req.query?.mode;

    if (accessMode === "view") {
      return next();
    }

    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Unauthorized access" });
    }

    const userIdFromToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!userIdFromToken) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    const user = await User.findById(userIdFromToken._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res
        .status(401)
        .json({ success: false, message: "Invalid token signature" });
    }
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }
    res.status(400).json({ success: false, message: err.message });
  }
};

module.exports = { checkJWTAuth };
