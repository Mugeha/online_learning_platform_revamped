// src/pages/UserBrowseCourses.jsx
import React, { useEffect, useState } from "react";
import { getCourses, enrollInCourse } from "../api";
import "../styles/global.css";

export default function UserBrowseCourses() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getCourses();
        setCourses(data.courses || []);
      } catch (err) {
        console.error("Failed to load courses", err);
      }
    };
    load();
  }, []);

  const handleEnroll = async (id) => {
    try {
      await enrollInCourse(id);
      alert("Enrolled successfully!");
    } catch (err) {
      alert("Failed to enroll. Try again.");
    }
  };

  return (
    <div className="container">
      <h2>Browse Courses</h2>
      <div className="grid">
        {courses.map((course) => (
          <div key={course._id} className="course-card">
            <h3>{course.title}</h3>
            <p className="muted">{course.description}</p>
            <div className="course-meta">
              <span>Instructor: {course.instructor}</span>
              <span>{course.lessons?.length || 0} lessons</span>
            </div>
            <div className="course-actions">
              <button className="btn" onClick={() => handleEnroll(course._id)}>
                Enroll
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
