import axios from "axios";

// Create main Axios instance
const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

const deletePost = async (id: string | number): Promise<void> => {
  await axiosInstance.delete(`/posts/${id}/delete-func/`);
};

export { deletePost };

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    const authFreeEndpoints = [
      "auth/login/",
      "auth/register/",
      "auth/token/refresh/",
    ];

    // Only skip auth header for login, register, refresh
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

// Response Interceptor for Token Refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    const isTokenRefreshURL =
      originalRequest.url?.includes("auth/token/refresh/");

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !isTokenRefreshURL
    ) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh");

      if (refreshToken) {
        try {
          // 🔒 Use default axios to avoid interceptor recursion
          const response = await axios.post(
            import.meta.env.VITE_API_BASE_URL + "auth/token/refresh/",
            { refresh: refreshToken }
          );

          const { access } = response.data;

          localStorage.setItem("access", access);

          // Update and retry original request
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Clear tokens and redirect to login
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

export default axiosInstance;
