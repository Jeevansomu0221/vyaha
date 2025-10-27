// src/api/axios.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:7000/api",  // ← Already includes /api
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers ?? {};
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;