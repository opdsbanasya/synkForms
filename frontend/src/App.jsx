import React from "react";
import { Route, Routes } from "react-router";
import Home from "./Components/Home";
import Login from "./Components/Login";
import Register from "./Components/Register";
import FormsList from "./Components/FormsList";
import FormBuilder from "./Components/FormBuilder";
import FormRenderer from "./Components/FormRenderer";
import FormResponses from "./Components/FormResponses";

const App = () => {
  return (
    <Routes>
      <Route element={<Home />}>
        <Route index element={<FormsList />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forms" element={<FormsList />} />
        <Route path="/forms/create" element={<FormBuilder />} />
        <Route path="/forms/:id/edit" element={<FormBuilder />} />
        <Route path="/forms/:id/responses" element={<FormResponses />} />
      </Route>
      <Route path="/form/:id" element={<FormRenderer />} />
    </Routes>
  );
};

export default App;