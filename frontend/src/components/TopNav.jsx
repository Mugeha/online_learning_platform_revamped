// src/components/TopNav.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../styles/global.css";

export default function TopNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");

  useEffect(() => {
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const active = (path) => (location.pathname === path ? "active-link" : "");

  return (
    <nav className="topnav">
      <div className="topnav-left">
        <Link to="/" className="brand">Online Learning</Link>
        <Link to="/user-dashboard" className={`topnav-link ${active("/user-dashboard")}`}>Dashboard</Link>
        <Link to="/courses" className={`topnav-link ${active("/courses")}`}>Browse</Link>
        <Link to="/my-courses" className={`topnav-link ${active("/my-courses")}`}>My Courses</Link>
        <Link to="/profile" className={`topnav-link ${active("/profile")}`}>Profile</Link>
      </div>
      <div className="topnav-right">
        <button
          className="btn ghost"
          onClick={() => setTheme((t) => (t === "light" ? "dark" : "light"))}
          title="Toggle dark mode"
        >
          {theme === "light" ? "🌙" : "☀️"}
        </button>
        <button
          className="btn"
          onClick={() => {
            localStorage.clear();
            navigate("/");
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
