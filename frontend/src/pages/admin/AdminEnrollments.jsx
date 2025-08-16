import React, { useEffect, useState } from "react";

export default function AdminEnrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    fetch("http://localhost:5000/api/admin/enrollments", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setEnrollments(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching enrollments:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading enrollments...</p>;

  return (
    <div className="page-container">
      <h2>All Enrollments</h2>
      <table className="users-table">
        <thead>
          <tr>
            <th>Enrollment ID</th>
            <th>User</th>
            <th>Email</th>
            <th>Course</th>
            <th>Enrolled At</th>
          </tr>
        </thead>
        <tbody>
          {enrollments.length > 0 ? (
            enrollments.map((enr) => (
              <tr key={enr._id}>
                <td>{enr._id}</td>
                <td>{enr.user?.name}</td>
                <td>{enr.user?.email}</td>
                <td>{enr.course?.title}</td>
                <td>{new Date(enr.enrolledAt).toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5">No enrollments found</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
