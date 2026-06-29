// src/utils/api.js

import axios from "axios";
import { loadAuthFromStorage } from "./auth-storage";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/admin/v1";

//  token helper
const getToken = () => {
  if (typeof window === "undefined") return null;
  return loadAuthFromStorage()?.accessToken || null;
};

const removeToken = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("token");
};

//  Axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// =========================
//  REQUEST INTERCEPTOR
// =========================
api.interceptors.request.use((config) => {
  const token = getToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // handle FormData
  if (config.data instanceof FormData) {
    delete config.headers["Content-Type"];
  } else {
    config.headers["Content-Type"] = "application/json";
  }

  return config;
});

// =========================
//  RESPONSE INTERCEPTOR
// =========================
api.interceptors.response.use(
  (res) => res.data?.data ?? res.data,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      removeToken();
      window.location.href = "/login";
    }

    return Promise.reject({
      message: error?.response?.data?.message || error.message,
      status,
    });
  },
);

export default api;
