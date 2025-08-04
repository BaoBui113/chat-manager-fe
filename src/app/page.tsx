"use client";

import type React from "react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ListFriends from "@/components/user/listFriends";
import MessageFriend from "@/components/user/messageFriend";
import { useAuth } from "@/contexts/AuthContext";
import { useMessages, useUserWithLastMessage } from "@/hooks/useUser";
import { UserWithLastMessage } from "@/types/auth";
import { MoreVertical, Phone, Search, Send, Video } from "lucide-react";
import { useEffect, useState } from "react";

export default function ChatApp() {
  const { data: userWithLastMessage, isPending } = useUserWithLastMessage();
  const { user } = useAuth();
  const [selectedFriend, setSelectedFriend] =
    useState<UserWithLastMessage | null>(null);
  const { data: messages, isPending: isMessagesPending } = useMessages(
    selectedFriend ? selectedFriend.id : ""
  );
  console.log("messages", messages);

  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedFriend) {
      // Thêm tin nhắn mới (trong thực tế sẽ gửi lên server)
      console.log("Gửi tin nhắn:", newMessage);
      setNewMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  useEffect(() => {
    if (userWithLastMessage && userWithLastMessage.length > 0) {
      setSelectedFriend(userWithLastMessage[0]);
    }
  }, []);

  return (
    <ProtectedRoute>
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar - Danh sách bạn bè */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h1 className="text-xl font-semibold text-gray-800 mb-3">
              Tin nhắn
            </h1>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Tìm kiếm bạn bè..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Danh sách bạn bè */}
          {isPending ? (
            <div className="min-h-screen flex items-center justify-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
            </div>
          ) : (
            <>
              {userWithLastMessage && userWithLastMessage.length > 0 ? (
                <ListFriends
                  friends={userWithLastMessage}
                  setSelectedFriend={setSelectedFriend}
                  selectedFriend={selectedFriend}
                />
              ) : (
                <div>No friends found</div>
              )}
            </>
          )}
        </div>

        {/* Khu vực chat chính */}
        <div className="flex-1 flex flex-col">
          {selectedFriend ? (
            <>
              {/* Header chat */}
              <div className="bg-white border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center">
                  <div className="relative">
                    <Avatar className="h-10 w-10">
                      <AvatarImage
                        src={selectedFriend.avatar || "/placeholder.svg"}
                        alt={selectedFriend.username}
                      />
                      <AvatarFallback>
                        {selectedFriend.username.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {/* {selectedFriend.isOnline && (
								<div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
								)} */}
                  </div>
                  <div className="ml-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedFriend.username}
                    </h2>
                    {/* <p className="text-sm text-gray-500">
                      {selectedFriend.isOnline
                        ? "Đang hoạt động"
                        : "Không hoạt động"}
                    </p> */}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="ghost" size="icon">
                    <Phone className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Video className="h-5 w-5" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              {/* Khu vực tin nhắn */}
              <ScrollArea className="flex-1 p-4">
                {isMessagesPending ? (
                  <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
                  </div>
                ) : (
                  <MessageFriend messages={messages || []} user={user} />
                )}
              </ScrollArea>

              {/* Khu vực nhập tin nhắn */}
              <div className="bg-white border-t border-gray-200 p-4">
                <div className="flex items-center space-x-2">
                  <Input
                    placeholder="Nhập tin nhắn..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    className="flex-1"
                  />
                  <Button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim()}
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <div className="text-gray-400 mb-4">
                  <svg
                    className="mx-auto h-12 w-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Chọn một cuộc trò chuyện
                </h3>
                <p className="text-gray-500">
                  Chọn bạn bè từ danh sách để bắt đầu trò chuyện
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
}
