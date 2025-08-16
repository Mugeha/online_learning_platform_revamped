// src/admin/EditCourseForm.jsx
import React, { useState } from "react";

export default function EditCourseForm({ course, onClose, onSuccess }) {
  const [form, setForm] = useState(course);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await fetch(`http://localhost:5000/api/courses/${course._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error updating course:", error);
    }
  };

  return (
    <div className="modal">
      <h3>Edit Course</h3>
      <form onSubmit={handleSubmit}>
        <input name="title" value={form.title} onChange={handleChange} required />
        <input name="slug" value={form.slug} onChange={handleChange} required />
        <textarea name="description" value={form.description} onChange={handleChange} required />
        <input name="instructor" value={form.instructor} onChange={handleChange} required />
        <input name="imageUrl" value={form.imageUrl} onChange={handleChange} />
        <input name="category" value={form.category} onChange={handleChange} />
        <input type="number" name="price" value={form.price} onChange={handleChange} />
        <button type="submit" className="btn">Update</button>
        <button type="button" className="btn ghost" onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}
