import axios from "axios";
import type { AxiosRequestConfig } from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/";

// Create main Axios instance
const axiosInstance = axios.create({
  baseURL,
});

// ─── Request Interceptor ───────────────────────────────
import type { InternalAxiosRequestConfig } from "axios";

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("access");

    const authFreeEndpoints = [
      "auth/login/",
      "auth/register/",
      "auth/token/refresh/",
    ];

    // Normalize url path without leading slash for matching
    const urlPath = config.url?.startsWith("/") ? config.url.slice(1) : config.url;

    const isAuthFree = authFreeEndpoints.some((endpoint) =>
      urlPath?.endsWith(endpoint)
    );

    if (token && !isAuthFree) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor for Token Refresh ─────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    const isRefreshEndpoint = originalRequest.url?.includes("auth/token/refresh/");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshEndpoint
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh");

      if (refreshToken) {
        try {
          const res = await axios.post(
            `${baseURL}auth/token/refresh/`,
            { refresh: refreshToken }
          );

          const { access } = res.data;
          localStorage.setItem("access", access);

          // Ensure headers exist
          originalRequest.headers = originalRequest.headers ?? {};
          // Update Authorization header with new access token
          (originalRequest.headers as Record<string, string>)["Authorization"] = `Bearer ${access}`;

          // Retry the original request with new token
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Token refresh failed - clear tokens and redirect to login
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.href = "/sign-in";
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

// ─── Utility Function: Delete Post ─────────────────────
export const deletePost = async (id: string | number): Promise<void> => {
  await axiosInstance.delete(`/posts/${id}/delete/`);
};

// ─── Export Axios Instance ─────────────────────────────
export default axiosInstance;
