import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import LoginForm from "./components/LoginForm";
import AdminDashboard from "./components/AdminDashboard";
import MechanicDashboard from "./components/MechanicDashboard";

import CustomersPage from "./components/QuickActions/AddCustomerSection";
import VehiclesPage from "./components/QuickActions/AddVehicleSection";
import JobsPage from "./components/QuickActions/CreateJobSection";

import { getUserRole, isAuthenticated, clearAuthSession } from "./libs/api";

import AddCustomerSection from "./components/QuickActions/AddCustomerSection";
import AddVehicleSection from "./components/QuickActions/AddVehicleSection";
import CreateJobSection from "./components/QuickActions/CreateJobSection";
import EmployeeRegistrationSection from "./components/QuickActions/EmployeeRegistrationSection";

import api from "./libs/api";

/** Container to fetch customers for AddVehicleSection */
function AddVehicleContainer() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/customers")
      .then((res) => {
        const data = res.data.data || res.data;
        setCustomers(data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-blue-600" />
          <span className="text-lg text-indigo-700 font-semibold">
            Loading...
          </span>
        </div>
      </div>
    );

  return <AddVehicleSection customers={customers} />;
}

/** Container to fetch customers, vehicles, mechanics, statuses for CreateJobSection */
function CreateJobContainer() {
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);

  const statuses = ["Received", "In Progress", "Awaiting Parts", "Completed"];

  useEffect(() => {
    Promise.all([
      api.get("/customers"),
      api.get("/vehicles"),
      api.get("/users?role=Mechanic"),
    ])
      .then(([customersRes, vehiclesRes, mechanicsRes]) => {
        setCustomers(customersRes.data.data || customersRes.data);
        setVehicles(vehiclesRes.data.data || vehiclesRes.data);
        setMechanics(mechanicsRes.data.data || mechanicsRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-blue-600" />
          <span className="text-lg text-indigo-700 font-semibold">
            Loading...
          </span>
        </div>
      </div>
    );

  return (
    <CreateJobSection
      customers={customers}
      vehicles={vehicles}
      mechanics={mechanics}
      statuses={statuses}
    />
  );
}

/** Higher order component for role-protected routes */
function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const role = getUserRole();

  if (!token) return <Navigate to="/login" />;

  if (allowedRoles && !allowedRoles.includes(role)) {
    clearAuthSession();
    return <Navigate to="/login" />;
  }

  return children;
}

export default function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    if (isAuthenticated()) {
      setUserRole(getUserRole());
    } else {
      setUserRole(null);
    }
  }, []);

  const handleLogin = (user) => {
    setUserRole(user.role?.name || user.role);
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated() ? (
              <Navigate to="/" />
            ) : (
              <LoginForm onLogin={handleLogin} />
            )
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Quick Action Routes under Admin */}

        <Route
          path="/admin/add-employee"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <EmployeeRegistrationSection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-customer"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AddCustomerSection />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/add-vehicle"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <AddVehicleContainer />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/create-job"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <CreateJobContainer />
            </ProtectedRoute>
          }
        />

        {/* Additional admin routes */}
        {/* <Route
          path="/customers"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <CustomersPage />
            </ProtectedRoute>
          }
        /> */}

        {/* <Route
          path="/vehicles"
          element={
            <ProtectedRoute allowedRoles={["Admin"]}>
              <VehiclesPage />
            </ProtectedRoute>
          }
        />

     
        <Route
          path="/jobs"
          element={
            <ProtectedRoute allowedRoles={["Admin", "Mechanic"]}>
              <JobsPage />
            </ProtectedRoute>
          }
        /> */}

        <Route
          path="/mechanic"
          element={
            <ProtectedRoute allowedRoles={["Mechanic"]}>
              <MechanicDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/"
          element={
            userRole === "Admin" ? (
              <Navigate to="/admin" />
            ) : userRole === "Mechanic" ? (
              <Navigate to="/mechanic" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}
