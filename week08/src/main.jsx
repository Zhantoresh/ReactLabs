import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";
import App from "./App.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/pages.css";

// HashRouter: the route lives after "#" (…/week07/#/flights/3).
// GitHub Pages only knows real files, so with a hash every direct URL,
// refresh and Back/Forward always loads index.html and React Router
// reads the route from the hash.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <HashRouter>
      
      <AuthProvider>
        <App />
      </AuthProvider>
    </HashRouter>
  </StrictMode>,
);