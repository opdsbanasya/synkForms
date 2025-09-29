import React, { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router";
import { ArrowLeft, Download, Calendar, User } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentForm, setResponses } from "../store/formsSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constansts";

const FormResponses = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentForm, responses } = useSelector((store) => store.forms);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFormAndResponses = useCallback(async () => {
    try {
      setIsLoading(true);
      // Fetch form details and responses in parallel
      const [formResponse, responsesResponse] = await Promise.all([
        axios.get(`${BASE_URL}/forms/${id}`, { withCredentials: true }),
        axios.get(`${BASE_URL}/forms/${id}/responses`, {
          withCredentials: true,
        }),
      ]);

      dispatch(setCurrentForm(formResponse.data.data));
      dispatch(setResponses(responsesResponse.data.data));
    } catch (err) {
      console.log(err);
      alert(
        "Error loading form responses: " +
          (err.response?.data?.message || err.message)
      );
    } finally {
      setIsLoading(false);
    }
  }, [id, dispatch]);

  useEffect(() => {
    fetchFormAndResponses();
  }, [fetchFormAndResponses]);

  const exportToCSV = () => {
    if (!responses.length) return;

    // Prepare CSV headers
    const headers = ["Submission Date", "Submission Time"];
    if (currentForm?.fields) {
      currentForm.fields.forEach((field) => {
        headers.push(field.label);
      });
    }

    // Prepare CSV rows
    const csvRows = [headers.join(",")];

    responses.forEach((response) => {
      const row = [];
      const submissionDate = new Date(response.submittedAt);
      row.push(submissionDate.toLocaleDateString());
      row.push(submissionDate.toLocaleTimeString());

      // Add response values
      if (currentForm?.fields) {
        currentForm.fields.forEach((field) => {
          const responseField = response.responses.find(
            (r) => r.fieldId === field.id
          );
          let value = responseField ? responseField.value : "";

          // Handle arrays (checkbox responses)
          if (Array.isArray(value)) {
            value = value.join("; ");
          }

          // Escape commas and quotes in CSV
          if (
            typeof value === "string" &&
            (value.includes(",") || value.includes('"'))
          ) {
            value = `"${value.replace(/"/g, '""')}"`;
          }

          row.push(value);
        });
      }

      csvRows.push(row.join(","));
    });

    // Create and download CSV file
    const csvContent = csvRows.join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${currentForm?.title || "form"}_responses.csv`;
    link.click();
    window.URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading responses...</div>
      </div>
    );
  }

  if (!currentForm) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg text-red-500">Form not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Link
            to="/forms"
            className="text-blue-500 hover:text-blue-700 flex items-center gap-2"
          >
            <ArrowLeft className="h-5 w-5" />
            Back to Forms
          </Link>
        </div>

        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">
              {currentForm.title} - Responses
            </h1>
            <p className="text-gray-600 mt-1">
              Total responses:{" "}
              <span className="font-semibold">{responses.length}</span>
            </p>
          </div>

          {responses.length > 0 && (
            <button
              onClick={exportToCSV}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 flex items-center gap-2"
            >
              <Download className="h-5 w-5" />
              Export CSV
            </button>
          )}
        </div>
      </div>

      {responses.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <div className="text-gray-400 text-6xl mb-4">📊</div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">
            No responses yet
          </h2>
          <p className="text-gray-500">
            Share your form link to start collecting responses
          </p>
          <div className="mt-4 p-3 bg-blue-50 rounded-md inline-block">
            <p className="text-sm text-blue-700 font-medium">Form Link:</p>
            <code className="text-blue-800 text-sm">
              <a href={`window.location.origin}/form/${currentForm._id}`} target="_blank">
                {window.location.origin}/form/{currentForm._id}
              </a>
            </code>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    #
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Submitted Time
                  </th>
                  {currentForm?.fields?.map((field, index) => (
                    <th
                      key={index}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {field.label}
                      <span className="ml-2 text-xs text-gray-400 bg-gray-200 px-1 py-0.5 rounded normal-case">
                        {field.type}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {responses.map((response, index) => (
                  <tr key={response._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(response.submittedAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-4 w-4" />
                        {new Date(response.submittedAt).toLocaleTimeString()}
                      </div>
                    </td>
                    {currentForm?.fields?.map((field, fieldIndex) => {
                      const responseField = response.responses.find(
                        (r) => r.fieldId === field.id
                      );
                      return (
                        <td
                          key={fieldIndex}
                          className="px-6 py-4 text-sm text-gray-900"
                        >
                          {responseField ? (
                            Array.isArray(responseField.value) ? (
                              responseField.value.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {responseField.value.map((val, valIndex) => (
                                    <span
                                      key={valIndex}
                                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
                                    >
                                      {val}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span className="text-gray-400 italic">
                                  No selection
                                </span>
                              )
                            ) : responseField.value ? (
                              <div className="max-w-xs">
                                <p className="whitespace-pre-wrap break-words">
                                  {responseField.value}
                                </p>
                              </div>
                            ) : (
                              <span className="text-gray-400 italic">
                                No response
                              </span>
                            )
                          ) : (
                            <span className="text-gray-400 italic">
                              No response
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default FormResponses;
