// src/api.js
import axios from "axios";

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// --- Helper: check JWT expiration ---
function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp * 1000 < Date.now();
  } catch {
    return true; 
  }
}

// --- Axios instance ---
const API = axios.create({ baseURL: API_BASE });

// --- Interceptors ---
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) {
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
export const resetPassword = (token, body) => API.put(`/auth/reset-password/${token}`, body).then(r => r.data);

// ========== Courses ==========
export const getCourses = () => API.get("/courses").then(r => r.data);
export const getCourseBySlug = (slug) => API.get(`/courses/slug/${slug}`).then(r => r.data);

export const getMyCourses = () => API.get("/courses/my-courses/list").then(r => r.data);
export const enrollInCourse = (id) => API.post(`/courses/${id}/enroll`).then(r => r.data);
export const unenrollFromCourse = (id) => API.delete(`/courses/${id}/unenroll`).then(r => r.data);

// ========== Profile (User) ==========
export const getMyProfile = () => API.get("/users/profile").then(r => r.data);
export const updateUserProfile = (body) => API.put("/users/profile", body).then(r => r.data);
export const deleteMyAccount = () => API.delete("/users/me").then(r => r.data);

// ========== Admin ==========
export const getAdminUsers = () => API.get("/admin/users").then(r => r.data);
export const adminUpdateUser = (id, body) => API.put(`/admin/users/${id}`, body).then(r => r.data);
export const adminDeleteUser = (id) => API.delete(`/admin/users/${id}`).then(r => r.data);

export const adminCreateCourse = (course) => API.post("/admin/courses", course).then(r => r.data);
export const adminUpdateCourse = (id, body) => API.put(`/admin/courses/${id}`, body).then(r => r.data);
export const adminDeleteCourse = (id) => API.delete(`/admin/courses/${id}`).then(r => r.data);

export const getAllEnrollments = () => API.get("/admin/courses/enrollments").then(r => r.data);
export const getAdminAnalytics = () => API.get("/admin/courses/analytics").then(r => r.data);

export default API;
