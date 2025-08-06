"use client";
import React from 'react';
import { useCall } from '../hooks/useCall';

interface CallControlsProps {
  userId?: string;
  receiverId?: string;
  receiverName?: string;
}

export const CallControls: React.FC<CallControlsProps> = ({
  userId,
  receiverId,
  receiverName,
}) => {
  const {
    callState,
    currentCall,
    isCalling,
    isRinging,
    initiateCall,
    acceptCall,
    rejectCall,
    endCall,
    toggleMute,
    toggleVideo,
  } = useCall(userId);

  const handleVoiceCall = () => {
    if (receiverId) {
      initiateCall(receiverId, 'voice');
    }
  };

  const handleVideoCall = () => {
    if (receiverId) {
      initiateCall(receiverId, 'video');
    }
  };

  if (isRinging) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">Incoming Call</div>
            <div className="text-gray-600 mb-4">
              {currentCall?.type === 'video' ? 'Video Call' : 'Voice Call'} from{' '}
              {receiverName || 'Unknown'}
            </div>
            <div className="flex gap-3 justify-center">
              <button
                onClick={acceptCall}
                className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600"
              >
                Accept
              </button>
              <button
                onClick={rejectCall}
                className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (callState.isInCall) {
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
          {callState.localStream && currentCall?.type === 'video' && (
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
              } text-white hover:opacity-80`}
            >
              {callState.isMuted ? '🔇' : '🎤'}
            </button>
            {currentCall?.type === 'video' && (
              <button
                onClick={toggleVideo}
                className={`p-3 rounded-full ${
                  callState.isVideoEnabled ? 'bg-gray-600' : 'bg-red-500'
                } text-white hover:opacity-80`}
              >
                {callState.isVideoEnabled ? '📹' : '🚫'}
              </button>
            )}
            <button
              onClick={endCall}
              className="bg-red-500 p-3 rounded-full text-white hover:bg-red-600"
            >
              📞
            </button>
          </div>

          {/* Call Info */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
            <div className="font-semibold">
              {currentCall?.type === 'video' ? 'Video Call' : 'Voice Call'}
            </div>
            <div className="text-sm opacity-75">
              {receiverName || 'Unknown'}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isCalling) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
          <div className="text-center">
            <div className="text-2xl font-bold mb-2">Calling...</div>
            <div className="text-gray-600 mb-4">
              {currentCall?.type === 'video' ? 'Video Call' : 'Voice Call'} to{' '}
              {receiverName || 'Unknown'}
            </div>
            <div className="animate-pulse">
              <div className="text-4xl mb-4">📞</div>
            </div>
            <button
              onClick={endCall}
              className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <button
        onClick={handleVoiceCall}
        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 flex items-center gap-2"
      >
        📞 Voice Call
      </button>
      <button
        onClick={handleVideoCall}
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
      >
        📹 Video Call
      </button>
    </div>
  );
}; 