"use client";

import type React from "react";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import ListFriends from "@/components/user/listFriends";
import MessageFriend from "@/components/user/messageFriend";
import SendMessage from "@/components/user/sendMesasage";
import { useAuth } from "@/contexts/AuthContext";
import { CallProvider, useCallContext } from "@/contexts/CallContext";
import useSocket from "@/hooks/useSocket";
import {
  useMessages,
  useSendMessage,
  useUserWithLastMessage,
} from "@/hooks/useUser";
import { UserWithLastMessage } from "@/types/auth";
import { QueryKey } from "@tanstack/react-query";
import { MoreVertical, Phone, Search, Video } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { CallNotification } from "@/components/CallNotification";

export function createChatQueryKey(userId1: string, userId2: string): QueryKey {
  const sortedIds = [userId1, userId2].sort(); // đảm bảo key ổn định
  return ["messages", sortedIds[0], sortedIds[1]];
}

// Component cho call controls
const CallButtons: React.FC<{ selectedFriend: UserWithLastMessage | null }> = ({ selectedFriend }) => {
  const { initiateCall, isCalling, isRinging, callState, currentCall, acceptCall, rejectCall, endCall, toggleMute, toggleVideo } = useCallContext();

  const handleVoiceCall = () => {
    if (selectedFriend) {
      initiateCall(selectedFriend.id, 'voice');
    }
  };

  const handleVideoCall = () => {
    if (selectedFriend) {
      initiateCall(selectedFriend.id, 'video');
    }
  };

  // Incoming call notification
  if (isRinging && currentCall) {
    return (
      <CallNotification
        call={currentCall}
        callerName={selectedFriend?.username || 'Unknown'}
        onAccept={acceptCall}
        onReject={rejectCall}
      />
    );
  }

  // Active call modal
  if (callState.isInCall && currentCall) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <div className="relative w-full h-full max-w-4xl max-h-[80vh]">
          {/* Remote Video */}
          {callState.remoteStream && (
            <video
              ref={(video) => {
                if (video && callState.remoteStream) {
                  video.srcObject = callState.remoteStream;
                }
              }}
              autoPlay
              playsInline
              className="w-full h-full object-cover rounded-lg"
            />
          )}

          {/* Local Video */}
          {callState.localStream && currentCall.type === 'video' && (
            <div className="absolute top-4 right-4 w-48 h-36">
              <video
                ref={(video) => {
                  if (video && callState.localStream) {
                    video.srcObject = callState.localStream;
                  }
                }}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
          )}

          {/* Call Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-4">
            <button
              onClick={toggleMute}
              className={`p-3 rounded-full ${
                callState.isMuted ? 'bg-red-500' : 'bg-gray-600'
              } text-white hover:opacity-80 transition-colors`}
              title={callState.isMuted ? 'Unmute' : 'Mute'}
            >
              {callState.isMuted ? '🔇' : '🎤'}
            </button>
            {currentCall.type === 'video' && (
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full ${
                  callState.isVideoEnabled ? 'bg-gray-600' : 'bg-red-500'
                } text-white hover:opacity-80 transition-colors`}
                title={callState.isVideoEnabled ? 'Turn off video' : 'Turn on video'}
              >
                {callState.isVideoEnabled ? '📹' : '🚫'}
              </button>
            )}
            <button
              onClick={endCall}
              className="bg-red-500 p-3 rounded-full text-white hover:bg-red-600 transition-colors"
              title="End call"
            >
              📞
            </button>
          </div>

          {/* Call Info */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
            <div className="font-semibold">
              {currentCall.type === 'video' ? 'Video Call' : 'Voice Call'}
            </div>
            <div className="text-sm opacity-75">
              {selectedFriend?.username || 'Unknown'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calling modal
  if (isCalling && currentCall) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">Đang gọi...</div>
            <div className="text-gray-600 mb-4">
              {currentCall.type === 'video' ? 'Video Call' : 'Voice Call'} đến{' '}
              {selectedFriend?.username || 'Unknown'}
            </div>
            <div className="animate-pulse">
              <div className="text-4xl mb-4">📞</div>
            </div>
            <button
              onClick={endCall}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center space-x-2">
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleVoiceCall}
        disabled={!selectedFriend}
        title="Voice Call"
        className="hover:bg-green-100 hover:text-green-600"
      >
        <Phone className="h-5 w-5" />
      </Button>
      <Button 
        variant="ghost" 
        size="icon"
        onClick={handleVideoCall}
        disabled={!selectedFriend}
        title="Video Call"
        className="hover:bg-blue-100 hover:text-blue-600"
      >
        <Video className="h-5 w-5" />
      </Button>
      <Button variant="ghost" size="icon">
        <MoreVertical className="h-5 w-5" />
      </Button>
    </div>
  );
};

// Main chat component
function ChatAppContent() {
  const { data: userWithLastMessage, isPending } = useUserWithLastMessage();
  const { user } = useAuth();
  const [selectedFriend, setSelectedFriend] =
    useState<UserWithLastMessage | null>(null);
  const { data: messages, isPending: isMessagesPending } = useMessages(
    selectedFriend ? selectedFriend.id : ""
  );

  const { mutate: sendMessage } = useSendMessage();

  const [newMessage, setNewMessage] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim() && selectedFriend) {
      sendMessage({
        content: newMessage,
        receiverId: selectedFriend.id,
      });
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
  }, [userWithLastMessage]);

  // Memoize query object
  const socketQuery = useMemo(
    () => ({
      userId: user?.sub || "",
      receiverId: selectedFriend?.id || "",
    }),
    [user?.sub, selectedFriend?.id]
  );

  useSocket({
    url: "http://localhost:8000",
    query: socketQuery,
    invalidateKeys: [
      createChatQueryKey(user?.sub ?? "", selectedFriend?.id ?? ""),
    ],
  });

  return (
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
              <CallButtons selectedFriend={selectedFriend} />
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
            <SendMessage
              newMessage={newMessage}
              setNewMessage={setNewMessage}
              handleSendMessage={handleSendMessage}
              handleKeyPress={handleKeyPress}
            />
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
  );
}

export default function ChatApp() {
  const { user } = useAuth();
  
  return (
    <ProtectedRoute>
      <CallProvider userId={user?.sub}>
        <ChatAppContent />
      </CallProvider>
    </ProtectedRoute>
  );
}
