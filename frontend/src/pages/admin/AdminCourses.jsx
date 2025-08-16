// src/pages/admin/AdminCourses.jsx
import React, { useEffect, useState } from "react";
import AddCourseForm from "./AddCourseForm";

export default function AdminCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch all courses
  const fetchCourses = () => {
    fetch("http://localhost:5000/api/courses", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setCourses(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Delete course
  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    fetch(`http://localhost:5000/api/courses/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to delete course");
        fetchCourses();
      })
      .catch((err) => console.error(err));
  };

  // Save edit
  const handleSaveEdit = (updatedCourse) => {
    fetch(`http://localhost:5000/api/courses/${editingCourse._id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedCourse),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to update course");
        return res.json();
      })
      .then(() => {
        setEditingCourse(null);
        fetchCourses();
      })
      .catch((err) => console.error(err));
  };

  if (loading) return <p>Loading courses...</p>;

  return (
    <div className="page-container">
      <h2>All Courses</h2>
      <button onClick={() => setShowAddForm(true)}>+ Add New Course</button>

      {/* Add Course Form */}
      {showAddForm && (
        <AddCourseForm
          onClose={() => setShowAddForm(false)}
          onSuccess={fetchCourses}
        />
      )}

      {/* Edit Popup */}
      {editingCourse && (
        <div className="popup">
          <div className="popup-content">
            <h3>Edit Course</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const updatedCourse = Object.fromEntries(formData.entries());
                handleSaveEdit(updatedCourse);
              }}
            >
              <input
                type="text"
                name="title"
                defaultValue={editingCourse.title}
                placeholder="Title"
                required
              />
              <input
                type="text"
                name="slug"
                defaultValue={editingCourse.slug}
                placeholder="Slug"
                required
              />
              <textarea
                name="description"
                defaultValue={editingCourse.description}
                placeholder="Description"
                required
              />
              <input
                type="text"
                name="instructor"
                defaultValue={editingCourse.instructor}
                placeholder="Instructor"
                required
              />
              <input
                type="text"
                name="imageUrl"
                defaultValue={editingCourse.imageUrl}
                placeholder="Image URL"
              />
              <input
                type="text"
                name="category"
                defaultValue={editingCourse.category}
                placeholder="Category"
              />
              <input
                type="number"
                name="price"
                defaultValue={editingCourse.price}
                placeholder="Price"
              />

              <div className="popup-actions">
                <button type="submit">Save</button>
                <button type="button" onClick={() => setEditingCourse(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Courses Table */}
      <table className="courses-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Instructor</th>
            <th>Category</th>
            <th>Price</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {courses.length > 0 ? (
            courses.map((course) => (
              <tr key={course._id}>
                <td>{course._id}</td>
                <td>{course.title}</td>
                <td>{course.instructor}</td>
                <td>{course.category}</td>
                <td>{course.price === 0 ? "Free" : `$${course.price}`}</td>
                <td>
                  <button onClick={() => setEditingCourse(course)}>Edit</button>
                  <button onClick={() => handleDelete(course._id)}>Delete</button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="6">No courses found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
