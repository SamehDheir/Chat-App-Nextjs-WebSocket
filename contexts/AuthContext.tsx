"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import api from "../lib/api";
import socketService from "../lib/socket";

interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio?: string;
  phone?: string;
  location?: string;
  isOnline: boolean;
  lastSeen: Date;
  createdAt?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  updateProfile: (profileData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  const isAuthenticated = !!user && !!token;

  useEffect(() => {
    setMounted(true);
    // Check for stored token on mount
    if (typeof window !== "undefined") {
      const storedToken = localStorage.getItem("token");
      const storedUser = localStorage.getItem("user");

      if (storedToken && storedUser) {
        try {
          const parsedUser = JSON.parse(storedUser);
          setToken(storedToken);
          setUser(parsedUser);
          // Connect to socket
          socketService.connect(storedToken);
        } catch (error) {
          console.error("Error parsing stored user data:", error);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const response = await api.post("/auth/login", { email, password });
      const { user: userData, token: userToken } = response.data;

      setUser(userData);
      setToken(userToken);

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", userToken);
        localStorage.setItem("user", JSON.stringify(userData));
      }

      // Connect to socket
      socketService.connect(userToken);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    username: string,
    email: string,
    password: string
  ) => {
    try {
      setIsLoading(true);
      const response = await api.post("/auth/register", {
        username,
        email,
        password,
      });
      const { user: userData, token: userToken } = response.data;

      setUser(userData);
      setToken(userToken);

      // Store in localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("token", userToken);
        localStorage.setItem("user", JSON.stringify(userData));
      }

      // Connect to socket
      socketService.connect(userToken);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await api.post("/auth/logout");
        socketService.disconnect();
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      setToken(null);
      if (typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      if (typeof window !== "undefined") {
        localStorage.setItem("user", JSON.stringify(updatedUser));
      }
    }
  };

  const updateProfile = async (profileData: Partial<User>) => {
    try {
      if (!token) {
        throw new Error("No authentication token");
      }

      // TODO: Implement API call to update profile
      // const response = await api.put('/profile', profileData);

      // For now, just update locally
      updateUser(profileData);
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    updateUser,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
