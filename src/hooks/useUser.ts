"use client";
import { userService } from "@/services/userService";
import { UserWithLastMessage } from "@/types/auth";
import { useQuery } from "@tanstack/react-query";

export const useUserWithLastMessage = () => {
  return useQuery<UserWithLastMessage[]>({
    queryKey: ["userWithLastMessage"],
    queryFn: userService.getUserWithLastMessage,
    // enabled: !!localStorage.getItem("access_token"),
    retry: false,
  });
};

export const useMessages = (userId: string) => {
  return useQuery({
    queryKey: ["messages", userId],
    queryFn: () => userService.getMessages(userId),
    enabled: !!userId,
    retry: false,
  });
};
