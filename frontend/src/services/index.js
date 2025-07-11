import axios from "axios";

const API = axios.create({
  baseURL:
    process.env.REACT_APP_API_URL ||
    "https://hospital-erp-9w6z.onrender.com/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// Request interceptor for auth tokens
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = `/login?redirect=${encodeURIComponent(
        window.location.pathname
      )}`;
    }
    return Promise.reject(error?.response?.data || error);
  }
);

export default API;
