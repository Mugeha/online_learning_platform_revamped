// src/pages/UserDashboard.jsx
import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { getMyProfile } from "../api";
import "../styles/global.css";

export default function UserDashboard() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
    const { username } = useContext(AuthContext);


  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      if (!token) return navigate("/login");
      if (isAdmin) return navigate("/admin-dashboard");
      try {
        const data = await getMyProfile();
        setUser(data.user);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  return (
    <div className="container">
      <main>
        {loading ? (
          <p>Loading your dashboard...</p>
        ) : (
          <>
            <section className="card" style={{ marginBottom: 20 }}>
              <h2>Welcome, {username?.name || "Learner"} 👋</h2>
              <p className="muted">
                Jump back into your learning journey or discover new courses recommended for you.
              </p>
              <div style={{ marginTop: 12, display: "flex", gap: "12px" }}>
                <Link to="/my-courses" className="btn">
                  My Courses
                </Link>
                <Link to="/courses" className="btn ghost">
                  Browse Courses
                </Link>
                <Link to="/profile" className="btn ghost">
                  My Profile
                </Link>
              </div>
            </section>

            <section className="card">
              <h2>Tips</h2>
              <p className="muted">
                Track progress on enrolled courses from <strong>My Courses</strong>.  
                Update your details in <strong>Profile</strong>.
              </p>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
