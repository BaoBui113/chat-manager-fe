import { useAuth } from "@/contexts/AuthContext";
import { authService } from "@/services/authService";
import { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { checkAuth } = useAuth();
  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: async (data: AuthResponse) => {
      localStorage.setItem("access_token", data.access_token);

      await checkAuth();
      queryClient.setQueryData(["user"], data.user);
      toast.success("Login successful!");
      router.push("/");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message || "An error occurred during login");
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { checkAuth } = useAuth();
  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: async (data: AuthResponse) => {
      localStorage.setItem("access_token", data.access_token);
      await checkAuth();

      queryClient.setQueryData(["user"], data.user);
      toast.success("Registration successful!");
      router.push("/dashboard");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
    },
  });
};

export const useProfile = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: authService.getProfile,
    enabled: !!localStorage.getItem("access_token"),
    retry: false,
  });
};

export const useLogout = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => Promise.resolve(authService.logout()),
    onSuccess: () => {
      queryClient.clear();
      toast.success("Logged out successfully!");
      router.push("/login");
    },
  });
};
