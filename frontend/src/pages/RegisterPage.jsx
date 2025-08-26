// src/pages/RegisterPage.jsx
import React, { useState, useContext } from "react";
import { authRegister } from "../api";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/auth.css";

export default function RegisterPage({ history }) {
  const { login } = useContext(AuthContext);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const validate = () => {
    if (!form.name || !form.email || !form.password) return "All fields are required";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    if (form.password !== form.confirm) return "Passwords do not match";
    // simple email check
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const v = validate();
    if (v) return setError(v);
    setError("");
    setLoading(true);
   try {
  console.log("📤 Submitting registration form with:", {
    name: form.name,
    email: form.email,
    password: form.password
  });

  const data = await authRegister({
    name: form.name,
    email: form.email,
    password: form.password
  });

  console.log("✅ Registration success response:", data);

  login(data);
  if (data.user.role === "admin") {
    window.location.href = "/admin-dashboard";
  } else {
    window.location.href = "/user-dashboard";
  }
} catch (err) {
  console.error("❌ Registration failed:", err);
  setError(err.message || "Registration failed");
}
 finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card">
        <h2>Create account</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          <label>
            <span>Name</span>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Your name" />
          </label>

          <label>
            <span>Email</span>
            <input name="email" value={form.email} onChange={handleChange} placeholder="you@example.com" />
          </label>

          <label>
            <span>Password</span>
            <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="6+ characters" />
          </label>

          <label>
            <span>Confirm</span>
            <input name="confirm" type="password" value={form.confirm} onChange={handleChange} placeholder="Repeat password" />
          </label>

          {error && <div className="error">{error}</div>}

          <button className="btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create account"}
          </button>

          <div className="muted">
            Already have an account? <a href="/login">Log in</a>
          </div>
        </form>
      </div>
    </div>
  );
}
