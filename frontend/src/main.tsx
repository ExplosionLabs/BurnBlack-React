import React from "react";
import ScrollToTop from "@/components/Base/ScrollToTop";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./stores/store";
import Router from "./router";
import "./assets/css/app.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

// Ensure React is globally available for hooks
if (typeof window !== 'undefined') {
  (window as any).React = React;
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "fallback-client-id";
const container = document.getElementById("root")!;
const root = createRoot(container);

root.render(
  <React.StrictMode>
    <BrowserRouter>
     <GoogleOAuthProvider clientId={googleClientId}>
      <Provider store={store}>
        <Router />
      </Provider>
      <ScrollToTop />
      </GoogleOAuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
