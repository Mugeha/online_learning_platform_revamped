// src/pages/ProfilePage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import TopNav from "../components/TopNav";
import { getProfile, updateProfile, deleteAccount } from "../api";
import "../styles/auth.css";
import "../styles/global.css";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");
      const isAdmin = localStorage.getItem("isAdmin") === "true";
      if (!token) return navigate("/");
      if (isAdmin) return navigate("/admin-dashboard");
      try {
        const { data } = await getProfile();
        setForm((f) => ({ ...f, name: data.user.name, email: data.user.email }));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSave = async (e) => {
    e.preventDefault();
    setErr(""); setMsg("");
    if (form.password && form.password.length < 6) return setErr("Password must be at least 6 characters");
    if (form.password && form.password !== form.confirm) return setErr("Passwords do not match");

    setSaving(true);
    try {
      const payload = { name: form.name, email: form.email };
      if (form.password) payload.password = form.password;
      await updateProfile(payload);
      setMsg("Profile updated");
      if (form.password) {
        // after password change, force re-login
        localStorage.clear();
        navigate("/login");
      }
    } catch (e) {
      setErr(e?.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("This will permanently delete your account. Continue?")) return;
    try {
      await deleteAccount();
      localStorage.clear();
      navigate("/");
    } catch (e) {
      alert("Could not delete account.");
    }
  };

  return (
    <div className="container">
      <TopNav />
      <main>
        <section className="card" style={{ maxWidth: 600 }}>
          <h2>My Profile</h2>
          {loading ? (
            <p>Loading profile...</p>
          ) : (
            <form className="auth-form" onSubmit={handleSave}>
              <label>
                <span>Name</span>
                <input name="name" value={form.name} onChange={handleChange} />
              </label>
              <label>
                <span>Email</span>
                <input name="email" value={form.email} onChange={handleChange} />
              </label>
              <label>
                <span>New password (optional)</span>
                <input name="password" type="password" value={form.password} onChange={handleChange} placeholder="Leave blank to keep current" />
              </label>
              <label>
                <span>Confirm new password</span>
                <input name="confirm" type="password" value={form.confirm} onChange={handleChange} />
              </label>

              {err && <div className="error">{err}</div>}
              {msg && <div className="success">{msg}</div>}

              <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                <button className="btn" type="submit" disabled={saving}>
                  {saving ? "Saving..." : "Save changes"}
                </button>
                <button className="btn ghost" type="button" onClick={handleDelete}>
                  Delete account
                </button>
              </div>
            </form>
          )}
        </section>
      </main>
    </div>
  );
}
