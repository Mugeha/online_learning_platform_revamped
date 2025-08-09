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

export const authRegister = (body) => request("/auth/register", { method: "POST", body: JSON.stringify(body) });
export const authLogin = (body) => request("/auth/login", { method: "POST", body: JSON.stringify(body) });
export const forgotPassword = (body) => request("/auth/forgot-password", { method: "POST", body: JSON.stringify(body) });
export const resetPassword = (token, body) => request(`/auth/reset-password/${token}`, { method: "PUT", body: JSON.stringify(body) });
