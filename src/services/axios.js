import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Interceptor global para inyectar CSRF automáticamente
api.interceptors.request.use((config) => {
  const token = decodeURIComponent(
    document.cookie
      .split("; ")
      .find((row) => row.startsWith("XSRF-TOKEN="))
      ?.split("=")[1] || ""
  );

  if (token) {
    config.headers["X-XSRF-TOKEN"] = token;
  }

  return config;
});

export default api;