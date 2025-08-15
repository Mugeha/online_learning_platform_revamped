// src/pages/BrowseCourses.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import { getAllCourses, getMyCourses, enrollInCourse } from "../api";
import "../styles/global.css";

export default function BrowseCourses() {
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [enrolledIds, setEnrolledIds] = useState(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      const isAdmin = localStorage.getItem("isAdmin") === "true";

      if (!token) return navigate("/");
      if (isAdmin) return navigate("/admin-dashboard");

      try {
        const [all, mine] = await Promise.all([
          getAllCourses(),
          getMyCourses(),
        ]);

        // `all` could be { courses: [] } or an array
        const courseList = Array.isArray(all) ? all : all.courses || [];
        const myEnrolledIds = (mine.enrollments || mine).map(
          (e) => e.course?._id || e._id
        );

        setCourses(courseList);
        setEnrolledIds(new Set(myEnrolledIds));
      } catch (err) {
        console.error("Error loading courses:", err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, [navigate]);

  const handleEnroll = async (id) => {
    try {
      await enrollInCourse(id);
      setEnrolledIds((prev) => new Set(prev).add(id));
    } catch (e) {
      console.error(e);
      alert("Could not enroll. Please try again.");
    }
  };

  return (
    <div className="container">
      <TopNav />
      <main>
        <section className="card">
          <h2>Browse Courses</h2>
          <p className="muted">Find something new to learn today.</p>

          {loading ? (
            <p>Loading courses...</p>
          ) : courses.length === 0 ? (
            <p>No courses available yet.</p>
          ) : (
            <div className="grid">
              {courses.map((c) => (
                <div key={c._id} className="course-card">
                  <h3>{c.title}</h3>
                  <p className="muted">{c.description}</p>
                  <div className="course-meta">
                    <span>{c.category || "General"}</span>
                    <span>{c.level || "Beginner"}</span>
                  </div>
                  <button
                    className={enrolledIds.has(c._id) ? "btn ghost" : "btn"}
                    disabled={enrolledIds.has(c._id)}
                    onClick={() => handleEnroll(c._id)}
                  >
                    {enrolledIds.has(c._id) ? "Enrolled" : "Enroll"}
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
