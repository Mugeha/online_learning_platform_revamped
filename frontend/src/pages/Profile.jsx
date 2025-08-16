// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { getMyProfile, updateProfile, deleteMyAccount } from "../api";
import "../styles/global.css";

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    currentPassword: "",
    newPassword: ""
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getMyProfile();
        setUser(data);
        setForm(f => ({
          ...f,
          name: data.name || "",
          email: data.email || "",
          address: data.address || ""  // harmless if not in schema
        }));
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        email: form.email,
        address: form.address,
      };
      if (form.newPassword) {
        payload.currentPassword = form.currentPassword;
        payload.newPassword = form.newPassword;
      }
      const updated = await updateProfile(payload);
      setUser(updated);
      // Clear password fields
      setForm({ ...form, currentPassword: "", newPassword: "" });
      alert("Profile updated");
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async () => {
    if (!window.confirm("This will permanently delete your account. Continue?")) return;
    try {
      await deleteMyAccount();
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      window.location.href = "/";
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to delete account");
    }
  };

  if (loading) return <div className="container"><p>Loading profile…</p></div>;

  return (
    <div className="container">
      <header className="site-header">
        <h1>My Profile</h1>
        <span className="muted">{user?.isAdmin ? "Admin" : "User"}</span>
      </header>

      <main>
        <section className="card" style={{ marginBottom: 20 }}>
          <h2>Account</h2>
          <form onSubmit={onSave} className="auth-form">
            <label>
              <span>Name</span>
              <input name="name" value={form.name} onChange={onChange} />
            </label>

            <label>
              <span>Email</span>
              <input name="email" type="email" value={form.email} onChange={onChange} />
            </label>

            {/* Optional – kept for future proofing if you add address to schema */}
            <label>
              <span>Address</span>
              <input name="address" value={form.address} onChange={onChange} placeholder="(optional)" />
            </label>

            <div className="muted" style={{ marginTop: 8 }}>
              Change password (optional)
            </div>

            <label>
              <span>Current Password</span>
              <input name="currentPassword" type="password" value={form.currentPassword} onChange={onChange} />
            </label>

            <label>
              <span>New Password</span>
              <input name="newPassword" type="password" value={form.newPassword} onChange={onChange} />
            </label>

            <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
              <button className="btn" type="submit" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button className="btn ghost" type="button" onClick={onDelete}>
                Delete Account
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
