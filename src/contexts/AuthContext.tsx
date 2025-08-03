"use client";
import { authService } from "@/services/authService";
import { User } from "@/types/auth";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  console.log("user", user);

  const isAuthenticated = !!user;
  const router = useRouter();
  const checkAuth = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return false;
      }
      // Verify token với API
      const userProfile = await authService.getProfile();
      setUser(userProfile);
      setIsLoading(false);
      return true;
    } catch (error: any) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("access_token");
      }

      setUser(null);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem("access_token");
    setUser(null);
    setIsLoading(false);
    router.push("/login");
  };

  useEffect(() => {
    checkAuth();
  }, []);
  const value = {
    user,
    isLoading,
    isAuthenticated,
    logout,
    checkAuth,
  };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
