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
// Request interceptor
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");

  console.log(
    "%c[API REQUEST]",
    "color: blue; font-weight: bold",
    {
      method: req.method,
      url: req.baseURL + req.url,
      headers: req.headers,
      data: req.data
    }
  );

  if (token) {
    if (isTokenExpired(token)) {
      console.warn("[API] Token expired, clearing localStorage and redirecting.");
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      window.location.href = "/login";
      throw new axios.Cancel("Session expired. Redirecting to login.");
    }
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Response interceptor
API.interceptors.response.use(
  (res) => {
    console.log(
      "%c[API RESPONSE]",
      "color: green; font-weight: bold",
      {
        url: res.config.url,
        status: res.status,
        data: res.data
      }
    );
    return res;
  },
  (err) => {
    if (err.response) {
      console.error(
        "%c[API ERROR RESPONSE]",
        "color: red; font-weight: bold",
        {
          url: err.config?.url,
          status: err.response?.status,
          data: err.response?.data
        }
      );
    } else {
      console.error(
        "%c[API ERROR]",
        "color: red; font-weight: bold",
        err.message
      );
    }

    if (err?.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("isAdmin");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

// ========== Auth ==========
export const authRegister = (body) => {
  console.log("[API CALL] authRegister", body);
  return API.post("/auth/register", body).then(r => r.data);
};

export const authLogin = (body) => {
  console.log("[API CALL] authLogin", body);
  return API.post("/auth/login", body).then(r => r.data);
};

export const forgotPassword = (body) => {
  console.log("[API CALL] forgotPassword", body);
  return API.post("/auth/forgot-password", body).then(r => r.data);
};

export const resetPassword = (token, body) => {
  console.log("[API CALL] resetPassword", { token, body });
  return API.put(`/auth/reset-password/${token}`, body).then(r => r.data);
};

// ========== Courses ==========
export const getCourses = () => {
  console.log("[API CALL] getCourses");
  return API.get("/courses").then(r => r.data);
};

export const getCourseBySlug = (slug) => {
  console.log("[API CALL] getCourseBySlug", slug);
  return API.get(`/courses/slug/${slug}`).then(r => r.data);
};

export const getMyCourses = () => {
  console.log("[API CALL] getMyCourses");
  return API.get("/courses/my-courses/list").then(r => r.data);
};

export const enrollInCourse = (id) => {
  console.log("[API CALL] enrollInCourse", id);
  return API.post(`/courses/${id}/enroll`).then(r => r.data);
};

export const unenrollFromCourse = (id) => {
  console.log("[API CALL] unenrollFromCourse", id);
  return API.delete(`/courses/${id}/unenroll`).then(r => r.data);
};

// ========== Profile (User) ==========
export const getMyProfile = () => {
  console.log("[API CALL] getMyProfile");
  return API.get("/users/profile").then(r => r.data);
};

export const updateUserProfile = (body) => {
  console.log("[API CALL] updateUserProfile", body);
  return API.put("/users/profile", body).then(r => r.data);
};

export const deleteMyAccount = () => {
  console.log("[API CALL] deleteMyAccount");
  return API.delete("/users/me").then(r => r.data);
};

// ========== Admin ==========
export const getAdminUsers = () => {
  console.log("[API CALL] getAdminUsers");
  return API.get("/admin/users").then(r => r.data);
};

export const adminUpdateUser = (id, body) => {
  console.log("[API CALL] adminUpdateUser", { id, body });
  return API.put(`/admin/users/${id}`, body).then(r => r.data);
};

export const adminDeleteUser = (id) => {
  console.log("[API CALL] adminDeleteUser", id);
  return API.delete(`/admin/users/${id}`).then(r => r.data);
};

export const adminCreateCourse = (course) => {
  console.log("[API CALL] adminCreateCourse", course);
  return API.post("/admin/courses", course).then(r => r.data);
};

export const adminUpdateCourse = (id, body) => {
  console.log("[API CALL] adminUpdateCourse", { id, body });
  return API.put(`/admin/courses/${id}`, body).then(r => r.data);
};

export const adminDeleteCourse = (id) => {
  console.log("[API CALL] adminDeleteCourse", id);
  return API.delete(`/admin/courses/${id}`).then(r => r.data);
};

export const getAllEnrollments = () => {
  console.log("[API CALL] getAllEnrollments");
  return API.get("/admin/courses/enrollments").then(r => r.data);
};

export const getAdminAnalytics = () => {
  console.log("[API CALL] getAdminAnalytics");
  return API.get("/admin/courses/analytics").then(r => r.data);
};

export default API;
