const mongoose = require("mongoose");
const validator = require("validator");
const { DEFAULT_PROFILE_PHOTO } = require("../utils/constants");
const bcrypt = require("bcrypt");
const jsonwebtoken = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      maxLength: 100,
      minLength: 5,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
      trim: true,
      max: 255,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email");
        }
      },
    },
    password: {
      type: String,
      required: true,
      maxLength: 128,
    },
    userPhoto: {
      type: String,
      default: DEFAULT_PROFILE_PHOTO,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL");
        }
      },
    },
  },
  { timestamps: true }
);

userSchema.methods.getHash = async function (plainPassword) {
  const passwordHash = await bcrypt.hash(plainPassword, 10);
  return passwordHash;
};

userSchema.methods.validatePassword = async function (plainPasswordFromUser) {
  const passwordHash = this.password;
  const isPasswordMatched = await bcrypt.compare(
    plainPasswordFromUser,
    passwordHash
  );
  return isPasswordMatched;
};

userSchema.methods.getJWT = async function () {
  const user = this;
  const token = await jsonwebtoken.sign({ _id: user._id }, process.env.JWT_SECRET_KEY, {
    expiresIn: "7d",
  });
  return token;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
