// src/pages/UserProfile.jsx
import React, { useEffect, useState, useContext } from "react";
import { getMyProfile, updateUserProfile } from "../api";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/global.css";

export default function UserProfile() {
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // If user exists in context, use it; else fetch
        if (user) {
          setForm({ name: user.name, email: user.email, password: "" });
        } else {
          const data = await getMyProfile();
          setUser(data.user);
          setForm({ name: data.user.name, email: data.user.email, password: "" });
        }
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user, setUser]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    try {
      const updated = await updateUserProfile(form);
      setUser(updated.user); // ✅ update context so dashboard reflects instantly
      setForm({ ...form, password: "" }); // clear password field after update
      setMessage("✅ Profile updated successfully!");
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to update profile.");
    }
  };

  if (loading) return <p>Loading profile...</p>;

  return (
    <div className="container">
      <main>
        <section className="card">
          <h2>My Profile</h2>
          {message && <p className="muted">{message}</p>}
          <form onSubmit={handleSubmit} className="form">
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>New Password (optional)</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter new password"
              />
            </div>
            <button type="submit" className="btn">Update Profile</button>
          </form>
        </section>
      </main>
    </div>
  );
}
