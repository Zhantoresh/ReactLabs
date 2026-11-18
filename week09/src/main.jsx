import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";
import { QueryClientProvider } from "@tanstack/react-query";
import App from "./App.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import { queryClient } from "./services/queryClient.js";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/pages.css";

// HashRouter: the route lives after "#" (…/week08/#/flights/3), so direct URLs and refresh
// work on GitHub Pages.
// QueryClientProvider: one TanStack Query cache for the whole app.
// AuthProvider: the Firebase user for the whole app.
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </HashRouter>
    </QueryClientProvider>
  </StrictMode>,
);