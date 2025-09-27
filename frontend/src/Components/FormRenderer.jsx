import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { Send } from "lucide-react";
import axios from "axios";
import { BASE_URL } from "../utils/constansts";

const FormRenderer = () => {
  const { id } = useParams();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();
  const [form, setForm] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetchForm();
  }, [id]);

  const fetchForm = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get(`${BASE_URL}/forms/${id}`);
      setForm(response.data.data);
    } catch (err) {
      console.log(err);
      alert(
        "Error loading form: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setIsLoading(false);
    }
  };

  const submitForm = async () => {
    try {
      setIsSubmitting(true);
      const formData = watch();

      // Prepare responses
      const responses = form.fields.map((field) => {
        let value = formData[field.id];

        // Handle checkbox arrays
        if (field.type === "checkbox") {
          const checkboxValues = [];
          field.options.forEach((option, index) => {
            if (formData[`${field.id}.${index}`]) {
              checkboxValues.push(option);
            }
          });
          value = checkboxValues;
        }

        return {
          fieldId: field.id,
          fieldLabel: field.label,
          fieldType: field.type,
          value: value || (field.type === "checkbox" ? [] : ""),
        };
      });

      await axios.post(`${BASE_URL}/forms/${id}/submit`, { responses });

      setSubmitted(true);
    } catch (err) {
      console.log(err);
      alert(
        "Error submitting form: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderField = (field) => {
    const commonProps = {
      id: field.id,
      ...register(field.id, { required: field.required }),
      className:
        "w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500",
    };

    switch (field.type) {
      case "text":
        return (
          <input type="text" placeholder={field.placeholder} {...commonProps} />
        );

      case "email":
        return (
          <input
            type="email"
            placeholder={field.placeholder}
            {...commonProps}
          />
        );

      case "number":
        return (
          <input
            type="number"
            placeholder={field.placeholder}
            {...commonProps}
          />
        );

      case "textarea":
        return (
          <textarea rows={4} placeholder={field.placeholder} {...commonProps} />
        );

      case "dropdown":
        // Ensure field has options array
        if (
          !field.options ||
          !Array.isArray(field.options) ||
          field.options.length === 0
        ) {
          return (
            <div className="text-gray-500 italic">
              No options configured for this dropdown field
            </div>
          );
        }

        return (
          <select {...commonProps}>
            <option value="">Select an option</option>
            {field.options.map((option, index) => (
              <option key={index} value={option}>
                {option}
              </option>
            ))}
          </select>
        );

      case "radio":
        // Ensure field has options array
        if (
          !field.options ||
          !Array.isArray(field.options) ||
          field.options.length === 0
        ) {
          return (
            <div className="text-gray-500 italic">
              No options configured for this radio field
            </div>
          );
        }

        return (
          <div className="space-y-2">
            {field.options.map((option, index) => (
              <label key={index} className="flex items-center cursor-pointer">
                <input
                  type="radio"
                  name={field.id}
                  value={option}
                  {...register(field.id, { required: field.required })}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500"
                />
                <span>{option && option}</span>
              </label>
            ))}
          </div>
        );

      case "checkbox":
        // Ensure field has options array

        return (
          <div className="space-y-2">
            {field.options.map((option, index) => (
              <label key={index} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  value={option}
                  {...register(`${field.id}.${index}`)}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        );

      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading form...</div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-500">Form not found</div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
          <div className="text-green-600 text-6xl mb-4">✓</div>
          <h2 className="text-2xl font-bold text-green-800 mb-2">
            Form Submitted Successfully!
          </h2>
          <p className="text-green-700">
            Thank you for your response. Your form has been submitted.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div
        className="rounded-lg shadow-lg p-8"
        style={{
          backgroundColor: form.backgroundColor || "#ffffff",
          color: form.textColor || "#000000",
          fontFamily: form.fontFamily || "Arial",
        }}
      >
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">{form.title}</h1>
          {form.description && (
            <p className="text-lg opacity-80">{form.description}</p>
          )}
        </div>

        <form onSubmit={handleSubmit(submitForm)} className="space-y-6">
          {form.fields.map((field) => (
            <div key={field.id} className="space-y-2">
              <label htmlFor={field.id} className="block font-medium text-sm">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>

              {renderField(field)}

              {errors[field.id] && (
                <p className="text-red-500 text-sm">This field is required</p>
              )}
            </div>
          ))}

          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-500 text-white py-3 px-6 rounded-md hover:bg-blue-600 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
              {isSubmitting ? "Submitting..." : "Submit Form"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormRenderer;
