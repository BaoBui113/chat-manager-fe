"use client";

import type React from "react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreVertical, Phone, Search, Send, Video } from "lucide-react";
import { useState } from "react";

interface Friend {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface Message {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
  isOwn: boolean;
}

const mockFriends: Friend[] = [
  {
    id: "1",
    name: "Nguyễn Văn An",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    lastMessage: "Chào bạn, hôm nay thế nào?",
    lastMessageTime: "2 phút",
    unreadCount: 2,
  },
  {
    id: "2",
    name: "Trần Thị Bình",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    lastMessage: "Cảm ơn bạn nhé!",
    lastMessageTime: "5 phút",
    unreadCount: 0,
  },
  {
    id: "3",
    name: "Lê Minh Cường",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
    lastMessage: "Hẹn gặp lại sau",
    lastMessageTime: "1 giờ",
    unreadCount: 0,
  },
  {
    id: "4",
    name: "Phạm Thu Dung",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: true,
    lastMessage: "Được rồi, tôi sẽ gửi file cho bạn",
    lastMessageTime: "3 giờ",
    unreadCount: 1,
  },
  {
    id: "5",
    name: "Hoàng Văn Em",
    avatar: "/placeholder.svg?height=40&width=40",
    isOnline: false,
    lastMessage: "Chúc bạn ngủ ngon!",
    lastMessageTime: "1 ngày",
    unreadCount: 0,
  },
];

const mockMessages: { [key: string]: Message[] } = {
  "1": [
    {
      id: "1",
      senderId: "1",
      content: "Chào bạn! Hôm nay thế nào?",
      timestamp: "10:30",
      isOwn: false,
    },
    {
      id: "2",
      senderId: "me",
      content: "Chào An! Tôi khỏe, cảm ơn bạn. Còn bạn thì sao?",
      timestamp: "10:32",
      isOwn: true,
    },
    {
      id: "3",
      senderId: "1",
      content: "Tôi cũng ổn. Có dự án mới thú vị không?",
      timestamp: "10:35",
      isOwn: false,
    },
  ],
  "2": [
    {
      id: "1",
      senderId: "me",
      content: "File đã gửi xong rồi nhé!",
      timestamp: "09:15",
      isOwn: true,
    },
    {
      id: "2",
      senderId: "2",
      content: "Cảm ơn bạn nhé! Tôi sẽ xem ngay.",
      timestamp: "09:20",
      isOwn: false,
    },
  ],
};

export default function ChatApp() {
  const [selectedFriend, setSelectedFriend] = useState<Friend | null>(
    mockFriends[0]
  );
  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFriends = mockFriends.filter((friend) =>
    friend.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
          <ScrollArea className="flex-1">
            <div className="p-2">
              {filteredFriends.map((friend) => (
                <div
                  key={friend.id}
                  onClick={() => setSelectedFriend(friend)}
                  className={`flex items-center p-3 rounded-lg cursor-pointer transition-colors ${
                    selectedFriend?.id === friend.id
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-50"
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12">
                      <AvatarImage
                        src={friend.avatar || "/placeholder.svg"}
                        alt={friend.name}
                      />
                      <AvatarFallback>{friend.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    {friend.isOnline && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {friend.name}
                      </p>
                      <span className="text-xs text-gray-500">
                        {friend.lastMessageTime}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-sm text-gray-500 truncate">
                        {friend.lastMessage}
                      </p>
                      {friend.unreadCount > 0 && (
                        <Badge
                          variant="destructive"
                          className="h-5 w-5 p-0 flex items-center justify-center text-xs"
                        >
                          {friend.unreadCount}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
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
                        alt={selectedFriend.name}
                      />
                      <AvatarFallback>
                        {selectedFriend.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {selectedFriend.isOnline && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div className="ml-3">
                    <h2 className="text-lg font-semibold text-gray-900">
                      {selectedFriend.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {selectedFriend.isOnline
                        ? "Đang hoạt động"
                        : "Không hoạt động"}
                    </p>
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
                <div className="space-y-4">
                  {mockMessages[selectedFriend.id]?.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.isOwn ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          message.isOwn
                            ? "bg-blue-500 text-white"
                            : "bg-white border border-gray-200 text-gray-900"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.isOwn ? "text-blue-100" : "text-gray-500"
                          }`}
                        >
                          {message.timestamp}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
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
