"use client";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export default function ProtectedRoute({
  children,
  fallback,
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  console.log("isAuthenticated", isAuthenticated);

  const router = useRouter();
  console.log(
    "ProtectedRoute isAuthenticated:",
    isAuthenticated,
    "isLoading:",
    isLoading
  );

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated, isLoading, router]);

  // Hiển thị loading khi đang check auth
  if (isLoading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
        </div>
      )
    );
  }

  // Nếu không authenticated, không render gì (sẽ redirect)
  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}
