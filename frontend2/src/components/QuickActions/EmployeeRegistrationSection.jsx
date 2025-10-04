import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../libs/api";

export default function EmployeeRegistrationSection({ onEmployeeAdded }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("1"); // Default to admin

  const [allEmployees, setAllEmployees] = useState([]);
  const [recentEmployees, setRecentEmployees] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [updateModal, setUpdateModal] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  // Fetch analytics
  useEffect(() => {
    async function fetchAnalytics() {
      try {
        const [employeesRes, customersRes, vehiclesRes, jobsRes] =
          await Promise.all([
            api.get("/users"),
            api.get("/customers"),
            api.get("/vehicles"),
            api.get("/repair-jobs"),
          ]);

        const employeesData = Array.isArray(employeesRes.data?.data)
          ? employeesRes.data.data
          : Array.isArray(employeesRes.data)
          ? employeesRes.data
          : [];
        const customersData = Array.isArray(customersRes.data?.data)
          ? customersRes.data.data
          : Array.isArray(customersRes.data)
          ? customersRes.data
          : [];
        const vehiclesData = Array.isArray(vehiclesRes.data?.data)
          ? vehiclesRes.data.data
          : Array.isArray(vehiclesRes.data)
          ? vehiclesRes.data
          : [];
        const jobsData = Array.isArray(jobsRes.data?.data)
          ? jobsRes.data.data
          : Array.isArray(jobsRes.data)
          ? jobsRes.data
          : [];

        setAllEmployees(employeesData);
        setRecentEmployees(
          employeesData
            .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
            .slice(0, 5)
        );
        setCustomers(customersData);
        setVehicles(vehiclesData);
        setJobs(jobsData);
      } catch (err) {
        console.error("Failed to fetch analytics data", err);
      }
    }
    fetchAnalytics();
  }, []);

  // Handle submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const userData = {
        name,
        email,
        username,
        password,
        role_id: Number(roleId),
      };

      const response = await api.post("/users", userData);
      const newEmployee = response.data;

      // Reset form
      setName("");
      setEmail("");
      setUsername("");
      setPassword("");
      setRoleId("1");

      // Update employee lists
      setAllEmployees((prev) => [newEmployee, ...prev]);
      setRecentEmployees((prev) => [newEmployee, ...prev].slice(0, 5));
      if (onEmployeeAdded) onEmployeeAdded(newEmployee);

      await Swal.fire({
        title: "Success!",
        text: "Employee registered successfully!",
        icon: "success",
        confirmButtonText: "Ok",
      });
    } catch (err) {
      const message =
        err.response?.data?.message || "Failed to register employee";
      setError(message);
      Swal.fire({ title: "Error", text: message, icon: "error" });
    } finally {
      setLoading(false);
    }
  };

  // Delete employee
  const handleDelete = async (employeeId) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This will delete the employee and all related records!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      confirmButtonColor: "#dc2626",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/users/${employeeId}`);

        setAllEmployees((prev) => prev.filter((e) => e.id !== employeeId));
        setRecentEmployees((prev) => prev.filter((e) => e.id !== employeeId));

        Swal.fire("Deleted!", "Employee deleted successfully.", "success");
      } catch (err) {
        Swal.fire("Error!", "Failed to delete employee.", "error");
      }
    }
  };

  // Open update modal
  const openUpdateModal = (employee) => {
    setCurrentEmployee(employee);
    setUpdateModal(true);
    setName(employee.name);
    setEmail(employee.email);
    setUsername(employee.username);
    setRoleId(employee.role_id?.toString() || "1");
    setPassword("");
  };

  // Update employee
  const handleUpdate = async () => {
    if (!currentEmployee) return;
    setLoading(true);
    try {
      const updateData = {
        name,
        email,
        username,
        role_id: Number(roleId),
      };

      if (password.trim()) updateData.password = password;

      const response = await api.put(
        `/users/${currentEmployee.id}`,
        updateData
      );
      const updatedEmployee = response.data;

      setAllEmployees((prev) =>
        prev.map((e) => (e.id === updatedEmployee.id ? updatedEmployee : e))
      );
      setRecentEmployees((prev) =>
        prev.map((e) => (e.id === updatedEmployee.id ? updatedEmployee : e))
      );

      Swal.fire("Updated!", "Employee data updated successfully.", "success");
      setUpdateModal(false);
      setName("");
      setEmail("");
      setUsername("");
      setPassword("");
      setRoleId("1");
      setCurrentEmployee(null);
    } catch (err) {
      Swal.fire("Error!", "Failed to update employee.", "error");
    } finally {
      setLoading(false);
    }
  };

  const getRoleText = (roleId) => {
    return roleId === 1 ? "Admin" : roleId === 2 ? "Mechanic" : "Unknown";
  };

  const getRoleBadgeClass = (roleId) => {
    return roleId === 1
      ? "bg-blue-100 text-blue-800"
      : roleId === 2
      ? "bg-green-100 text-green-800"
      : "bg-gray-100 text-gray-800";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-blue-600" />
            <span className="text-lg text-blue-700 font-semibold">
              Loading...
            </span>
          </div>
        </div>
      )}
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        {/* Enhanced Header */}
        <header className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Employee Management
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Register and manage admin and mechanic users
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                to="/"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Home
              </Link>
              <Link
                to="/admin/add-customer"
                className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                Customers
              </Link>
              <Link
                to="/admin/add-vehicle"
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                  />
                </svg>
                Vehicles
              </Link>
              <Link
                to="/admin/create-job"
                className="bg-indigo-500 hover:bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Jobs
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Analytics Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Employees"
            value={allEmployees.length}
            icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            label="Total Customers"
            value={customers.length}
            icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            label="Total Vehicles"
            value={vehicles.length}
            icon="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
            color="from-green-500 to-green-600"
          />
          <StatCard
            label="Total Jobs"
            value={jobs.length}
            icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            color="from-indigo-500 to-indigo-600"
          />
        </section>

        {/* Registration Form */}
        {!updateModal && (
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Register New Employee
            </h3>
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter employee name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="employee@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                  value={roleId}
                  onChange={(e) => setRoleId(e.target.value)}
                  required
                  disabled={loading}
                >
                  <option value="1">Admin</option>
                  <option value="2">Mechanic</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg hover:from-blue-600 hover:to-blue-700 font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register Employee"}
              </button>
            </form>
          </section>
        )}

        {/* Update Modal */}
        {updateModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-semibold text-gray-900">
                  Update Employee
                </h3>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Password (leave blank to keep current)
                  </label>
                  <input
                    type="password"
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password or leave blank"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Role
                  </label>
                  <select
                    className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={roleId}
                    onChange={(e) => setRoleId(e.target.value)}
                  >
                    <option value="1">Admin</option>
                    <option value="2">Mechanic</option>
                  </select>
                </div>
              </div>
              <div className="p-6 border-t border-gray-200 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setUpdateModal(false);
                    setName("");
                    setEmail("");
                    setUsername("");
                    setPassword("");
                    setRoleId("1");
                  }}
                  className="px-5 py-2.5 rounded-lg border border-gray-300 hover:bg-gray-50 font-medium transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdate}
                  className="px-5 py-2.5 rounded-lg bg-blue-500 text-white hover:bg-blue-600 font-medium transition"
                  disabled={loading}
                >
                  {loading ? "Updating..." : "Update Employee"}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Recent Employees Table */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Recent Employees
          </h2>
          {recentEmployees.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No employees found. Register your first employee above!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-3 font-semibold text-gray-900">ID</th>
                    <th className="p-3 font-semibold text-gray-900">Name</th>
                    <th className="p-3 font-semibold text-gray-900">Email</th>
                    <th className="p-3 font-semibold text-gray-900">
                      Username
                    </th>
                    <th className="p-3 font-semibold text-gray-900">Role</th>
                    <th className="p-3 font-semibold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEmployees.map((e) => (
                    <tr
                      key={e.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 text-gray-700">#{e.id}</td>
                      <td className="p-3 text-gray-900 font-medium">
                        {e.name}
                      </td>
                      <td className="p-3 text-gray-700">{e.email}</td>
                      <td className="p-3 text-gray-700">
                        {e.username || "N/A"}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(
                            e.role_id
                          )}`}
                        >
                          {getRoleText(e.role_id)}
                        </span>
                      </td>
                      <td className="p-3 flex gap-2">
                        <button
                          className="px-3 py-1.5 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 text-xs font-medium transition"
                          onClick={() => openUpdateModal(e)}
                        >
                          Edit
                        </button>
                        <button
                          className="px-3 py-1.5 bg-red-500 text-white rounded-lg hover:bg-red-600 text-xs font-medium transition"
                          onClick={() => handleDelete(e.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

const StatCard = ({ label, value, icon, color }) => (
  <div className="bg-white shadow-sm rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
    <div className="flex items-center gap-4">
      <div
        className={`bg-gradient-to-br ${color} w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md flex-shrink-0`}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
        >
          <path d={icon} />
        </svg>
      </div>
      <div>
        <div className="text-sm text-gray-600 mb-1">{label}</div>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
      </div>
    </div>
  </div>
);
