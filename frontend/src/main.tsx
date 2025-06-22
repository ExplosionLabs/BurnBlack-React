import React from "react";
import ScrollToTop from "@/components/Base/ScrollToTop";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./stores/store";
import Router from "./router";
import "./assets/css/app.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { useSyncExternalStore } from "use-sync-external-store/shim";

// Ensure React has useSyncExternalStore
if (!React.useSyncExternalStore) {
  (React as any).useSyncExternalStore = useSyncExternalStore;
}

// Debug function to check if app is loading
function debugApp() {
  console.log("🚀 BurnBlack App is loading...");
  console.log("React version:", React.version);
  console.log("Redux store:", store.getState());
}

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || "fallback-client-id";
const container = document.getElementById("root")!;
const root = createRoot(container);

debugApp();

try {
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
  console.log("✅ App rendered successfully!");
} catch (error) {
  console.error("❌ Error rendering app:", error);
  // Fallback simple render
  root.render(
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>🔥 BurnBlack Loading Error</h1>
      <p>There was an error loading the application. Please check the console for details.</p>
      <pre style={{ background: '#f5f5f5', padding: '10px', borderRadius: '4px' }}>
        {error?.toString()}
      </pre>
    </div>
  );
}
