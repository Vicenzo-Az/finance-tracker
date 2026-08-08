import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response?.status === 401 &&
      !window.location.pathname.includes("/landing") &&
      !window.location.pathname.includes("/login") &&
      !window.location.pathname.includes("/register") &&
      !window.location.pathname.includes("/forgot-password") &&
      !window.location.pathname.includes("/reset-password")
    ) {
      window.location.href = "/landing";
    }
    return Promise.reject(error);
  },
);

export default api;
