import { useNavigate } from "react-router-dom";
import { createContext, useContext, useEffect, useState } from "react";

import type { IUser } from "@/types";
import axiosInstance from "@/lib/axios/axiosInstance";

export const INITIAL_USER: IUser = {
  id: "",
  name: "",
  username: "",
  email: "",
  imageUrl: "",
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

  const login = (access: string, refresh: string) => {
    localStorage.setItem("access", access);
    localStorage.setItem("refresh", refresh);
    setIsAuthenticated(true);
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
      if (!token) throw new Error("No token");

      // Verify token
      await axiosInstance.post("token/verify/", { token });

      // Optionally fetch user profile here (assuming you have an endpoint)
      const res = await axiosInstance.get("profile/");
      const userData = res.data;

      setUser({
        id: userData.id,
        name: userData.name,
        username: userData.username,
        email: userData.email,
        imageUrl: userData.imageUrl || "",
        bio: userData.bio || "",
      });

      setIsAuthenticated(true);
      return true;
    } catch (err) {
      console.error("Auth check failed:", err);
      logout(); // force logout if verification fails
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
