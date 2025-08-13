// src/pages/Home.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";
import "../styles/auth.css"; // for button styles

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const { data } = await axios.get("/api/users/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  return (
    <div className="home-container">
      {user ? (
        <div className="home-content">
          <h1 className="home-title">Welcome, {user.name} 👋</h1>
          <p className="home-subtitle">
            Glad to have you back! Choose where you want to go next.
          </p>

          <div className="home-buttons">
            {user.isAdmin && (
              <Link to="/admin-dashboard" className="btn btn-primary">
                Admin Dashboard
              </Link>
            )}
            <Link to="/courses" className="btn btn-secondary">
              View Courses
            </Link>
          </div>
        </div>
      ) : (
        <div className="home-content">
          <h1 className="home-title">Welcome to Our Platform</h1>
          <p className="home-subtitle">
            Join us to explore courses and learn new skills.
          </p>
          <div className="home-buttons">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
            <Link to="/register" className="btn btn-secondary">
              Register
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
