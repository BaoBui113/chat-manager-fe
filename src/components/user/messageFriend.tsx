"use client";
import { Messages } from "@/types/messages";

export default function MessageFriend({
  messages,
  user,
}: {
  messages: Messages[];
  user: { email: string } | null;
}) {
  return (
    <div className="space-y-4">
      {messages?.map((message) => {
        const isOwn = message.sender.email === user?.email;
        const timestamp = new Date(message.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        return (
          <div
            key={message.id}
            className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
          >
            <div
              className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                isOwn
                  ? "bg-blue-500 text-white"
                  : "bg-white border border-gray-200 text-gray-900"
              }`}
            >
              <p className="text-sm">{message.content}</p>
              <p
                className={`text-xs mt-1 ${
                  isOwn ? "text-blue-100" : "text-gray-500"
                }`}
              >
                {timestamp}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
