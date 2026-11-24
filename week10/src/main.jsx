import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter } from "react-router";
import { Provider } from "react-redux";
import App from "./App.jsx";
import AuthProvider from "./context/AuthProvider.jsx";
import { store } from "./store/index.js";
import { initInstallPrompt } from "./services/install.js";
import { registerServiceWorker } from "./services/serviceWorker.js";
import "./styles/global.css";
import "./styles/layout.css";
import "./styles/components.css";
import "./styles/pages.css";
import "./styles/mobile.css";

registerServiceWorker();
initInstallPrompt();


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <HashRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </HashRouter>
    </Provider>
  </StrictMode>,
);