import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router";
import appStore from "./store/appStore.js";
import { Provider } from 'react-redux';

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Provider store={appStore}>
        <App />
      </Provider>
    </BrowserRouter>
  </StrictMode>
);
