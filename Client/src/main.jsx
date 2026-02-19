import { StrictMode, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.jsx";
import "./index.css";

// 🎯 Context Providers
import { AuthProvider } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import { ContentProvider } from "./context/ContentContext";
import CineLoader from "./components/CineLoader.jsx";

// 🧠 Root Element (safe check)
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
    <BrowserRouter>
      {/* 🔐 Auth (Global & Rare Updates) */}
      <AuthProvider>
        {/* 🎛 UI State (Sidebar, Modals, etc.) */}
        <UIProvider>
          {/* 🎬 Content State (Search, Type) */}
          <ContentProvider>
            {/* ⚡ Suspense for lazy routes (performance boost) */}
            <Suspense
              fallback={
                <CineLoader />
              }
            >
              <App />
            </Suspense>
          </ContentProvider>
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
