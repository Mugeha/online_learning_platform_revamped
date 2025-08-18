// src/pages/UserEnrolledCourses.jsx
import React, { useEffect, useState } from "react";
import { getMyCourses, unenrollFromCourse } from "../api";
import "../styles/global.css";

export default function UserEnrolledCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyCourses();
        setCourses(data.courses || []);
      } catch (err) {
        console.error("Failed to load enrolled courses", err);
      }
    };
    load();
  }, []);

  const handleUnenroll = async (id) => {
    try {
      await unenrollFromCourse(id);
      setCourses((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      alert("Failed to unenroll. Try again.");
    }
  };

  return (
    <div className="container">
      <h2>My Enrolled Courses</h2>
      <div className="grid">
        {courses.map((course) => {
          // Demo progress: random or use actual backend field if available
          const progress = Math.floor(Math.random() * 100);

          return (
            <div key={course._id} className="course-card">
              <h3>{course.title}</h3>
              <p className="muted">{course.description}</p>
              <div className="progress">
                <div
                  className="progress-bar"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <div style={{ fontSize: ".85rem", marginTop: 4 }}>
                Progress: {progress}%
              </div>
              <div className="course-actions">
                <button className="btn ghost" onClick={() => handleUnenroll(course._id)}>
                  Unenroll
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
