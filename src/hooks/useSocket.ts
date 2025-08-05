"use client";
import { useEffect, useRef } from "react";

import { QueryKey, useQueryClient } from "@tanstack/react-query";
import io from "socket.io-client";

interface UseSocketProps {
  url: string;
  query?: Record<string, string>;
  invalidateKeys?: QueryKey[];
}

export default function useSocket({
  url,
  query,
  invalidateKeys = [],
}: UseSocketProps) {
  const queryClient = useQueryClient();
  const socketRef = useRef<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    const userId = query?.userId;
    const receiverId = query?.receiverId;
    if (!userId) return;

    // Disconnect socket cũ nếu có
    if (socketRef.current) {
      socketRef.current.disconnect();
    }

    const socket = io(url, { query });
    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("✅ Connected:", socket.id);
    });

    socket.on("chat", () => {
      // Invalidate các query liên quan
      invalidateKeys.forEach((key) => {
        queryClient.invalidateQueries({ queryKey: key });
      });
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [url, query?.userId, query?.receiverId]); // Thêm receiverId vào dependencies

  return socketRef.current;
}
