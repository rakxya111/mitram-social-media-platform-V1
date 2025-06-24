import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

import type { IUser } from "@/types";
import axiosInstance from "@/lib/axios/axiosInstance";

export const INITIAL_USER: IUser = {
  id: 0,
  name: "",
  username: "",
  email: "",
  image: "",
  bio: "",
  posts: [],
  followers: [],
  following: [],
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
  login: (access: string, refresh: string) => Promise<void>;
  loginWithCredentials: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const INITIAL_STATE: IContextType = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false,
  login: async () => {},
  loginWithCredentials: async () => {},
  logout: () => {},
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasInitialCheck, setHasInitialCheck] = useState(false);

  console.log("AuthProvider render - isAuthenticated:", isAuthenticated, "isLoading:", isLoading);

  const getImageUrl = (imagePath: string) => {
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL?.replace(/\/api\/?$/, "") ||
      "http://localhost:8000";
    return `${baseUrl}${imagePath.startsWith("/") ? "" : "/"}${imagePath}`;
  };

  // Helper to check if URL is full (Cloudinary or any full URL)
  const isFullUrl = (url: string) => url.startsWith("http://") || url.startsWith("https://");

  const checkAuthUser = async (): Promise<boolean> => {
    console.log("checkAuthUser called");

    try {
      const token = localStorage.getItem("access");
      console.log("checkAuthUser token:", token);

      if (!token) {
        console.log("No token found, setting user as unauthenticated");
        setUser(INITIAL_USER);
        setIsAuthenticated(false);
        setIsLoading(false);
        return false;
      }

      // Verify token first
      await axiosInstance.post("auth/token/verify/", { token });

      // Get user data
      const res = await axiosInstance.get("auth/user/");
      console.log("User data received:", res.data);

      const userData = {
        id: Number(res.data.id),
        name: res.data.name,
        username: res.data.username,
        email: res.data.email,
        image: res.data.image
          ? (isFullUrl(res.data.image) ? res.data.image : getImageUrl(res.data.image))
          : "",
        bio: res.data.bio || "",
        posts: res.data.posts || [],
        followers: res.data.followers || [],
        following: res.data.following || [],
      };

      console.log("Setting user and authenticated state to true");
      setUser(userData);
      setIsAuthenticated(true);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("❌ Auth check failed:", error);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setUser(INITIAL_USER);
      setIsAuthenticated(false);
      setIsLoading(false);
      return false;
    }
  };

  const login = async (access: string, refresh: string): Promise<void> => {
    try {
      console.log("Starting login process...");
      setIsLoading(true);

      // Store tokens
      localStorage.setItem("access", access);
      localStorage.setItem("refresh", refresh);

      // Check auth and get user data
      const isValid = await checkAuthUser();

      console.log("Login completed, isAuthenticated:", isValid);

      if (!isValid) {
        throw new Error("Failed to authenticate after login");
      }

      console.log("Login successful - auth state updated");
    } catch (error) {
      console.error("Login failed:", error);
      localStorage.removeItem("access");
      localStorage.removeItem("refresh");
      setUser(INITIAL_USER);
      setIsAuthenticated(false);
      setIsLoading(false);
      throw error;
    }
  };

  // Alternative login method that handles the full login flow
  const loginWithCredentials = async (email: string, password: string): Promise<void> => {
    try {
      console.log("🔐 Starting full login process...");
      setIsLoading(true);

      // Call login API
      const response = await axiosInstance.post("auth/login/", { email, password });
      console.log("✅ Login API response received");

      // Extract tokens
      const { access, refresh } = response.data.tokens;

      // Store tokens and update auth state
      await login(access, refresh);

      console.log("✅ Full login process completed");
    } catch (error) {
      console.error("❌ Full login failed:", error);
      throw error;
    }
  };

  const logout = (): void => {
    console.log("Logout called");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(INITIAL_USER);
    setIsAuthenticated(false);
    setIsLoading(false);
    navigate("/sign-in", { replace: true });
  };

  // Initial auth check on app load only
  useEffect(() => {
    console.log("useEffect triggered - hasInitialCheck:", hasInitialCheck);
    if (!hasInitialCheck) {
      console.log("Running initial auth check...");
      setHasInitialCheck(true);
      checkAuthUser();
    }
  }, [hasInitialCheck]);

  // Handle navigation after authentication state changes
  useEffect(() => {
    console.log("Navigation useEffect - hasInitialCheck:", hasInitialCheck, "isAuthenticated:", isAuthenticated, "isLoading:", isLoading);

    // Only navigate after initial check is complete
    if (hasInitialCheck && !isLoading) {
      const currentPath = window.location.pathname;
      console.log("Current path:", currentPath);

      if (isAuthenticated) {
        // If user is authenticated and on auth pages, redirect to home
        if (currentPath === "/sign-in" || currentPath === "/sign-up") {
          console.log("User authenticated, navigating from auth page to home");
          navigate("/", { replace: true });
        }
      } else {
        // If user is not authenticated and trying to access protected routes
        if (currentPath !== "/sign-in" && currentPath !== "/sign-up") {
          console.log("User not authenticated, redirecting to sign-in");
          navigate("/sign-in", { replace: true });
        }
      }
    }
  }, [isAuthenticated, isLoading, hasInitialCheck, navigate]);

  const value: IContextType = {
    user,
    isLoading,
    isAuthenticated,
    setUser,
    setIsAuthenticated,
    checkAuthUser,
    login,
    loginWithCredentials,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
