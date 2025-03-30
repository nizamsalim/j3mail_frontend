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
import MailItem from "./Pages/Mail/MailItem";
import ComposeMail from "./Pages/Mail/ComposeMail";
import { MailListProvider } from "./Common/MailListContext";

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
    path: "/mail",
    element: (
      <ProtectedRoute>
        <MailListProvider>
          <Inbox />
        </MailListProvider>
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/mail/read/:mailId",
        element: (
          <ProtectedRoute>
            <MailItem />
          </ProtectedRoute>
        ),
      },
      {
        path: "/mail/compose",
        element: (
          <ProtectedRoute>
            <ComposeMail />
          </ProtectedRoute>
        ),
      },
    ],
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
