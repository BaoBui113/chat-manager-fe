"use client";
import React, { useEffect, useRef } from 'react';
import { Call } from '../types/call';

interface CallNotificationProps {
  call: Call;
  callerName: string;
  onAccept: () => void;
  onReject: () => void;
}

export const CallNotification: React.FC<CallNotificationProps> = ({
  call,
  callerName,
  onAccept,
  onReject,
}) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Play ringtone
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current.play().catch(console.error);
    }

    // Cleanup on unmount
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    };
  }, []);

  const handleAccept = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onAccept();
  };

  const handleReject = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
    onReject();
  };

  return (
    <>
      <audio ref={audioRef} src="/sounds/ringtone.mp3" />
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
          <div className="text-center">
            {/* Caller Avatar */}
            <div className="mb-4">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                <span className="text-white text-2xl font-bold">
                  {callerName.charAt(0).toUpperCase()}
                </span>
              </div>
              <div className="text-lg font-semibold text-gray-900">{callerName}</div>
              <div className="text-sm text-gray-500">
                {call.type === 'video' ? 'Video Call' : 'Voice Call'}
              </div>
            </div>

            {/* Call Status */}
            <div className="mb-6">
              <div className="animate-pulse text-4xl mb-2">📞</div>
              <div className="text-sm text-gray-600">Đang gọi đến...</div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleAccept}
                className="bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition-colors flex items-center gap-2"
              >
                <span className="text-xl">📞</span>
                Chấp nhận
              </button>
              <button
                onClick={handleReject}
                className="bg-red-500 text-white px-6 py-3 rounded-full hover:bg-red-600 transition-colors flex items-center gap-2"
              >
                <span className="text-xl">❌</span>
                Từ chối
              </button>
            </div>

            {/* Call Info */}
            <div className="mt-4 text-xs text-gray-400">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}; 