import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { getUserRole } from "../libs/auth";
import api from "../libs/api";
import Swal from "sweetalert2";

const STATUS_OPTIONS = [
  { id: 1, label: "Received" },
  { id: 2, label: "In Progress" },
  { id: 3, label: "Awaiting Parts" },
  { id: 4, label: "Completed" },
  { id: 5, label: "Pending" },
];

const STATUS_COLORS = {
  Received: "bg-blue-100 text-blue-800 border-blue-200",
  "In Progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
  "Awaiting Parts": "bg-purple-100 text-purple-800 border-purple-200",
  Completed: "bg-green-100 text-green-800 border-green-200",
  Pending: "bg-gray-100 text-gray-800 border-gray-200",
  Overdue: "bg-red-100 text-red-800 border-red-200",
};

const getStatusLabelById = (id) => {
  const found = STATUS_OPTIONS.find((s) => s.id === Number(id));
  return found ? found.label : "Unknown";
};

const safeStatusId = (job) => {
  return job.status_id || 5; // default Pending
};

const DashboardMechanic = () => {
  if (getUserRole() !== "Mechanic") {
    return <Navigate to="/admin" replace />;
  }

  const [mechanic, setMechanic] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const storedUser = localStorage.getItem("user");
        if (!storedUser) throw new Error("User not logged in");
        setMechanic(JSON.parse(storedUser));

        const response = await api.get("/my-jobs");
        const jobsData = Array.isArray(response.data.data)
          ? response.data.data
          : Array.isArray(response.data)
          ? response.data
          : [];
        setJobs(jobsData);
      } catch (e) {
        setError(e.message || "Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  const handleUpdateJobStatus = async (jobId, newStatusId) => {
    const newStatusLabel = getStatusLabelById(newStatusId);

    const result = await Swal.fire({
      title: `Change job status?`,
      html: `Are you sure you want to change this job's status to <strong>${newStatusLabel}</strong>?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, update it",
      cancelButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        await api.patch(`/repair-jobs/${jobId}/status`, {
          status_id: newStatusId,
        });
        setJobs((prev) =>
          prev.map((job) =>
            job.id === jobId
              ? {
                  ...job,
                  status_id: newStatusId,
                  status: newStatusLabel,
                }
              : job
          )
        );
        Swal.fire("Updated!", "Job status has been updated.", "success");
      } catch {
        Swal.fire("Error", "Failed to update job status.", "error");
      }
    }
  };

  // Calculate analytics with numeric status_id
  const totalJobs = jobs.length;
  const completedJobs = jobs.filter((j) => j.status_id === 4).length;
  const inProgressJobs = jobs.filter((j) => j.status_id === 2).length;
  const pendingJobs = jobs.filter((j) => j.status_id === 5).length;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
        <span className="ml-3 text-lg font-medium text-gray-700">
          Loading Mechanic Dashboard...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded max-w-lg w-full"
          role="alert"
        >
          <strong className="font-bold">Error: </strong>
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Top Nav Bar */}
      <nav className="bg-white shadow flex items-center justify-between px-6 py-3 fixed w-full top-0 z-10">
        <div className="text-xl font-bold text-blue-700">
          Mechanic Dashboard
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold uppercase">
              {mechanic?.name?.charAt(0) || "M"}
            </div>
            <div className="hidden sm:block text-gray-700 font-medium">
              {mechanic?.name}
            </div>
          </div>
          <button
            onClick={logout}
            className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </nav>

      {/* Main content container with padding to prevent nav overlap */}
      <main className="pt-20 max-w-7xl mx-auto px-6 pb-12">
        {/* Analytics Section */}
        <section className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Your Job Analytics</h2>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            <AnalyticsCard
              label="Total Jobs"
              count={totalJobs}
              color="blue"
              icon="M3 7h18M3 12h18M9 17h6"
            />
            <AnalyticsCard
              label="In Progress"
              count={inProgressJobs}
              color="yellow"
              icon="M12 20h9"
            />
            <AnalyticsCard
              label="Completed"
              count={completedJobs}
              color="green"
              icon="M5 13l4 4L19 7"
            />
            <AnalyticsCard
              label="Pending"
              count={pendingJobs}
              color="gray"
              icon="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </div>
        </section>

        {/* Profile Section */}
        <section className="mb-8 bg-white rounded shadow p-6 max-w-md">
          <h2 className="text-lg font-semibold mb-4">Profile</h2>
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-3xl font-bold uppercase">
              {mechanic?.name?.charAt(0) || "M"}
            </div>
            <div>
              <p className="font-semibold">{mechanic?.name}</p>
              <p className="text-gray-600">@{mechanic?.username}</p>
              <p className="text-gray-600">{mechanic?.email}</p>
              <p className="mt-1 inline-block bg-blue-100 text-blue-800 font-semibold text-xs px-2 py-0.5 rounded">
                {safeString(mechanic?.role)}
              </p>
            </div>
          </div>
        </section>

        {/* Jobs Section */}
        <section className="bg-white rounded shadow p-6 overflow-x-auto">
          <h2 className="text-lg font-semibold mb-4">Assigned Jobs</h2>
          {jobs.length === 0 ? (
            <p className="text-gray-600">No assigned jobs at the moment.</p>
          ) : (
            <table className="min-w-full text-left text-gray-800">
              <thead>
                <tr className="bg-gray-100">
                  <th className="p-2">Job ID</th>
                  <th className="p-2">Customer</th>
                  <th className="p-2">Vehicle</th>
                  <th className="p-2">Description</th>
                  {/* <th className="p-2">Priority</th> */}
                  <th className="p-2">Status</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {jobs.map((job) => (
                  <tr key={job.id} className="border-b hover:bg-gray-50">
                    <td className="p-2">#{job.id}</td>
                    <td className="p-2">{job.customer?.name || "Unknown"}</td>
                    <td className="p-2">
                      {job.vehicle
                        ? `${job.vehicle.make} ${job.vehicle.model} (${job.vehicle.registration})`
                        : "No vehicle info"}
                    </td>
                    <td
                      className="p-2 truncate max-w-xs"
                      title={job.description}
                    >
                      {job.description || "N/A"}
                    </td>
                    {/* <td className="p-2">
                      <PriorityBadge priority={job.priority} />
                    </td> */}
                    <td className="p-2">
                      <StatusBadge
                        status={getStatusLabelById(safeStatusId(job))}
                      />
                    </td>
                    <td className="p-2 space-x-2 flex flex-wrap items-center">
                      <select
                        value={safeStatusId(job)}
                        onChange={(e) =>
                          handleUpdateJobStatus(job.id, Number(e.target.value))
                        }
                        className="border rounded px-2 py-1 text-xs"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status.id} value={status.id}>
                            {status.label}
                          </option>
                        ))}
                      </select>
                      <button
                        onClick={() =>
                          Swal.fire({
                            title: `Job #${job.id} Details`,
                            html: `
        <p><strong>Customer:</strong> ${job.customer?.name ?? "Unknown"}</p>
        <p><strong>Vehicle:</strong> ${
          job.vehicle ? `${job.vehicle.make} ${job.vehicle.model}` : "Unknown"
        }</p>
        <p><strong>Description:</strong> ${job.description ?? "N/A"}</p>
        <p><strong>Status:</strong> ${getStatusLabelById(safeStatusId(job))}</p>
      `,
                            confirmButtonText: "Close",
                          })
                        }
                        className="border border-gray-300 px-3 py-1 rounded text-xs hover:bg-gray-100"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </section>
      </main>
    </div>
  );
};

const AnalyticsCard = ({ label, count, color, icon }) => {
  const bgColor =
    {
      blue: "bg-blue-500",
      yellow: "bg-yellow-500",
      green: "bg-green-500",
      gray: "bg-gray-500",
    }[color] || "bg-gray-500";

  return (
    <div
      className={`bg-white p-5 shadow rounded-lg flex items-center space-x-4`}
    >
      <div
        className={`${bgColor} w-12 h-12 flex items-center justify-center rounded-md text-white`}
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
        <div className="text-sm text-gray-500">{label}</div>
        <div className="text-xl font-semibold text-gray-900">{count}</div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status }) => {
  const statusColors = {
    Received: "bg-blue-100 text-blue-800 border-blue-200",
    "In Progress": "bg-yellow-100 text-yellow-800 border-yellow-200",
    "Awaiting Parts": "bg-purple-100 text-purple-800 border-purple-200",
    Completed: "bg-green-100 text-green-800 border-green-200",
    Overdue: "bg-red-100 text-red-800 border-red-200",
    Pending: "bg-gray-100 text-gray-800 border-gray-200",
  };
  const color =
    statusColors[status] || "bg-gray-100 text-gray-800 border-gray-200";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}
    >
      {status || "Pending"}
    </span>
  );
};

// const PriorityBadge = ({ priority }) => {
//   const priorityColors = {
//     High: "bg-red-100 text-red-800 border-red-200",
//     Medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
//     Low: "bg-green-100 text-green-800 border-green-200",
//   };
//   const color =
//     priorityColors[priority] || "bg-gray-100 text-gray-800 border-gray-200";
//   return (
//     <span
//       className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}
//     >
//       {priority || "Medium"}
//     </span>
//   );
// };

const safeString = (value) => {
  if (typeof value === "string") return value;
  if (value && typeof value === "object" && "name" in value) return value.name;
  return "Unknown";
};

export default DashboardMechanic;
