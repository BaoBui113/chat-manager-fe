import { UserWithLastMessage } from "@/types/auth";
import { Messages } from "@/types/messages";
import api from "./api";

export const userService = {
  getUserWithLastMessage: async (): Promise<UserWithLastMessage[]> => {
    const response = await api.get("/users/last-messages");
    return response.data;
  },

  getMessages: async (senderId: string): Promise<Messages[]> => {
    const response = await api.get(`/messages/conversation/${senderId}`);
    return response.data;
  },
  sendMessage: (receiverId: string, content: string) => {
    return api.post(`/messages`, { receiverId, content });
  },
};
