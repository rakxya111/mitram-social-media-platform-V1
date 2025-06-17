import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access");

    // Define auth-free endpoints - these should match your actual endpoint paths
    const authFreeEndpoints = [
      "login/",           // matches your actual login endpoint
      "register/",        // matches your actual register endpoint
      "token/refresh/",   // for token refresh
    ];

    // Check if request URL matches any auth free endpoint
    const isAuthFree = authFreeEndpoints.some((endpoint) =>
      config.url?.includes(endpoint) || config.url?.endsWith(endpoint)
    );

    // Add Authorization header only if token exists and URL is NOT auth-free
    if (token && !isAuthFree) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Add response interceptor for automatic token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem("refresh");
      if (refreshToken && !originalRequest.url?.includes("login/")) {
        try {
          const response = await axiosInstance.post("token/refresh/", {
            refresh: refreshToken
          });
          
          const { access } = response.data;
          localStorage.setItem("access", access);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Refresh failed, clear tokens and redirect to login
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