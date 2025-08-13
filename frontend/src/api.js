// src/api.js
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  const text = await res.text();
  const data = text ? JSON.parse(text) : {};
  if (!res.ok) {
    const err = new Error(data.message || "API error");
    err.status = res.status;
    err.body = data;
    throw err;
  }
  return data;
}

// ================= Auth =================
export const authRegister = (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) });
export const authLogin = (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) });
export const forgotPassword = (body) => request("/auth/forgot-password", { method: "POST", body: JSON.stringify(body) });
export const resetPassword = (token, body) => request(`/auth/reset-password/${token}`, { method: "PUT", body: JSON.stringify(body) });

// ================= Courses (User) =================
export const getAllCourses = () => request("/courses");
export const getCourseById = (id) => request(`/courses/${id}`);
export const enrollInCourse = (id) => request(`/courses/${id}/enroll`, { method: "POST" });
export const getMyCourses = () => request("/courses/my");
export const unenrollFromCourse = (id) => request(`/courses/${id}/unenroll`, { method: "DELETE" });
export const getCourseProgress = (id) => request(`/courses/${id}/progress`);

// ================= Profile =================
export const getMyProfile = () => request("/users/me");
export const updateProfile = (body) => request("/users/me", { method: "PUT", body: JSON.stringify(body) });
export const deleteMyAccount = () => request("/users/me", { method: "DELETE" });

// Dark mode will be handled in frontend state/localStorage — no backend call needed

// ================= Admin (to add later) =================
// export const getAllUsers = () => request("/admin/users");
// export const deleteUser = (id) => request(`/admin/users/${id}`, { method: "DELETE" });
// export const createCourse = (body) => request("/admin/courses", { method: "POST", body: JSON.stringify(body) });
// export const updateCourse = (id, body) => request(`/admin/courses/${id}`, { method: "PUT", body: JSON.stringify(body) });
// export const deleteCourse = (id) => request(`/admin/courses/${id}`, { method: "DELETE" });

