import axios from "axios";
import type { AxiosRequestConfig } from "axios";

const baseURL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/";

// Create main Axios instance
const axiosInstance = axios.create({
  baseURL,
});

// Request interceptor: Attach Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    // ✅ Match your current Django routes (no "auth/" prefix anymore)
    const authFreeEndpoints = [
      "login/",
      "register/",
      "token/refresh/",
    ];

    const urlPath = (config.url || "").replace(/^\/+/, "");

    const isAuthFree = authFreeEndpoints.some((endpoint) =>
      urlPath.endsWith(endpoint)
    );

    if (token && !isAuthFree) {
      config.headers = config.headers ?? {};
      (config.headers as Record<string, string>)["Authorization"] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Auto-refresh token on 401
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean;
    };

    const isRefreshEndpoint =
      originalRequest.url?.includes("token/refresh/");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isRefreshEndpoint
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refresh");

      if (refreshToken) {
        try {
          const refreshUrl = `${baseURL.replace(/\/+$/, "")}/token/refresh/`;
          const res = await axios.post(refreshUrl, { refresh: refreshToken });

          const { access } = res.data;
          localStorage.setItem("access", access);

          originalRequest.headers = originalRequest.headers ?? {};
          (originalRequest.headers as Record<string, string>)["Authorization"] = `Bearer ${access}`;

          return axiosInstance(originalRequest);
        } catch (refreshError) {
          localStorage.removeItem("access");
          localStorage.removeItem("refresh");
          window.location.href = "/sign-in"; // Redirect to login
          return Promise.reject(refreshError);
        }
      }
    }

    return Promise.reject(error);
  }
);

// ─── Optional Utility: Delete Post ─────────────────────
export const deletePost = async (id: string | number): Promise<void> => {
  await axiosInstance.delete(`/posts/${id}/delete/`);
};

// ─── Export Axios Instance ─────────────────────────────
export default axiosInstance;
