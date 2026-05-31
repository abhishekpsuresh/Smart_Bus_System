import React from "react";

import ReactDOM from "react-dom/client";

import App from "./App";

import "./index.css";

import {
  Toaster
} from "react-hot-toast";

ReactDOM.createRoot(
  document.getElementById("root")
).render(

  <React.StrictMode>

    <App />

    <Toaster

      position="top-center"

      toastOptions={{

        duration: 3000,

        style: {

          background: "#18181b",

          color: "#fff",

          border:
          "1px solid #27272a",

          borderRadius: "14px",

          padding: "14px 18px"

        },

        success: {

          iconTheme: {

            primary: "#ef4444",

            secondary: "#fff"

          }

        },

        error: {

          iconTheme: {

            primary: "#dc2626",

            secondary: "#fff"

          }

        }

      }}

    />

  </React.StrictMode>

);