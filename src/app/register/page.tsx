"use client";

import PublicRoute from "@/components/auth/PublicRoute";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { registerSchema, type RegisterFormData } from "@/lib/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Eye, EyeOff, User } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      // Simulate API call

      console.log("Register data:", data);
      // Here you would typically make an API call to your backend
    } catch (err) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <PublicRoute>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <User className="h-8 w-8 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold">Đăng ký</CardTitle>
            <CardDescription>
              Tạo tài khoản mới cho Chat Manager
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="username">Tên người dùng</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Bao Bui 1"
                  {...register("username")}
                  className={errors.username ? "border-red-500" : ""}
                />
                {errors.username && (
                  <p className="text-sm text-red-500">
                    {errors.username.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="test1@gmail.com"
                  {...register("email")}
                  className={errors.email ? "border-red-500" : ""}
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Nhập mật khẩu (tối thiểu 6 ký tự)"
                    {...register("password")}
                    className={errors.password ? "border-red-500" : ""}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full mt-4"
                disabled={isLoading}
              >
                {isLoading ? "Đang đăng ký..." : "Đăng ký"}
              </Button>

              <div className="text-center text-sm text-gray-600">
                Đã có tài khoản?{" "}
                <Link
                  href="/login"
                  className="text-green-600 hover:underline font-medium"
                >
                  Đăng nhập ngay
                </Link>
              </div>
            </CardFooter>
          </form>
        </Card>
      </div>
    </PublicRoute>
  );
}
