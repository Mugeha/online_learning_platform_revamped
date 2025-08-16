// frontend/src/components/admin/AdminProfile.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminProfile = () => {
  const [admin, setAdmin] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const { data } = await axios.get("/api/users/profile", {
          withCredentials: true,
        });
        setAdmin(data);
        setForm({ name: data.name, email: data.email, password: "" });
      } catch (err) {
        console.error("Error loading admin profile:", err);
      }
    };
    fetchAdmin();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/api/users/profile", form, {
        withCredentials: true,
      });
      setMessage("Profile updated successfully!");
      setAdmin(data);
    } catch (err) {
      setMessage("Error updating profile.");
    }
  };

  if (!admin) return <p>Loading...</p>;

  return (
    <div>
      <h2>👤 Admin Profile</h2>
      {message && <p>{message}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input name="name" value={form.name} onChange={handleChange} />
        </div>
        <div>
          <label>Email:</label>
          <input name="email" value={form.email} onChange={handleChange} />
        </div>
        <div>
          <label>New Password:</label>
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Update Profile</button>
      </form>
    </div>
  );
};

export default AdminProfile;
