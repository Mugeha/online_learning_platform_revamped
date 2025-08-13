// src/pages/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/global.css";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const token = localStorage.getItem("token");
        const isAdmin = localStorage.getItem("isAdmin") === "true";

        if (!token || !isAdmin) {
          navigate("/"); // block non-admins
          return;
        }

        const { data } = await axios.get("/api/users/admin-data", {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUsers(data.users);
      } catch (err) {
        console.error("Error loading admin data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  return (
    <div className="container">
      <header className="site-header">
        <h1>Admin Dashboard</h1>
        <Link to="/" className="btn ghost">Back to Home</Link>
      </header>

      <main>
        {loading ? (
          <p>Loading admin data...</p>
        ) : (
          <>
            <section className="card" style={{ marginBottom: "20px" }}>
              <h2>Manage Users</h2>
              <p className="muted">Promote or remove admin rights for users.</p>
              <table style={{ width: "100%", marginTop: "10px", borderCollapse: "collapse" }}>
                <thead>
                  <tr>
                    <th style={{ textAlign: "left", padding: "8px" }}>Name</th>
                    <th style={{ textAlign: "left", padding: "8px" }}>Email</th>
                    <th style={{ textAlign: "left", padding: "8px" }}>Role</th>
                    <th style={{ textAlign: "left", padding: "8px" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id} style={{ borderBottom: "1px solid #eee" }}>
                      <td style={{ padding: "8px" }}>{user.name}</td>
                      <td style={{ padding: "8px" }}>{user.email}</td>
                      <td style={{ padding: "8px" }}>{user.isAdmin ? "Admin" : "User"}</td>
                      <td style={{ padding: "8px" }}>
                        {user.isAdmin ? (
                          <button className="btn ghost" style={{ fontSize: "0.8rem" }}>
                            Remove Admin
                          </button>
                        ) : (
                          <button className="btn" style={{ fontSize: "0.8rem" }}>
                            Make Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>

            <section className="card">
              <h2>Manage Courses</h2>
              <p className="muted">Add, edit, or remove courses available on the platform.</p>
              <div style={{ marginTop: "12px" }}>
                <Link to="/add-course" className="btn">Add New Course</Link>
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}
