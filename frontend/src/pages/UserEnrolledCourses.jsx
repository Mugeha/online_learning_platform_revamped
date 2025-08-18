import React, { useEffect, useState } from "react";
import { getMyCourses, unenrollFromCourse } from "../api";

const UserEnrolledCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        const response = await getMyCourses();
        setEnrolledCourses(response.data); // backend should return array of enrolled courses
      } catch (err) {
        console.error("Failed to fetch enrolled courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrolledCourses();
  }, []);

  const handleUnenroll = async (courseId) => {
    try {
      await unenrollFromCourse(courseId);
      setMessage("✅ Successfully unenrolled from course!");

      // remove from local state
      setEnrolledCourses((prev) =>
        prev.filter((course) => course._id !== courseId)
      );
    } catch (err) {
      setMessage("❌ Failed to unenroll.");
    }

    setTimeout(() => setMessage(""), 3000); // clear after 3s
  };

  if (loading) {
    return <p>Loading your enrolled courses...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">My Enrolled Courses</h2>
      {message && (
        <div className="mb-4 p-3 rounded bg-green-100 text-green-800">
          {message}
        </div>
      )}
      {enrolledCourses.length === 0 ? (
        <p>You have not enrolled in any courses yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {enrolledCourses.map((course) => (
            <div
              key={course._id}
              className="bg-white shadow-md rounded-lg p-5 border"
            >
              <h3 className="text-xl font-semibold">{course.title}</h3>
              <p className="text-gray-600 mt-2">{course.description}</p>
              <p className="text-sm text-gray-500 mt-1">
                Instructor: {course.instructor || "N/A"}
              </p>
              <button
                onClick={() => handleUnenroll(course._id)}
                className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Unenroll
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserEnrolledCourses;
