import "./App.css";
import Layout from "./Layout/Layout.jsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import React from "react";

import AuthProvider from "./Auth/AuthProvider.jsx";
import ProtectedRoute from "./Auth/ProtectedRoute.jsx";

import ProductPage from "./Pages/Product/ProductPage";
import LoginPage from "./Pages/Login/Login.jsx";
import Dashboard from "./Pages/Dashboard/Dashboard.jsx";
import Inventory from "./Pages/Inventory/Inventory.jsx";
import MemberManagement from "./Pages/Member-Management/Member-Management.jsx";
import ReportBox from "./Pages/Report-Box/ReportBox.jsx";
import UnassignedWork from "./Pages/Unassigned-Work/UnassignedWork.jsx";
import SubmittedWork from "./Pages/Submitted-Work/Submitted-Work.jsx";
import Setting from "./Pages/Setting/Setting.jsx";
import ActivityLog from "./Pages/Activity-Log/ActivityLog";
import NotFound from './Pages/Not-Found/Not-Found';

const router = createBrowserRouter(
  [
    {
      path: "*",
      element: <NotFound />,
    },
    {
      path: "/product",
      element: <ProductPage />,
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/",
      element: (
        <ProtectedRoute
          allowedRoles={[
            "super_admin",
            "admin",
            "worker",
            "super_member",
            "member",
          ]}
        >
          <Layout />
        </ProtectedRoute>
      ),
      children: [
        {
          path: "/dashboard",
          element: (
            <ProtectedRoute
              allowedRoles={[
                "super_admin",
                "admin",
                "worker",
                "super_member",
                "member",
              ]}
            >
              <Dashboard />
            </ProtectedRoute>
          ),
        },
        {
          path: "/inventory",
          element: (
            <ProtectedRoute
              allowedRoles={[
                "super_admin",
                "admin",
                "worker",
                "super_member",
                "member",
              ]}
            >
              <Inventory />
            </ProtectedRoute>
          ),
        },
        {
          path: "/member-management",
          element: (
            <ProtectedRoute
              allowedRoles={["super_admin", "admin", "super_member"]}
            >
              <MemberManagement />
            </ProtectedRoute>
          ),
        },
        {
          path: "/unassigned-work",
          element: (
            <ProtectedRoute allowedRoles={["super_admin", "admin", "worker"]}>
              <UnassignedWork />
            </ProtectedRoute>
          ),
        },
        {
          path: "/report-box",
          element: (
            <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
              <ReportBox />
            </ProtectedRoute>
          ),
        },
        {
          path: "/submitted-work",
          element: (
            <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
              <SubmittedWork />
            </ProtectedRoute>
          )
        },
        {
          path: "/activity-log",
          element: (
            <ProtectedRoute allowedRoles={["super_admin", "admin"]}>
              <ActivityLog />
            </ProtectedRoute>
          ),
        },
        {
          path: "/setting",
          element: (
            <ProtectedRoute
              allowedRoles={[
                "super_admin",
                "admin",
                "worker",
                "super_member",
                "member",
              ]}
            >
              <Setting />
            </ProtectedRoute>
          ),
        },
      ],
    },
  ],
  { basename: "/Metthier/" }
);

const queryParameters = new URLSearchParams(window.location.search);
const company = queryParameters.get("company");
const branch = queryParameters.get("branch");
const id = queryParameters.get("id");

function App() {
  if (company && branch && id) {
    return (
      <div>
        <ProductPage company={company} branch={branch} id={id}/>
      </div>
    )
  } else {
    return (
      <AuthProvider>
        <div className="app bg-light">
          <RouterProvider router={router} />
        </div>
      </AuthProvider>
    )
  }
}

export default App;
