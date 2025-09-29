import React, { useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router";
import { Plus, Edit, Trash2, Copy, Eye, BarChart } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { setForms, setLoading, removeForm, addForm, updateForm } from "../store/formsSlice";
import axios from "axios";
import { BASE_URL } from "../utils/constansts";

const FormsList = () => {
  const dispatch = useDispatch();
  const { forms, loading } = useSelector((store) => store.forms);
  const navigate = useNavigate();

  const fetchForms = useCallback(async () => {
    try {
      dispatch(setLoading(true));
      const response = await axios.get(`${BASE_URL}/forms`, {
        withCredentials: true,
      });
      dispatch(setForms(response.data.data));
    } catch (err) {
      console.log(err);
      alert("Error loading forms: " + (err.response?.data?.message || err.message));
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const deleteForm = async (formId) => {
    if (!confirm("Are you sure you want to delete this form? This action cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(`${BASE_URL}/forms/${formId}`, {
        withCredentials: true,
      });
      dispatch(removeForm(formId));
      alert("Form deleted successfully");
    } catch (err) {
      console.log(err);
      alert("Error deleting form: " + (err.response?.data?.message || err.message));
    }
  };

  const duplicateForm = async (formId) => {
    try {
      const response = await axios.post(`${BASE_URL}/forms/${formId}/duplicate`, {}, {
        withCredentials: true,
      });
      dispatch(addForm(response.data.data));
      alert("Form duplicated successfully");
    } catch (err) {
      console.log(err);
      alert("Error duplicating form: " + (err.response?.data?.message || err.message));
    }
  };

  const toggleFormStatus = async (formId, currentStatus) => {
    try {
      const response = await axios.put(`${BASE_URL}/forms/${formId}`, {
        isActive: !currentStatus
      }, {
        withCredentials: true,
      });
      dispatch(updateForm(response.data.data));
    } catch (err) {
      console.log(err);
      alert("Error updating form status: " + (err.response?.data?.message || err.message));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Loading forms...</div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">My Forms</h1>
          <Link
            to="/forms/create"
            className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create New Form
          </Link>
        </div>
      </div>

      {!forms || forms.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">No forms created yet</h2>
          <p className="text-gray-500 mb-6">Get started by creating your first form</p>
          <Link
            to="/forms/create"
            className="bg-blue-500 text-white px-6 py-3 rounded-md hover:bg-blue-600 inline-flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            Create Your First Form
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {forms.map((form) => (
            <div key={form._id} className="bg-white rounded-lg shadow-md border hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold truncate">{form.title}</h3>
                    {form.description && (
                      <p className="text-gray-600 text-sm mt-1 line-clamp-2">{form.description}</p>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        form.isActive 
                          ? "bg-green-100 text-green-800" 
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {form.isActive ? "Active" : "Inactive"}
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-500 mb-4">
                  <p>{form.fields.length} fields</p>
                  <p>Created: {new Date(form.createdAt).toLocaleDateString()}</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => navigate(`/forms/${form._id}/edit`)}
                    className="flex-1 bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 flex items-center justify-center gap-1 text-sm"
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                  
                  <button
                    onClick={() => window.open(`/form/${form._id}`, '_blank')}
                    className="flex-1 bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 flex items-center justify-center gap-1 text-sm"
                  >
                    <Eye className="h-4 w-4" />
                    View
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  <button
                    onClick={() => navigate(`/forms/${form._id}/responses`)}
                    className="flex-1 bg-purple-500 text-white px-3 py-2 rounded-md hover:bg-purple-600 flex items-center justify-center gap-1 text-sm"
                  >
                    <BarChart className="h-4 w-4" />
                    Responses
                  </button>
                  
                  <button
                    onClick={() => duplicateForm(form._id)}
                    className="flex-1 bg-gray-500 text-white px-3 py-2 rounded-md hover:bg-gray-600 flex items-center justify-center gap-1 text-sm"
                  >
                    <Copy className="h-4 w-4" />
                    Duplicate
                  </button>
                </div>

                <div className="flex gap-2 mt-2">
                  <button
                    onClick={() => toggleFormStatus(form._id, form.isActive)}
                    className={`flex-1 px-3 py-2 rounded-md text-sm font-medium ${
                      form.isActive 
                        ? "bg-red-100 text-red-700 hover:bg-red-200" 
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {form.isActive ? "Deactivate" : "Activate"}
                  </button>
                  
                  <button
                    onClick={() => deleteForm(form._id)}
                    className="flex-1 bg-red-500 text-white px-3 py-2 rounded-md hover:bg-red-600 flex items-center justify-center gap-1 text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FormsList;