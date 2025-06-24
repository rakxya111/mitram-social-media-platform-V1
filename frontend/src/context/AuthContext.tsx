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
  logout: () => {},
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getImageUrl = (imagePath: string) => {
    const baseUrl =
      import.meta.env.VITE_API_BASE_URL?.replace("/api/", "") ||
      "http://localhost:8000";
    return `${baseUrl}${imagePath}`;
  };

  const checkAuthUser = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access");
      if (!token) throw new Error("No token found");

      // Verify token validity
      await axiosInstance.post("auth/token/verify/", { token });

      // Fetch user profile (use consistent endpoint from your backend)
      const res = await axiosInstance.get("auth/user/");
      const userData = res.data;

      setUser({
        id: Number(userData.id),
        name: userData.name,
        username: userData.username,
        email: userData.email,
        image: userData.image ? getImageUrl(userData.image) : "",
        bio: userData.bio || "",
        posts: userData.posts || [],
        followers: userData.followers || [],
        following: userData.following || [],
      });

      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("❌ Auth check failed:", error);
      setUser(INITIAL_USER);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (access: string, refresh: string): Promise<void> => {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);

    const isValid = await checkAuthUser();
    setIsAuthenticated(isValid);
  };

  const logout = (): void => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setUser(INITIAL_USER);
    setIsAuthenticated(false);
    navigate("/sign-in");
  };

  useEffect(() => {
    checkAuthUser();
  }, []);

  const value: IContextType = {
    user,
    isLoading,
    isAuthenticated,
    setUser,
    setIsAuthenticated,
    checkAuthUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
