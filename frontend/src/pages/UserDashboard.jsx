// src/pages/UserDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const isAdmin = localStorage.getItem("isAdmin") === "true";

        if (!token) {
          navigate("/"); // Not logged in → public homepage
          return;
        }

        if (isAdmin) {
          navigate("/admin-dashboard"); // If admin tries to access → send to admin dashboard
          return;
        }

        const { data } = await axios.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(data.user);
      } catch (err) {
        console.error("Error loading user data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="container">
      <header className="site-header">
        <h1>User Dashboard</h1>
        <Link to="/" className="btn ghost">Back to Home</Link>
      </header>

      <main>
        {loading ? (
          <p>Loading your dashboard...</p>
        ) : (
          <>
            <section className="card" style={{ marginBottom: "20px" }}>
              <h2>Welcome, {user?.name || "User"}!</h2>
              <p className="muted">
                This is your personal dashboard where you can manage your account and view your enrolled courses.
              </p>
              <div style={{ marginTop: "12px" }}>
                <Link to="/profile" className="btn">View Profile</Link>
                <Link to="/my-courses" className="btn ghost" style={{ marginLeft: "10px" }}>
                  My Courses
                </Link>
              </div>
            </section>

            <section className="card">
              <h2>Available Courses</h2>
              <p className="muted">
                Browse and enroll in new courses to expand your learning journey.
              </p>
              <div style={{ marginTop: "12px" }}>
                <Link to="/courses" className="btn">Browse Courses</Link>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
