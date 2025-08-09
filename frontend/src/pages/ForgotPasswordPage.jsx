// src/pages/ForgotPasswordPage.jsx
import React, { useState } from "react";
import { forgotPassword } from "../api";
import "../styles/auth.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null); // null | "sent" | "error"
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return setError("Enter your email");
    setError("");
    setLoading(true);
    try {
      await forgotPassword({ email });
      setStatus("sent");
    } catch (err) {
      setStatus("error");
      setError(err.message || "Could not generate reset link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="card">
        <h2>Reset password</h2>

       
{status === "sent" ? (
  <div className="flow">
    <p>We generated a password reset link. Check your email for the link.</p>
    <p className="muted">If you don’t see it, check your spam folder.</p>
    <a className="btn ghost" href="/login">Back to login</a>
  </div>
) : (

          <form onSubmit={handleSubmit} className="auth-form">
            <label>
              <span>Email</span>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
            </label>

            {error && <div className="error">{error}</div>}

            <button className="btn" type="submit" disabled={loading}>
              {loading ? "Generating..." : "Send reset link"}
            </button>

          </form>
        )}
      </div>
    </div>
  );
}
