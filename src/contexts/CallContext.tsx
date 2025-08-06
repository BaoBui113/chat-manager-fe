"use client";
import React, { createContext, useContext, ReactNode } from 'react';
import { useCall } from '../hooks/useCall';

interface CallContextType {
  callState: any;
  currentCall: any;
  isCalling: boolean;
  isRinging: boolean;
  initiateCall: (receiverId: string, type: 'voice' | 'video') => Promise<void>;
  acceptCall: () => Promise<void>;
  rejectCall: () => Promise<void>;
  endCall: () => Promise<void>;
  toggleMute: () => void;
  toggleVideo: () => void;
}

const CallContext = createContext<CallContextType | undefined>(undefined);

interface CallProviderProps {
  children: ReactNode;
  userId?: string;
}

export const CallProvider: React.FC<CallProviderProps> = ({ children, userId }) => {
  const callHook = useCall(userId);

  return (
    <CallContext.Provider value={callHook}>
      {children}
    </CallContext.Provider>
  );
};

export const useCallContext = () => {
  const context = useContext(CallContext);
  if (context === undefined) {
    throw new Error('useCallContext must be used within a CallProvider');
  }
  return context;
}; 