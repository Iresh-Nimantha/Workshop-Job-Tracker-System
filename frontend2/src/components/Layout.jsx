import React from "react";
import { Link } from "react-router-dom";

export default function Layout({ children, links = [] }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      {/* <header className="bg-blue-600 shadow">
        <div className="max-w-7xl mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-white text-xl font-semibold">
            Workshop Job Tracker System
          </h1>
          <nav>
            <ul className="flex space-x-4">
              {links.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-white hover:text-blue-200 text-sm font-medium"
                  >
                    {label}
                  </Link>
                </li>
              ))}

              <li>
                <button
                  onClick={() => {
                    localStorage.clear();
                    window.location.href = "/login";
                  }}
                  className="text-white hover:text-blue-200 text-sm font-medium"
                >
                  Logout
                </button>
              </li>
            </ul>
          </nav>
        </div>
      </header> */}

      {/* Main content */}
      <main className="flex-grow">{children}</main>

      {/* Footer */}
      <footer className="bg-gray-200 text-center py-4 text-sm text-gray-600">
        &copy; {new Date().getFullYear()} AUTO REPAIR WORKSHOP
      </footer>
    </div>
  );
}
