import React from "react";

export default function CustomerDashboard() {
  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-2xl font-bold mb-4 text-purple-700">
        Customer Dashboard
      </h1>
      <div className="bg-white shadow rounded p-6">
        <p className="mb-2">Welcome! Track your vehicle repairs.</p>
        <ul className="list-disc ml-5">
          <li>View your vehicle status</li>
          <li>Check repair notes</li>
          <li>Receive updates on job progress</li>
        </ul>
      </div>
    </div>
  );
}
