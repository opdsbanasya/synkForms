const express = require("express");
const User = require("../models/Users");
const {
  validateSignupData,
  validateLoginData,
} = require("../utils/validations");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");
const { checkJWTAuth } = require("../middlewares/checkJWTAuth");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    // Read Data
    const data = req.body;

    // Sanitization and validation
    const sanitizedData = validateSignupData(data);

    // Check for duplicate email
    const isDuplicateEmail = await User.findOne({ email: sanitizedData.email });
    if (isDuplicateEmail) {
      return res.status(400).json({ message: "Email is already exists" });
    }

    // Password Hash
    const plainPassword = sanitizedData.password;
    const passwordHash = await bcrypt.hash(plainPassword, 10);

    // Register the User
    const result = await new User({
      email: sanitizedData.email,
      name: sanitizedData.name,
      password: passwordHash,
    });
    await result.save();

    // response
    res.json({ success: true, message: "User Registers" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    // Read the creadentils
    const data = req.body;

    // sanitize the data
    const sanitizedData = validateLoginData(data);

    // check user is exists ir not
    const user = await User.findOne({ email: sanitizedData.email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // compare password
    const plainPassword = sanitizedData.password;
    const passwordHash = user.password;
    const isPasswordMatched = await user.validatePassword(plainPassword);

    if (!isPasswordMatched) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid Credentials" });
    }

    // generate JWT
    const jwtToken = await user.getJWT();

    // Set Cookie
    res.cookie("token", jwtToken, {
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    });

    // send response
    const { _id, name, email, userPhoto } = user;
    res.json({
      success: true,
      data: { _id, name, email, userPhoto },
      message: "Logged in",
    });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

authRouter.post("/logout", checkJWTAuth, (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ success: true, message: "Logged out" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = authRouter;
