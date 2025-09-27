const express = require("express");
const Form = require("../models/Form");
const FormResponse = require("../models/FormResponse");
const { checkJWTAuth } = require("../middlewares/checkJWTAuth");

const formRouter = express.Router();

// Create new form
formRouter.post("/forms", checkJWTAuth, async (req, res) => {
  try {
    // Read data
    const data = req.body;

    // Basic validation
    if (!data.title) {
      return res.status(400).json({ success: false, message: "Form title is required" });
    }

    if (!data.fields || !Array.isArray(data.fields)) {
      return res.status(400).json({ success: false, message: "Form fields are required" });
    }

    // Create new form
    const newForm = new Form({
      title: data.title,
      description: data.description || "",
      fields: data.fields,
      createdBy: req.user._id,
      backgroundColor: data.backgroundColor || "#ffffff",
      textColor: data.textColor || "#000000",
      fontFamily: data.fontFamily || "Arial",
    });

    const savedForm = await newForm.save();

    // Send response
    res.json({ success: true, data: savedForm, message: "Form created successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get all forms for logged in user
formRouter.get("/forms", checkJWTAuth, async (req, res) => {
  try {
    const forms = await Form.find({ createdBy: req.user._id }).sort({ createdAt: -1 });

    res.json({ success: true, data: forms, message: "Forms fetched successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get single form by ID
formRouter.get("/forms/:id", async (req, res) => {
  try {
    const formId = req.params.id;
    const form = await Form.findById(formId);

    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found" });
    }

    res.json({ success: true, data: form, message: "Form fetched successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Update form
formRouter.put("/forms/:id", checkJWTAuth, async (req, res) => {
  try {
    const formId = req.params.id;
    const data = req.body;

    // Check if form exists and belongs to user
    const form = await Form.findOne({ _id: formId, createdBy: req.user._id });
    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found" });
    }

    // Update form
    const updatedForm = await Form.findByIdAndUpdate(
      formId,
      {
        title: data.title || form.title,
        description: data.description !== undefined ? data.description : form.description,
        fields: data.fields || form.fields,
        backgroundColor: data.backgroundColor || form.backgroundColor,
        textColor: data.textColor || form.textColor,
        fontFamily: data.fontFamily || form.fontFamily,
        isActive: data.isActive !== undefined ? data.isActive : form.isActive,
      },
      { new: true }
    );

    res.json({ success: true, data: updatedForm, message: "Form updated successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Delete form
formRouter.delete("/forms/:id", checkJWTAuth, async (req, res) => {
  try {
    const formId = req.params.id;

    // Check if form exists and belongs to user
    const form = await Form.findOne({ _id: formId, createdBy: req.user._id });
    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found" });
    }

    // Delete form
    await Form.findByIdAndDelete(formId);

    res.json({ success: true, message: "Form deleted successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Duplicate form
formRouter.post("/forms/:id/duplicate", checkJWTAuth, async (req, res) => {
  try {
    const formId = req.params.id;

    // Check if form exists and belongs to user
    const form = await Form.findOne({ _id: formId, createdBy: req.user._id });
    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found" });
    }

    // Create duplicate
    const duplicateForm = new Form({
      title: `${form.title} (Copy)`,
      description: form.description,
      fields: form.fields,
      createdBy: req.user._id,
      backgroundColor: form.backgroundColor,
      textColor: form.textColor,
      fontFamily: form.fontFamily,
    });

    const savedForm = await duplicateForm.save();

    res.json({ success: true, data: savedForm, message: "Form duplicated successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Submit form response
formRouter.post("/forms/:id/submit", async (req, res) => {
  try {
    const formId = req.params.id;
    const data = req.body;

    // Check if form exists and is active
    const form = await Form.findOne({ _id: formId, isActive: true });
    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found or inactive" });
    }

    if (!data.responses || !Array.isArray(data.responses)) {
      return res.status(400).json({ success: false, message: "Responses are required" });
    }

    // Create form response
    const formResponse = new FormResponse({
      formId: formId,
      formTitle: form.title,
      responses: data.responses,
      submitterInfo: {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
      },
    });

    const savedResponse = await formResponse.save();

    res.json({ success: true, data: savedResponse, message: "Form submitted successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

// Get form responses
formRouter.get("/forms/:id/responses", checkJWTAuth, async (req, res) => {
  try {
    const formId = req.params.id;

    // Check if form exists and belongs to user
    const form = await Form.findOne({ _id: formId, createdBy: req.user._id });
    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found" });
    }

    // Get responses
    const responses = await FormResponse.find({ formId: formId }).sort({ submittedAt: -1 });

    res.json({ success: true, data: responses, message: "Responses fetched successfully" });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: err.message });
  }
});

module.exports = formRouter;