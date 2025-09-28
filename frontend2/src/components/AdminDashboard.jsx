import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { getUserRole } from "../libs/auth";
import api from "../libs/api";
import { Link, Navigate } from "react-router-dom";

export default function DashboardAdmin() {
  if (getUserRole() !== "Admin") {
    return <Navigate to="/mechanic" replace />;
  }

  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    completedJobs: 0,
    totalCustomers: 0,
    totalVehicles: 0,
    mechanics: [],
  });
  const [recentJobs, setRecentJobs] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [mechanics, setMechanics] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [jobsRes, customersRes, vehiclesRes, mechanicsRes] =
        await Promise.all([
          api.get("/repair-jobs"),
          api.get("/customers"),
          api.get("/vehicles"),
          api.get("/users?role=Mechanic"),
        ]);
      const jobs = jobsRes.data.data || jobsRes.data;
      const customersData = customersRes.data.data || customersRes.data;
      const vehiclesData = vehiclesRes.data.data || vehiclesRes.data;
      const mechanicsData = mechanicsRes.data.data || mechanicsRes.data;

      setStats({
        totalJobs: jobs.length,
        activeJobs: jobs.filter((job) => job.status?.name === "In Progress")
          .length,
        completedJobs: jobs.filter((job) => job.status?.name === "Completed")
          .length,
        totalCustomers: customersData.length,
        totalVehicles: vehiclesData.length,
        mechanics: mechanicsData,
      });
      setRecentJobs(jobs.slice(0, 5));
      setCustomers(customersData);
      setVehicles(vehiclesData);
      setMechanics(mechanicsData);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const getCompletionRate = () => {
    if (stats.totalJobs === 0) return 0;
    return Math.round((stats.completedJobs / stats.totalJobs) * 100);
  };

  const getActiveRate = () => {
    if (stats.totalJobs === 0) return 0;
    return Math.round((stats.activeJobs / stats.totalJobs) * 100);
  };

  const handleLogout = () => {
    // Clear auth token from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("username");
    // Redirect to login page
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <Layout
        links={[
          { to: "/admin/add-customer", label: "Customers" },
          { to: "/admin/add-vehicle", label: "Vehicles" },
          { to: "/admin/create-job", label: "Jobs" },
        ]}
      >
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12">
          <div className="animate-spin rounded-full h-14 w-14 border-b-4 border-blue-600" />
          <p className="mt-4 text-gray-700 text-lg font-medium">
            Loading dashboard...
          </p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout
      links={[
        { to: "/admin/add-customer", label: "Customers" },
        { to: "/admin/add-vehicle", label: "Vehicles" },
        { to: "/admin/create-job", label: "Jobs" },
      ]}
    >
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          {/* Enhanced Header Section */}
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
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      Admin Dashboard
                    </h1>
                    <p className="text-gray-600 text-sm mt-1">
                      Workshop Management System Overview
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link to="/admin/add-employee">
                  <QuickActionButton
                    label="Add Employee"
                    icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    color="purple" // or "orange" for orange-500
                  />
                </Link>

                <Link to="/admin/add-customer">
                  <QuickActionButton
                    label="Add Customer"
                    icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    color="blue"
                  />
                </Link>

                <Link to="/admin/add-vehicle">
                  <QuickActionButton
                    label="Add Vehicle"
                    icon="M8 17a5 5 0 01-.916-9.916 5.002 5.002 0 019.832 0A5.002 5.002 0 0116 17m-7-5v4m7-4v4"
                    color="green"
                  />
                </Link>
                <Link to="/admin/create-job">
                  <QuickActionButton
                    label="Create Job"
                    icon="M12 4v16m8-8H4"
                    color="purple"
                  />
                </Link>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm hover:shadow"
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

          {/* Performance Overview */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <PerformanceCard
              title="Completion Rate"
              value={`${getCompletionRate()}%`}
              change="+12%"
              trend="up"
              subtitle={`${stats.completedJobs} of ${stats.totalJobs} jobs completed`}
            />
            <PerformanceCard
              title="Active Workload"
              value={`${getActiveRate()}%`}
              change="+5%"
              trend="up"
              subtitle={`${stats.activeJobs} jobs in progress`}
            />
            <PerformanceCard
              title="Team Utilization"
              value={`${stats.mechanics.length}`}
              change="Active"
              trend="neutral"
              subtitle="Mechanics on duty"
            />
          </section>

          {/* KPI Cards */}
          <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            <AnalyticsCard
              label="Total Jobs"
              count={stats.totalJobs}
              icon="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              color="blue"
              trend="+8%"
            />
            <AnalyticsCard
              label="Active Jobs"
              count={stats.activeJobs}
              icon="M13 10V3L4 14h7v7l9-11h-7z"
              color="yellow"
              subtitle="In progress"
            />
            <AnalyticsCard
              label="Completed"
              count={stats.completedJobs}
              icon="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              color="green"
              trend="+15%"
            />
            <AnalyticsCard
              label="Customers"
              count={stats.totalCustomers}
              icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              color="purple"
              subtitle="Registered"
            />
            <AnalyticsCard
              label="Vehicles"
              count={stats.totalVehicles}
              icon="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
              color="teal"
              subtitle="In system"
            />
            <AnalyticsCard
              label="Mechanics"
              count={stats.mechanics.length}
              icon="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              color="indigo"
              subtitle="Active"
            />
          </section>

          {/* Charts Section */}
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Job Status Distribution
              </h3>
              <div className="space-y-4">
                <StatusBar
                  label="Completed"
                  value={stats.completedJobs}
                  total={stats.totalJobs}
                  color="green"
                />
                <StatusBar
                  label="In Progress"
                  value={stats.activeJobs}
                  total={stats.totalJobs}
                  color="yellow"
                />
                <StatusBar
                  label="Pending"
                  value={
                    stats.totalJobs - stats.activeJobs - stats.completedJobs
                  }
                  total={stats.totalJobs}
                  color="blue"
                />
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Workshop Overview
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <MetricBox
                  label="Avg. Jobs/Mechanic"
                  value={(
                    stats.totalJobs / (stats.mechanics.length || 1)
                  ).toFixed(1)}
                />
                <MetricBox
                  label="Vehicles/Customer"
                  value={(
                    stats.totalVehicles / (stats.totalCustomers || 1)
                  ).toFixed(1)}
                />
                <MetricBox
                  label="Success Rate"
                  value={`${getCompletionRate()}%`}
                />
                <MetricBox label="Active Rate" value={`${getActiveRate()}%`} />
              </div>
            </div>
          </section>

          {/* Recent Jobs Table */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">
                Recent Jobs
              </h2>
              <span className="text-sm text-gray-500">
                {recentJobs.length} jobs
              </span>
            </div>
            {recentJobs.length === 0 ? (
              <p className="text-gray-600 text-center py-8">
                No recent jobs at the moment.
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-gray-700 text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="p-3 font-semibold">Job ID</th>
                      <th className="p-3 font-semibold">Customer</th>
                      <th className="p-3 font-semibold">Vehicle</th>
                      <th className="p-3 font-semibold">Mechanic</th>
                      <th className="p-3 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentJobs.map((job) => (
                      <tr
                        key={job.id}
                        className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                      >
                        <td className="p-3 font-medium text-blue-600">
                          #{job.id}
                        </td>
                        <td className="p-3">{job.customer?.name || "N/A"}</td>
                        <td className="p-3">
                          {job.vehicle
                            ? `${job.vehicle.make} ${job.vehicle.model}`
                            : "N/A"}
                        </td>
                        <td className="p-3">
                          {job.mechanic?.name || "Unassigned"}
                        </td>
                        <td className="p-3">
                          <StatusBadge status={job.status?.name || "Unknown"} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          {/* Mechanic Profiles */}
          <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Team Members
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {stats.mechanics.map((mechanic) => (
                <div
                  key={mechanic.id}
                  className="flex items-center space-x-4 p-4 border border-gray-200 rounded-lg hover:shadow-md hover:border-blue-300 transition-all"
                >
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center text-white text-lg font-bold uppercase shadow-md">
                    {mechanic.name?.charAt(0) || "M"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-900 truncate">
                      {mechanic.name}
                    </div>
                    <div className="text-gray-600 text-sm truncate">
                      {mechanic.email}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-block bg-indigo-100 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium">
                        Mechanic
                      </span>
                      <span className="inline-block w-2 h-2 bg-green-500 rounded-full"></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </Layout>
  );
}

const QuickActionButton = ({ label, icon, color }) => {
  const colors = {
    blue: "bg-blue-500 hover:bg-blue-600",
    green: "bg-green-500 hover:bg-green-600",
    purple: "bg-purple-500 hover:bg-purple-600",
  };
  return (
    <button
      className={`${colors[color]} text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm font-medium transition-colors shadow-sm hover:shadow`}
    >
      <svg
        className="w-4 h-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
      </svg>
      {label}
    </button>
  );
};

const PerformanceCard = ({ title, value, change, trend, subtitle }) => {
  const trendColors = {
    up: "text-green-600 bg-green-50",
    down: "text-red-600 bg-red-50",
    neutral: "text-gray-600 bg-gray-50",
  };
  const trendColor = trendColors[trend] || trendColors.neutral;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-gray-600">{title}</h3>
        <span
          className={`${trendColor} px-2 py-1 rounded text-xs font-semibold`}
        >
          {change}
        </span>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <p className="text-sm text-gray-500">{subtitle}</p>
    </div>
  );
};

const AnalyticsCard = ({ label, count, icon, color, subtitle, trend }) => {
  const colors = {
    blue: "from-blue-500 to-blue-600",
    yellow: "from-yellow-500 to-yellow-600",
    green: "from-green-500 to-green-600",
    purple: "from-purple-500 to-purple-600",
    teal: "from-teal-500 to-teal-600",
    indigo: "from-indigo-500 to-indigo-600",
  };
  const bgColor = colors[color] || colors.blue;

  return (
    <div className="bg-white shadow-sm rounded-xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`bg-gradient-to-br ${bgColor} w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md`}
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
        {trend && (
          <span className="text-xs font-semibold text-green-600">{trend}</span>
        )}
      </div>
      <div className="text-sm text-gray-600 mb-1">{label}</div>
      <div className="text-2xl font-bold text-gray-900">{count}</div>
      {subtitle && <div className="text-xs text-gray-500 mt-1">{subtitle}</div>}
    </div>
  );
};

const StatusBar = ({ label, value, total, color }) => {
  const percentage = total > 0 ? (value / total) * 100 : 0;
  const colors = {
    green: "bg-green-500",
    yellow: "bg-yellow-500",
    blue: "bg-blue-500",
  };

  return (
    <div>
      <div className="flex justify-between text-sm mb-1">
        <span className="text-gray-700 font-medium">{label}</span>
        <span className="text-gray-600">
          {value} ({percentage.toFixed(0)}%)
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`${colors[color]} h-2.5 rounded-full transition-all`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const MetricBox = ({ label, value }) => (
  <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
    <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
    <div className="text-xs text-gray-600">{label}</div>
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
