import { createSlice } from "@reduxjs/toolkit";

const formsSlice = createSlice({
  name: "forms",
  initialState: {
    forms: [],
    currentForm: null,
    responses: [],
    loading: false,
    error: null,
  },
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setForms: (state, action) => {
      state.forms = action.payload;
      state.loading = false;
      state.error = null;
    },
    addForm: (state, action) => {
      state.forms.push(action.payload);
    },
    updateForm: (state, action) => {
      const index = state.forms.findIndex(form => form._id === action.payload._id);
      if (index !== -1) {
        state.forms[index] = action.payload;
      }
    },
    removeForm: (state, action) => {
      state.forms = state.forms.filter(form => form._id !== action.payload);
    },
    setCurrentForm: (state, action) => {
      state.currentForm = action.payload;
    },
    setResponses: (state, action) => {
      state.responses = action.payload;
    },
    clearForms: (state) => {
      state.forms = [];
      state.currentForm = null;
      state.responses = [];
      state.loading = false;
      state.error = null;
    },
  },
});

export const {
  setLoading,
  setError,
  setForms,
  addForm,
  updateForm,
  removeForm,
  setCurrentForm,
  setResponses,
  clearForms,
} = formsSlice.actions;

export default formsSlice.reducer;