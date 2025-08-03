import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api";

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Chỉ auto-logout nếu đang ở protected route
    if (error.response?.status === 401 || error.response?.status === 403) {
      const currentPath = window.location.pathname;
      const isPublicRoute = ["/login", "/register"].includes(currentPath);

      if (!isPublicRoute) {
        localStorage.removeItem("access_token");

        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
