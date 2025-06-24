import axios from "axios";

// Create main Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/",
});

// ─── Request Interceptor ───────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    const authFreeEndpoints = [
      "auth/login/",
      "auth/register/",
      "auth/token/refresh/",
    ];

    const isAuthFree = authFreeEndpoints.some((endpoint) =>
      config.url?.endsWith(endpoint)
    );

    if (token && !isAuthFree) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor for Token Refresh ─────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
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
            `${import.meta.env.VITE_API_BASE_URL}auth/token/refresh/`,
            { refresh: refreshToken }
          );

          const { access } = res.data;
          localStorage.setItem("access", access);

          originalRequest.headers.Authorization = `Bearer ${access}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
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

// ─── Exports ───────────────────────────────────────────
export default axiosInstance;
