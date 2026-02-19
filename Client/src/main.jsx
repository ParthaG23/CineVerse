import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { UIProvider } from "./context/UIContext";
import { ContentProvider } from "./context/ContentContext";

import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
     <BrowserRouter>
      <AuthProvider>
       <UIProvider>
         <ContentProvider>
            <App />
          </ContentProvider>
        </UIProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
