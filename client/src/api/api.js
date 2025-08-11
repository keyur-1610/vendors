// File: /client/src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://vendors-0uvu.onrender.com/api",
});

// Automatically attach token to requests if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
