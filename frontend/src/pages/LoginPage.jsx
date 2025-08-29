import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

import { authLogin } from "../api";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/auth.css";

export default function LoginPage() {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError("Enter email and password");

    setError("");
    setLoading(true);

    try {
      console.log("📤 Logging in with:", form);
      const data = await authLogin(form);
      console.log("✅ Login success response:", data);

      // Normalize user data once
      const userData = { token: data.token, ...data.user };
      login(userData);

       // role-based redirect
    if (data.user?.role === "admin") {
      navigate("/admin-dashboard");
    } else {
      navigate("/user-dashboard");
    }
    } catch (err) {
      console.error("❌ Login failed:", err);
      setError(err.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card">
        <h2>Welcome back</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            <span>Email</span>
            <input
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
            />
          </label>

          <label>
            <span>Password</span>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Your password"
            />
          </label>

          {error && <div className="error">{error}</div>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Sign in"}
          </button>

          <div className="muted">
            <a href="/forgot-password">Forgot password?</a>
          </div>

          <div className="muted">
            No account? <a href="/register">Create one</a>
          </div>
        </form>
      </div>
    </div>
  );
}
