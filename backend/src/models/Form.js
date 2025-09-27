const mongoose = require("mongoose");

const formFieldSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ["text", "email", "number", "textarea", "dropdown", "checkbox", "radio"],
  },
  label: {
    type: String,
    required: true,
    trim: true,
    maxLength: 200,
  },
  placeholder: {
    type: String,
    trim: true,
    maxLength: 200,
  },
  required: {
    type: Boolean,
    default: false,
  },
  options: [{
    type: String,
    trim: true,
    maxLength: 100,
  }],
});

const formSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxLength: 200,
    },
    description: {
      type: String,
      trim: true,
      maxLength: 500,
    },
    fields: [formFieldSchema],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    backgroundColor: {
      type: String,
      default: "#ffffff",
    },
    textColor: {
      type: String,
      default: "#000000",
    },
    fontFamily: {
      type: String,
      default: "Arial",
    },
  },
  { timestamps: true }
);

const Form = mongoose.model("Form", formSchema);

module.exports = Form;