// src/pages/admin/AddCourseForm.jsx
import React, { useState } from "react";

export default function AddCourseForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    instructor: "",
    imageUrl: "",
    category: "",
    price: 0,
  });

  const token = localStorage.getItem("token");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch("http://localhost:5000/api/courses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to create course");
        return res.json();
      })
      .then(() => {
        onSuccess();
        onClose();
      })
      .catch((err) => console.error("Error adding course:", err));
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <h3>Add New Course</h3>
        <form onSubmit={handleSubmit}>
          <input name="title" value={formData.title} onChange={handleChange} placeholder="Title" required />
          <input name="slug" value={formData.slug} onChange={handleChange} placeholder="Slug" required />
          <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required />
          <input name="instructor" value={formData.instructor} onChange={handleChange} placeholder="Instructor" required />
          <input name="imageUrl" value={formData.imageUrl} onChange={handleChange} placeholder="Image URL" />
          <input name="category" value={formData.category} onChange={handleChange} placeholder="Category" />
          <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price" />

          <div className="popup-actions">
            <button type="submit">Create</button>
            <button type="button" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
