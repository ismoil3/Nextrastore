"use client";
import {apiUrl} from "../config/config.ts"
import axios from "axios";

const axiosRequest = axios.create({
  baseURL: apiUrl,
});

axiosRequest.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
  }
  return config;
});

// Interceptor барои коркарди хатогиҳои ҷавоб
axiosRequest.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined" && error.response?.status === 401) {
      console.log("Unauthorized, redirecting to login...");
      localStorage.removeItem("access_token");
      window.location.href = "/login"; 
    }
    return Promise.reject(error);
  }
);

export default axiosRequest;
