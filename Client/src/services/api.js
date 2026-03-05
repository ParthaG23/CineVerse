import axios from "axios";

/* ENV SAFETY CHECK */

const BASE_URL = import.meta.env.VITE_TMDB_BASE_URL;
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

if (!BASE_URL || !API_KEY) {
  console.error("Missing TMDB environment variables");
}

/* AXIOS INSTANCE */

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 8000,
  params: {
    api_key: API_KEY,
  },
});

/* REQUEST INTERCEPTOR (future auth support) */

api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

/* RESPONSE INTERCEPTOR */

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.code === "ECONNABORTED") {
      console.error("Request timeout");
    } else if (error.response) {
      console.error(
        "API Error:",
        error.response.status,
        error.response.data
      );
    } else {
      console.error("Network Error:", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;