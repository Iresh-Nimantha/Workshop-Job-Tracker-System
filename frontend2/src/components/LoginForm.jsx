import React, { useState } from "react";
import api, { setAuthSession } from "../libs/api";

export default function LoginForm({ onLogin }) {
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/auth/login", {
        login, // 'login' key for Laravel backend
        password,
      });
      const data = response.data;
      console.log("Login Response:", data);
      if (data.token && data.user) {
        setAuthSession({ token: data.token, user: data.user });
        onLogin(data.user);
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || "Login request failed"
      );
    }
    setLoading(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md p-8 rounded max-w-sm w-full"
      >
        <h2 className="mb-6 text-xl font-bold text-center text-red-600">
          Login
        </h2>
        {error && <p className="mb-4 text-red-600 text-center">{error}</p>}
        <div className="mb-4">
          <label className="block mb-2 text-sm text-gray-600">Email</label>
          <input
            type="email"
            className="w-full px-3 py-2 border rounded"
            value={login}
            onChange={(e) => setLogin(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm text-gray-600">Password</label>
          <input
            type="password"
            className="w-full px-3 py-2 border rounded"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
