// frontend/src/components/admin/AdminAnalytics.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    enrollments: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get("/api/admin/analytics", {
          withCredentials: true,
        });
        setStats(data);
      } catch (err) {
        console.error("Error fetching analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <p>Loading analytics...</p>;

  return (
    <div>
      <h2>📊 Admin Analytics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Users</h3>
          <p>{stats.users}</p>
        </div>
        <div className="stat-card">
          <h3>Total Courses</h3>
          <p>{stats.courses}</p>
        </div>
        <div className="stat-card">
          <h3>Total Enrollments</h3>
          <p>{stats.enrollments}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
