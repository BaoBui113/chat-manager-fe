"use client";
import { createChatQueryKey } from "@/app/page";
import { useAuth } from "@/contexts/AuthContext";
import { userService } from "@/services/userService";
import { UserWithLastMessage } from "@/types/auth";
import { CreateMessageDto } from "@/types/messages";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUserWithLastMessage = () => {
  return useQuery<UserWithLastMessage[]>({
    queryKey: ["userWithLastMessage"],
    queryFn: userService.getUserWithLastMessage,
    // enabled: !!localStorage.getItem("access_token"),
    retry: false,
  });
};

export const useMessages = (senderId: string) => {
  const { user } = useAuth();

  return useQuery({
    queryKey: createChatQueryKey(user?.sub ?? "", senderId ?? ""),
    queryFn: () => userService.getMessages(senderId),
    staleTime: 0,
    enabled: !!senderId,
    retry: false,
  });
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { checkAuth } = useAuth();
  return useMutation({
    mutationFn: (data: CreateMessageDto) =>
      userService.sendMessage(data.receiverId, data.content),
    onSuccess: async () => {
      await checkAuth();
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: (error: {
      response?: {
        data?: {
          message?: string;
        };
      };
      message?: string;
    }) => {
      const message = error.response?.data?.message || "Failed to send message";
      console.error(message);
    },
  });
};
