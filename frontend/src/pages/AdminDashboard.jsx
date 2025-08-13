// src/pages/AdminDashboard.jsx
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/global.css";
import "../styles/auth.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const isAdmin = localStorage.getItem("isAdmin");

    // Check if logged in
    if (!token) {
      navigate("/");
      return;
    }

    // Check if admin
    if (isAdmin !== "true") {
      navigate("/user-dashboard");
    }
  }, [navigate]);

  return (
    <div className="admin-dashboard-container">
      {/* Top navigation */}
      <header className="admin-header">
        <h1>Admin Dashboard</h1>
        <button
          className="logout-btn"
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          Logout
        </button>
      </header>

      {/* Main dashboard content */}
      <main className="admin-content">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <ul>
            <li onClick={() => navigate("/admin/users")}>👥 View All Users</li>
            <li onClick={() => navigate("/admin/courses")}>📚 Manage Courses</li>
            <li onClick={() => navigate("/admin/enrollments")}>📝 View Enrollments</li>
            <li onClick={() => navigate("/admin/analytics")}>📊 Analytics</li>
            <li onClick={() => navigate("/admin/moderation")}>🛡️ Moderate Content</li>
            <li onClick={() => navigate("/admin/profile")}>⚙️ Admin Profile Settings</li>
          </ul>
        </aside>

        {/* Placeholder for selected feature */}
        <section className="admin-feature-view">
          <h2>Welcome, Admin 👋</h2>
          <p>Select a menu item to manage the system.</p>
        </section>
      </main>
    </div>
  );
}
