// src/api.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// --- Helper: check JWT expiration (defensive) ---
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; // bad token format -> treat as expired
  }
}

// --- Axios instance ---
const API = axios.create({
  baseURL: API_BASE,
});

// --- Interceptors ---
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
    // Auto-logout if token expired (client-side check)
    if (isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      window.location.href = "/login";
      throw new axios.Cancel("Session expired. Redirecting to login.");
    }
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

API.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ========== Auth ==========
export const authRegister = (body) => API.post("/auth/register", body).then(r => r.data);
export const authLogin = (body) => API.post("/auth/login", body).then(r => r.data);
export const forgotPassword = (body) => API.post("/auth/forgot-password", body).then(r => r.data);
export const resetPassword = (token, body) =>
  API.put(`/auth/reset-password/${token}`, body).then(r => r.data);

// ========== Courses (Public + User) ==========
// Public
export const getAllCourses = () => API.get("/courses").then(r => r.data);
export const getCourseBySlug = (slug) => API.get(`/courses/${slug}`).then(r => r.data);

// User-specific (must be logged in)
export const getMyCourses = () => API.get("/courses/my-courses/list").then(r => r.data);
export const enrollInCourse = (id) => API.post(`/courses/${id}/enroll`).then(r => r.data);
export const unenrollFromCourse = (id) => API.delete(`/courses/${id}/unenroll`).then(r => r.data);

// ========== Profile (User) ==========
// Matches your current backend: GET /api/users/profile
export const getMyProfile = () => API.get("/users/profile").then(r => r.data);

// These two need backend routes (/api/users/me) when we add them.
// Keeping exported for when we wire them next; for now they’ll 404 if called.
export const updateProfile = (body) => API.put("/users/me", body).then(r => r.data);
export const deleteMyAccount = () => API.delete("/users/me").then(r => r.data);

// ========== Admin ==========
// Matches your current backend: GET /api/users/admin-data (returns { message, users })
export const getAdminUsers = () => API.get("/users/admin-data").then(r => r.data);

// Course create/update/delete already go through /courses with admin middleware.
// If you want convenience wrappers for the Admin UI:
export const adminCreateCourse = (course) => API.post("/courses", course).then(r => r.data);
export const adminUpdateCourse = (id, body) => API.put(`/courses/${id}`, body).then(r => r.data);
export const adminDeleteCourse = (id) => API.delete(`/courses/${id}`).then(r => r.data);

// When we add real admin user management later, we can expose:
// export const adminDeleteUser = (id) => API.delete(`/admin/users/${id}`).then(r => r.data);
// export const adminToggleAdmin = (id, makeAdmin) => API.put(`/admin/users/${id}/role`, { isAdmin: makeAdmin }).then(r => r.data);

export default API;
