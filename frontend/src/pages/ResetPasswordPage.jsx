// src/pages/ResetPasswordPage.jsx
import React, { useState } from "react";
import { resetPassword } from "../api";
import "../styles/auth.css";

export default function ResetPasswordPage({ match }) {
  // With CRA + react-router v5, token is in match.params.token
  const token = match?.params?.token || new URLSearchParams(window.location.search).get("token");
  const [form, setForm] = useState({ password: "", confirm: "" });
  const [status, setStatus] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) return setError("Password must be at least 6 characters");
    if (form.password !== form.confirm) return setError("Passwords do not match");
    if (!token) return setError("Missing reset token");

    setError("");
    setLoading(true);
    try {
      await resetPassword(token, { password: form.password });
      setStatus("ok");
    } catch (err) {
setError(err.response?.data?.message || err.message || "Password reset failed. Your link may have expired.");
      setStatus("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card">
        <h2>Create a new password</h2>

        {status === "ok" ? (
          <div className="flow">
<p className="success">Your password has been updated successfully. You can now log in with your new password.</p>
            <a className="btn" href="/login">Go to Login</a>
          </div>
        ) : (
          <form className="auth-form" onSubmit={handleSubmit}>
            <label>
              <span>New password</span>
              <input name="password" type="password" value={form.password} onChange={handleChange} />
            </label>

            <label>
              <span>Confirm password</span>
              <input name="confirm" type="password" value={form.confirm} onChange={handleChange} />
            </label>

            {error && <div className="error">{error}</div>}

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Updating..." : "Update password"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
