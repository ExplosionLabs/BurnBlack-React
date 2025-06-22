import React from "react";
import ScrollToTop from "@/components/Base/ScrollToTop";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./stores/store";
import Router from "./router";
import "./assets/css/app.css";
import { GoogleOAuthProvider } from "@react-oauth/google";

const googleClientId=import.meta.env.VITE_GOOGLE_CLIENT_ID;
ReactDOM.render(
  <BrowserRouter>
   <GoogleOAuthProvider clientId={googleClientId}>
    <Provider store={store}>
      <Router />
    </Provider>
    <ScrollToTop />
    </GoogleOAuthProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
