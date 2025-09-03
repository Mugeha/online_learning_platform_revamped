// src/pages/UserDashboard.jsx
import React, { useEffect, useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getMyProfile } from "../api";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/global.css";

export default function UserDashboard() {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      const isAdmin = localStorage.getItem("isAdmin") === "true";

      if (!token) return navigate("/login");
      if (isAdmin) return navigate("/admin-dashboard");

      try {
        // If user is already in context, skip API fetch
        if (!user) {
          const data = await getMyProfile();
          setUser(data.user);
        }
      } catch (err) {
        console.error("Failed to fetch user profile:", err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate, user, setUser]);

  return (
    <div className="user-dashboard-container">
      <main className="user-dashboard-main">
        {loading ? (
          <p>Loading your dashboard...</p>
        ) : (
          <>
            <section className="user-card">
              <h2>Welcome, {user?.name || "Learner"} 👋</h2>
              <p className="muted">
                Jump back into your learning journey or discover new courses recommended for you.
              </p>
              <div className="user-actions">
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

            <section className="user-card">
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
