import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

import type { IUser } from "@/types";
import axiosInstance from "@/lib/axios/axiosInstance";

export const INITIAL_USER: IUser = {
  id: "",
  name: "",
  username: "",
  email: "",
  image: "",
  bio: "",
};

const INITIAL_STATE = {
  user: INITIAL_USER,
  isLoading: false,
  isAuthenticated: false,
  setUser: () => {},
  setIsAuthenticated: () => {},
  checkAuthUser: async () => false as boolean,
  login: (_a: string, _r: string) => {},
  logout: () => {},
};

type IContextType = {
  user: IUser;
  isLoading: boolean;
  setUser: React.Dispatch<React.SetStateAction<IUser>>;
  isAuthenticated: boolean;
  setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
  checkAuthUser: () => Promise<boolean>;
  login: (access: string, refresh: string) => void;
  logout: () => void;
};

const AuthContext = createContext<IContextType>(INITIAL_STATE);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();

  const [user, setUser] = useState<IUser>(INITIAL_USER);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (access: string, refresh: string) => {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    setIsAuthenticated(true);
    await checkAuthUser(); // fetch and set user data
  };

  const logout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    setIsAuthenticated(false);
    setUser(INITIAL_USER);
    navigate("/sign-in");
  };

  const checkAuthUser = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("access");

      if (!token) {
        console.warn("No access token found.");
        return false;
      }

      // Verify token
      await axiosInstance.post("auth/token/verify/", { token });

      // Get profile (adjust key names if needed based on your backend)
      const res = await axiosInstance.get("auth/profile/");
      const userData = res.data;
      console.log("userData:", userData);

    setUser({
      id: userData.id,
      name: userData.name,
      username: userData.username,
      email: userData.email,
      image: userData.image ? `http://localhost:8000${userData.image}` : "",
      bio: userData.bio || "",
    });

    // Save userId to localStorage for global usage
    localStorage.setItem("userId", String(userData.id));



      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error("Auth check failed:", err);
      setIsAuthenticated(false);
      setUser(INITIAL_USER);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkAuthUser();
  }, []);

  const value = {
    user,
    setUser,
    isLoading,
    isAuthenticated,
    setIsAuthenticated,
    checkAuthUser,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useUserContext = () => useContext(AuthContext);
