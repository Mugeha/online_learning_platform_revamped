import React, { useState } from "react";
import UserBrowseCourses from "./UserBrowseCourses";
import UserEnrolledCourses from "./UserEnrolledCourses";
import UserProgressTracker from "./UserProgressTracker";
import UserProfile from "./UserProfile";

const UserDashboard = () => {
  const [activeSection, setActiveSection] = useState("browse");

  const renderSection = () => {
    switch (activeSection) {
      case "browse":
        return <UserBrowseCourses />;
      case "enrolled":
        return <UserEnrolledCourses />;
      case "progress":
        return <UserProgressTracker />;
      case "profile":
        return <UserProfile />;
      default:
        return <UserBrowseCourses />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg p-6">
        <h2 className="text-2xl font-bold text-blue-600 mb-6">User Dashboard</h2>
        <nav className="space-y-3">
          <button
            onClick={() => setActiveSection("browse")}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              activeSection === "browse"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            📚 Browse Courses
          </button>
          <button
            onClick={() => setActiveSection("enrolled")}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              activeSection === "enrolled"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            🎓 My Enrolled Courses
          </button>
          <button
            onClick={() => setActiveSection("progress")}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              activeSection === "progress"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            📈 Progress Tracker
          </button>
          <button
            onClick={() => setActiveSection("profile")}
            className={`w-full text-left px-4 py-2 rounded-lg ${
              activeSection === "profile"
                ? "bg-blue-600 text-white"
                : "hover:bg-gray-200"
            }`}
          >
            👤 My Profile
          </button>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6">{renderSection()}</main>
    </div>
  );
};

export default UserDashboard;
