import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { AuthRoute } from "./Components/Auth/AuthRoute";
import { ProtectedRoute } from "./Components/Auth/ProtectedRoute";
import Signup from "./Pages/Auth/SignupPage";
import Login from "./Pages/Auth/LoginPage";
import { AuthProvider } from "./Common/AuthContext";
import Inbox from "./Pages/Mail/Inbox";

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      // <ProtectedRoute>
      <App />
      // </ProtectedRoute>
    ),
  },
  {
    path: "/mail/inbox",
    element: (
      <ProtectedRoute redirect={"/mail/inbox"}>
        <Inbox />
      </ProtectedRoute>
    ),
  },
  {
    path: "/auth",
    children: [
      {
        path: "/auth/signup",
        element: (
          <AuthRoute>
            <Signup />
          </AuthRoute>
        ),
      },
      {
        path: "/auth/login",
        element: (
          <AuthRoute>
            <Login />
          </AuthRoute>
        ),
      },
    ],
  },
]);

root.render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router}>
        <App />
      </RouterProvider>
    </AuthProvider>
  </React.StrictMode>
);
