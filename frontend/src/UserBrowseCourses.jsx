import React, { useEffect, useState } from "react";
import { getCourses, enrollInCourse } from "../api";

const UserBrowseCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await getCourses();
        setCourses(response.data); // ensure backend returns array of courses
      } catch (err) {
        console.error("Failed to fetch courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleEnroll = async (courseId) => {
    try {
      await enrollInCourse(courseId);
      setMessage("✅ Successfully enrolled in course!");
    } catch (err) {
      setMessage("❌ Failed to enroll. Maybe already enrolled?");
    }

    setTimeout(() => setMessage(""), 3000); // clear after 3s
  };

  if (loading) {
    return <p>Loading courses...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Available Courses</h2>
      {message && (
        <div className="mb-4 p-3 rounded bg-blue-100 text-blue-800">
          {message}
        </div>
      )}
      {courses.length === 0 ? (
        <p>No courses available right now.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
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
                onClick={() => handleEnroll(course._id)}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Enroll
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserBrowseCourses;
