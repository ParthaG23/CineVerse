import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";

import { AuthProvider } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import { ContentProvider } from "./context/ContentContext";

import CineLoader from "./components/CineLoader.jsx";

/* Root element check */

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>

      <AuthProvider>
        <UIProvider>
          <ContentProvider>

            {/* Suspense handles lazy loaded routes */}
            <Suspense fallback={<CineLoader />}>
              <App />
            </Suspense>

          </ContentProvider>
        </UIProvider>
      </AuthProvider>

    </BrowserRouter>
  </StrictMode>
);