import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../libs/api";

export default function AddVehicleSection({ customers = [], onVehicleAdded }) {
  const [customerId, setCustomerId] = useState("");
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [registration, setRegistration] = useState("");
  const [year, setYear] = useState("");

  const [allVehicles, setAllVehicles] = useState([]);
  const [recentVehicles, setRecentVehicles] = useState([]);
  const [allCustomers, setAllCustomers] = useState(customers);
  const [mechanics, setMechanics] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [vehiclesRes, customersRes, mechanicsRes, jobsRes] =
          await Promise.all([
            api.get("/vehicles"),
            api.get("/customers"),
            api.get("/users?role_id=2"),
            api.get("/repair-jobs"),
          ]);

        const vehiclesData = Array.isArray(vehiclesRes.data?.data)
          ? vehiclesRes.data.data
          : Array.isArray(vehiclesRes.data)
          ? vehiclesRes.data
          : [];
        const customersData = Array.isArray(customersRes.data?.data)
          ? customersRes.data.data
          : Array.isArray(customersRes.data)
          ? customersRes.data
          : [];
        const mechanicsData = Array.isArray(mechanicsRes.data?.data)
          ? mechanicsRes.data.data
          : Array.isArray(mechanicsRes.data)
          ? mechanicsRes.data
          : [];
        const jobsData = Array.isArray(jobsRes.data?.data)
          ? jobsRes.data.data
          : Array.isArray(jobsRes.data)
          ? jobsRes.data
          : [];

        setAllVehicles(vehiclesData);
        setRecentVehicles(vehiclesData.slice(0, 5));
        setAllCustomers(customersData);
        setMechanics(mechanicsData);
        setJobs(jobsData);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      }
    };
    fetchData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const vehicleData = {
        customer_id: customerId,
        make,
        model,
        registration,
        year,
      };
      const response = await api.post("/vehicles", vehicleData);
      const newVehicle = response.data;

      setCustomerId("");
      setMake("");
      setModel("");
      setRegistration("");
      setYear("");

      setAllVehicles((prev) => [newVehicle, ...prev]);
      setRecentVehicles((prev) => [newVehicle, ...prev].slice(0, 5));

      if (onVehicleAdded) onVehicleAdded(newVehicle);

      await Swal.fire({
        title: "Success!",
        text: "Vehicle added successfully!",
        icon: "success",
        confirmButtonText: "Ok",
      });
    } catch (err) {
      const message = err.response?.data?.message || "Failed to add vehicle";
      setError(message);
      Swal.fire({
        title: "Error",
        text: message,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {loading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-blue-600" />
            <span className="text-lg text-green-700 font-semibold">
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
                <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
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
                      d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Vehicle Management
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Add and manage vehicle records
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
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
                Customers
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
            label="Total Customers"
            value={allCustomers.length}
            icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            color="from-purple-500 to-purple-600"
          />
          <StatCard
            label="Total Vehicles"
            value={allVehicles.length}
            icon="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
            color="from-green-500 to-green-600"
          />
          <StatCard
            label="Active Mechanics"
            value={mechanics.length}
            icon="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            label="Total Jobs"
            value={jobs.length}
            icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            color="from-indigo-500 to-indigo-600"
          />
        </section>

        {/* Add Vehicle Form */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Add New Vehicle
          </h3>
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Customer
              </label>
              <select
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                value={customerId}
                onChange={(e) => setCustomerId(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Select Customer</option>
                {allCustomers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Make
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="e.g., Toyota"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Model
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="e.g., Camry"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Registration Number
                </label>
                <input
                  type="text"
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder="e.g., ABC-1234"
                  value={registration}
                  onChange={(e) => setRegistration(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Year
                </label>
                <input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition"
                  placeholder={new Date().getFullYear()}
                  value={year}
                  onChange={(e) => setYear(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 rounded-lg hover:from-green-600 hover:to-green-700 font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Adding Vehicle..." : "Add Vehicle"}
            </button>
          </form>
        </section>

        {/* Recent Vehicles Table */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Recent Vehicles
          </h2>
          {recentVehicles.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No vehicles found. Add your first vehicle above!
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="p-3 font-semibold text-gray-900">ID</th>
                    <th className="p-3 font-semibold text-gray-900">
                      Customer
                    </th>
                    <th className="p-3 font-semibold text-gray-900">Make</th>
                    <th className="p-3 font-semibold text-gray-900">Model</th>
                    <th className="p-3 font-semibold text-gray-900">
                      Registration
                    </th>
                    <th className="p-3 font-semibold text-gray-900">Year</th>
                  </tr>
                </thead>
                <tbody>
                  {recentVehicles.map((v) => (
                    <tr
                      key={v.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 text-gray-700">#{v.id}</td>
                      <td className="p-3 text-gray-900 font-medium">
                        {v.customer?.name || "N/A"}
                      </td>
                      <td className="p-3 text-gray-700">{v.make}</td>
                      <td className="p-3 text-gray-700">{v.model}</td>
                      <td className="p-3 text-gray-700 font-mono">
                        {v.registration}
                      </td>
                      <td className="p-3 text-gray-700">{v.year}</td>
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
