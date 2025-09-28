import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import api from "../../libs/api";

export default function CreateJobSection({
  customers,
  vehicles,
  mechanics,
  // statuses,
  onJobCreated,
}) {
  const [customerId, setCustomerId] = useState("");
  const [recentJobs, setRecentJobs] = useState([]);
  const [vehicleId, setVehicleId] = useState("");
  const [mechanicId, setMechanicId] = useState("");
  // const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [allCustomers, setAllCustomers] = useState(customers || []);
  const [allVehicles, setAllVehicles] = useState(vehicles || []);
  const [allMechanics, setAllMechanics] = useState(mechanics || []);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    window.location.href = "/login";
  };

  // Filter vehicles for selected customer
  const filteredVehicles = allVehicles.filter(
    (v) => v.customer_id === Number(customerId)
  );

  // Fetch all data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [jobsRes, customersRes, vehiclesRes, mechanicsRes] =
          await Promise.all([
            api.get("/repair-jobs"),
            api.get("/customers"),
            api.get("/vehicles"),
            api.get("/users?role_id=2"),
          ]);

        const jobs = jobsRes.data.data || jobsRes.data;
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
        const mechanicsData = Array.isArray(mechanicsRes.data?.data)
          ? mechanicsRes.data.data
          : Array.isArray(mechanicsRes.data)
          ? mechanicsRes.data
          : [];

        setRecentJobs(jobs.slice(0, 5));
        setAllCustomers(customersData);
        setAllVehicles(vehiclesData);
        setAllMechanics(mechanicsData);
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
    if (!customerId || !vehicleId || !mechanicId || !description) {
      setError("All fields are required");
      setLoading(false);
      return;
    }
    try {
      const jobData = {
        customer_id: Number(customerId),
        vehicle_id: Number(vehicleId),
        assigned_mechanic_id: Number(mechanicId),
        status_id: 5, // Pending status id
        description,
      };
      const response = await api.post("/repair-jobs", jobData);
      const newJob = response.data;
      // Reset form
      setCustomerId("");
      setVehicleId("");
      setMechanicId("");
      setDescription("");
      if (onJobCreated) onJobCreated(newJob);
      setRecentJobs((prev) => [newJob, ...prev].slice(0, 5));
      Swal.fire({
        title: "Success!",
        text: "Job created successfully!",
        icon: "success",
        confirmButtonText: "Ok",
      });
    } catch (err) {
      const message = err.response?.data?.message || "Failed to create job";
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
            <span className="text-lg text-indigo-700 font-semibold">
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
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-lg flex items-center justify-center">
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
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                    />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">
                    Job Management
                  </h1>
                  <p className="text-gray-600 text-sm mt-1">
                    Create and manage repair jobs
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
            value={allMechanics.length}
            icon="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            color="from-blue-500 to-blue-600"
          />
          <StatCard
            label="Total Jobs"
            value={recentJobs.length}
            icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            color="from-indigo-500 to-indigo-600"
          />
        </section>

        {/* Create Job Form */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-6">
            Create New Job
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
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
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
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Vehicle
              </label>
              <select
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                value={vehicleId}
                onChange={(e) => setVehicleId(e.target.value)}
                required
                disabled={loading || !customerId}
              >
                <option value="">Select Vehicle</option>
                {filteredVehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.make} {v.model} ({v.registration})
                  </option>
                ))}
              </select>
              {customerId && filteredVehicles.length === 0 && (
                <p className="mt-1 text-sm text-amber-600">
                  No vehicles found for this customer
                </p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mechanic
              </label>
              <select
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                value={mechanicId}
                onChange={(e) => setMechanicId(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Select Mechanic</option>
                {allMechanics
                  .filter((m) => m.role_id === 2)
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
              </select>
            </div>

            {/* <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Select Status</option>
                {statuses &&
                  statuses.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
              </select>
            </div> */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Job Description
              </label>
              <textarea
                className="w-full border border-gray-300 px-4 py-2.5 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                placeholder="Describe the repair work needed..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-500 to-indigo-600 text-white py-3 rounded-lg hover:from-indigo-600 hover:to-indigo-700 font-medium transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={loading}
            >
              {loading ? "Creating Job..." : "Create Job"}
            </button>
          </form>
        </section>

        {/* Recent Jobs Table */}
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Recent Jobs
          </h2>
          {recentJobs.length === 0 ? (
            <p className="text-gray-600 text-center py-8">
              No jobs found. Create your first job above!
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
                    <th className="p-3 font-semibold text-gray-900">Vehicle</th>
                    <th className="p-3 font-semibold text-gray-900">
                      Mechanic
                    </th>
                    <th className="p-3 font-semibold text-gray-900">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentJobs.map((job) => (
                    <tr
                      key={job.id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="p-3 text-gray-700">#{job.id}</td>
                      <td className="p-3 text-gray-900 font-medium">
                        {job.customer?.name || "N/A"}
                      </td>
                      <td className="p-3 text-gray-700">
                        {job.vehicle
                          ? `${job.vehicle.make} ${job.vehicle.model} (${job.vehicle.registration})`
                          : "N/A"}
                      </td>
                      <td className="p-3 text-gray-700">
                        {job.mechanic?.name || "Unassigned"}
                      </td>
                      <td className="p-3">
                        <StatusBadge
                          status={job.status?.name || job.status || "Unknown"}
                        />
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

const StatusBadge = ({ status }) => {
  const colors = {
    received: "bg-blue-100 text-blue-700 border-blue-200",
    "in progress": "bg-yellow-100 text-yellow-700 border-yellow-200",
    "awaiting parts": "bg-purple-100 text-purple-700 border-purple-200",
    completed: "bg-green-100 text-green-700 border-green-200",
  };
  const color =
    colors[status?.toLowerCase()] ||
    "bg-gray-100 text-gray-700 border-gray-200";

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${color}`}
    >
      {status || "Unknown"}
    </span>
  );
};
