// src/pages/MyCourses.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import { getMyCourses, unenrollCourse } from "../api";
import "../styles/global.css";

export default function MyCourses() {
  const navigate = useNavigate();
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const token = localStorage.getItem("token");
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      if (!token) return navigate("/");
      if (isAdmin) return navigate("/admin-dashboard");

      const { data } = await getMyCourses();
      setEnrollments(data.enrollments || data); // support either shape
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleUnenroll = async (courseId) => {
    if (!window.confirm("Unenroll from this course?")) return;
    try {
      await unenrollCourse(courseId);
      setEnrollments((prev) => prev.filter((e) => (e.course?._id || e._id) !== courseId));
    } catch (e) {
      console.error(e);
      alert("Could not unenroll.");
    }
  };

  return (
    <div className="container">
      <TopNav />
      <main>
        <section className="card">
          <h2>My Courses</h2>
          <p className="muted">Continue where you left off.</p>

          {loading ? (
            <p>Loading your courses...</p>
          ) : enrollments.length === 0 ? (
            <p>You have no courses yet.</p>
          ) : (
            <div className="grid">
              {enrollments.map((e) => {
                const c = e.course || e; // in case backend returns course doc in e.course
                const progress = e.progress ?? c.progress ?? 0;
                return (
                  <div key={c._id} className="course-card">
                    <h3>{c.title}</h3>
                    <p className="muted">{c.description}</p>

                    <div className="progress">
                      <div className="progress-bar" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="course-actions">
                      <button className="btn">Continue</button>
                      <button className="btn ghost" onClick={() => handleUnenroll(c._id)}>
                        Unenroll
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
