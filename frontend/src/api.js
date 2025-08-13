// src/api.js
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// Helper to check JWT expiration
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now(); // true if expired
  } catch {
    return true; // if token is invalid format
  }
}

async function request(path, options = {}) {
  let token = localStorage.getItem("token");

  // If token exists but is expired → logout user
  if (token && isTokenExpired(token)) {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    window.location.href = "/login";
    throw new Error("Session expired. Please log in again.");
  }

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

  // Auto-logout on 401 Unauthorized
  if (res.status === 401) {
    localStorage.removeItem("token");
    localStorage.removeItem("isAdmin");
    window.location.href = "/login";
    throw new Error("Unauthorized. Please log in again.");
  }

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

// ================= Admin (to add later) =================
// export const getAllUsers = () => request("/admin/users");
// export const deleteUser = (id) => request(`/admin/users/${id}`, { method: "DELETE" });
// export const createCourse = (body) => request("/admin/courses", { method: "POST", body: JSON.stringify(body) });
// export const updateCourse = (id, body) => request(`/admin/courses/${id}`, { method: "PUT", body: JSON.stringify(body) });
// export const deleteCourse = (id) => request(`/admin/courses/${id}`, { method: "DELETE" });
