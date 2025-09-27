const mongoose = require("mongoose");

const responseFieldSchema = new mongoose.Schema({
  fieldId: {
    type: String,
    required: true,
  },
  fieldLabel: {
    type: String,
    required: true,
  },
  fieldType: {
    type: String,
    required: true,
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true,
  },
});

const formResponseSchema = new mongoose.Schema(
  {
    formId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Form",
      required: true,
    },
    formTitle: {
      type: String,
      required: true,
    },
    responses: [responseFieldSchema],
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    submitterInfo: {
      ip: String,
      userAgent: String,
    },
  },
  { timestamps: true }
);

const FormResponse = mongoose.model("FormResponse", formResponseSchema);

module.exports = FormResponse;