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

const INITIAL_STATE = {
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

  // Check if access token is valid and fetch user profile
  const checkAuthUser = async (): Promise<boolean> => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access");
      if (!token) {
        setIsAuthenticated(false);
        setUser(INITIAL_USER);
        return false;
      }

      // Verify token validity
      await axiosInstance.post("auth/token/verify/", { token });

      // Fetch user profile
      const res = await axiosInstance.get("auth/profile/");
      const userData = res.data;

      setUser({
        id: Number(userData.id),
        name: userData.name,
        username: userData.username,
        email: userData.email,
        image: userData.image ? `http://localhost:8000${userData.image}` : "",
        bio: userData.bio || "",
        posts: userData.posts || [],
        followers: userData.followers || [],
        following: userData.following || [],
      });

      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error("Auth check failed:", error);
      setIsAuthenticated(false);
      setUser(INITIAL_USER);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Login: store tokens, then validate user & set state
  const login = async (access: string, refresh: string): Promise<void> => {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);

    const success = await checkAuthUser();
    if (success) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  };

  // Logout: clear tokens and user info, redirect to sign-in page
  const logout = (): void => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    navigate("/sign-in");
  };

  // On mount, check if user is authenticated
  useEffect(() => {
    checkAuthUser();
  }, []);

  const value = {
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
