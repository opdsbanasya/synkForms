import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import { Plus, Trash2, Move, Save } from "lucide-react";
import { useDispatch } from "react-redux";
import { addForm, updateForm } from "../store/formsSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constansts";

const FormBuilder = () => {
  const { id } = useParams(); // For edit mode
  const { register, watch, setValue } = useForm();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fields, setFields] = useState([]);
  const [draggedIndex, setDraggedIndex] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const fieldTypes = [
    { value: "text", label: "Text Field" },
    { value: "email", label: "Email Field" },
    { value: "number", label: "Number Field" },
    { value: "textarea", label: "Text Area" },
    { value: "dropdown", label: "Dropdown" },
    { value: "checkbox", label: "Checkbox" },
    { value: "radio", label: "Radio Button" },
  ];

  const fetchForm = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/forms/${id}`, {
        withCredentials: true,
      });
      const formData = response.data.data;
      
      // Populate form fields
      setValue("title", formData.title);
      setValue("description", formData.description);
      setValue("backgroundColor", formData.backgroundColor);
      setValue("textColor", formData.textColor);
      setValue("fontFamily", formData.fontFamily);
      setFields(formData.fields);
    } catch (err) {
      console.log(err);
      alert("Error loading form: " + (err.response?.data?.message || err.message));
      navigate("/forms");
    } finally {
      setIsLoading(false);
    }
  }, [id, setValue, navigate]);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchForm();
    }
  }, [id, fetchForm]);

  const addField = (type) => {
    const newField = {
      id: `field_${Date.now()}`,
      type: type,
      label: `${fieldTypes.find(f => f.value === type)?.label} ${fields.length + 1}`,
      placeholder: "",
      required: false,
      options: type === "dropdown" || type === "radio" || type === "checkbox" ? ["Option 1"] : [],
    };
    setFields([...fields, newField]);
  };

  const removeField = (index) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  const updateField = (index, property, value) => {
    const newFields = [...fields];
    newFields[index][property] = value;
    setFields(newFields);
  };

  const addOption = (fieldIndex) => {
    const newFields = [...fields];
    const optionNumber = newFields[fieldIndex].options.length + 1;
    newFields[fieldIndex].options.push(`Option ${optionNumber}`);
    setFields(newFields);
  };

  const updateOption = (fieldIndex, optionIndex, value) => {
    const newFields = [...fields];
    newFields[fieldIndex].options[optionIndex] = value;
    setFields(newFields);
  };

  const removeOption = (fieldIndex, optionIndex) => {
    const newFields = [...fields];
    newFields[fieldIndex].options.splice(optionIndex, 1);
    setFields(newFields);
  };

  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    if (draggedIndex === null) return;

    const newFields = [...fields];
    const draggedField = newFields[draggedIndex];
    newFields.splice(draggedIndex, 1);
    newFields.splice(dropIndex, 0, draggedField);
    setFields(newFields);
    setDraggedIndex(null);
  };

  const saveForm = async () => {
    try {
      setIsLoading(true);
      const formData = watch();
      
      if (!formData.title) {
        alert("Form title is required");
        return;
      }

      if (fields.length === 0) {
        alert("Please add at least one field to the form");
        return;
      }

      const formPayload = {
        title: formData.title,
        description: formData.description,
        fields: fields,
        backgroundColor: formData.backgroundColor || "#ffffff",
        textColor: formData.textColor || "#000000",
        fontFamily: formData.fontFamily || "Arial",
      };

      if (isEditMode) {
        const response = await axios.put(`${BASE_URL}/forms/${id}`, formPayload, {
          withCredentials: true,
        });
        dispatch(updateForm(response.data.data));
        alert("Form updated successfully!");
      } else {
        const response = await axios.post(`${BASE_URL}/forms`, formPayload, {
          withCredentials: true,
        });
        dispatch(addForm(response.data.data));
        alert("Form created successfully!");
      }

      navigate("/forms");
    } catch (err) {
      console.log(err);
      alert(`Error ${isEditMode ? 'updating' : 'creating'} form: ` + (err.response?.data?.message || err.message));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-2xl font-bold mb-6">
          {isEditMode ? "Edit Form" : "Form Builder"}
        </h1>

        {/* Form Settings */}
        <div className="mb-8 p-4 border rounded-lg">
          <h2 className="text-lg font-semibold mb-4">Form Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Form Title *</label>
              <input
                {...register("title", { required: true })}
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Enter form title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <input
                {...register("description")}
                type="text"
                className="w-full p-2 border rounded-md"
                placeholder="Form description"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Background Color</label>
              <input
                {...register("backgroundColor")}
                type="color"
                className="w-full p-2 border rounded-md h-10"
                defaultValue="#ffffff"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Text Color</label>
              <input
                {...register("textColor")}
                type="color"
                className="w-full p-2 border rounded-md h-10"
                defaultValue="#000000"
              />
            </div>
          </div>
        </div>

        {/* Field Types */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Add Fields</h2>
          <div className="flex flex-wrap gap-2">
            {fieldTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => addField(type.value)}
                className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Fields List */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Form Fields</h2>
          {fields.length === 0 ? (
            <p className="text-gray-500">No fields added yet. Click the buttons above to add fields.</p>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, index)}
                  className="p-4 border rounded-lg bg-gray-50 cursor-move"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Move className="h-4 w-4 text-gray-400" />
                      <span className="font-medium">{field.type.toUpperCase()}</span>
                    </div>
                    <button
                      onClick={() => removeField(index)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Label</label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) => updateField(index, "label", e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Placeholder</label>
                      <input
                        type="text"
                        value={field.placeholder}
                        onChange={(e) => updateField(index, "placeholder", e.target.value)}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  </div>

                  <div className="mt-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={field.required}
                        onChange={(e) => updateField(index, "required", e.target.checked)}
                        className="mr-2"
                      />
                      Required Field
                    </label>
                  </div>

                  {/* Options for dropdown/radio/checkbox */}
                  {(field.type === "dropdown" || field.type === "radio" || field.type === "checkbox") && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium mb-2">Options</label>
                      {field.options.map((option, optionIndex) => (
                        <div key={optionIndex} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(index, optionIndex, e.target.value)}
                            className="flex-1 p-2 border rounded-md"
                          />
                          <button
                            onClick={() => removeOption(index, optionIndex)}
                            className="px-3 py-2 text-red-500 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={() => addOption(index)}
                        className="px-3 py-2 text-blue-500 hover:text-blue-700"
                      >
                        + Add Option
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            onClick={saveForm}
            disabled={isLoading}
            className="px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {isLoading ? "Saving..." : (isEditMode ? "Update Form" : "Save Form")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default FormBuilder;