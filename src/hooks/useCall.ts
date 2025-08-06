import { useState, useEffect, useRef, useCallback } from 'react';
import useSocket from './useSocket';
import CallService from '../services/callService';
import { Call, CallState, CallSignal } from '../types/call';

export const useCall = (userId?: string) => {
  const [callState, setCallState] = useState<CallState>({
    isInCall: false,
    isMuted: false,
    isVideoEnabled: true,
  });

  const [currentCall, setCurrentCall] = useState<Call | null>(null);
  const [isCalling, setIsCalling] = useState(false);
  const [isRinging, setIsRinging] = useState(false);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localStreamRef = useRef<MediaStream | null>(null);
  const remoteStreamRef = useRef<MediaStream | null>(null);

  const socket = useSocket({
    url: process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:8000',
    query: userId ? { userId } : undefined,
    invalidateKeys: [],
  });

  // Initialize call handlers when socket connects
  useEffect(() => {
    if (!socket) return;

    const handleIncomingCall = (data: { call: Call; offer: RTCSessionDescriptionInit }) => {
      setCurrentCall(data.call);
      setIsRinging(true);
      handleIncomingCallOffer(data.offer);
    };

    const handleCallAccepted = (data: { callId: string; answer: RTCSessionDescriptionInit }) => {
      setIsCalling(false);
      setCallState(prev => ({ ...prev, isInCall: true }));
      handleCallAnswer(data.answer);
    };

    const handleCallRejected = (data: { callId: string }) => {
      setIsCalling(false);
      setCurrentCall(null);
      cleanupCall();
    };

    const handleCallEnded = (data: { callId: string }) => {
      setCallState(prev => ({ ...prev, isInCall: false }));
      setCurrentCall(null);
      setIsCalling(false);
      setIsRinging(false);
      cleanupCall();
    };

    const handleCallSignal = (signal: CallSignal) => {
      handleCallSignal(signal);
    };

    socket.on('incoming-call', handleIncomingCall);
    socket.on('call-accepted', handleCallAccepted);
    socket.on('call-rejected', handleCallRejected);
    socket.on('call-ended', handleCallEnded);
    socket.on('call-signal', handleCallSignal);

    return () => {
      socket.off('incoming-call', handleIncomingCall);
      socket.off('call-accepted', handleCallAccepted);
      socket.off('call-rejected', handleCallRejected);
      socket.off('call-ended', handleCallEnded);
      socket.off('call-signal', handleCallSignal);
    };
  }, [socket]);

  const cleanupCall = useCallback(() => {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }
    setCallState(prev => ({
      ...prev,
      localStream: undefined,
      remoteStream: undefined,
    }));
  }, []);

  const handleIncomingCallOffer = useCallback(async (offer: RTCSessionDescriptionInit) => {
    try {
      const stream = await CallService.getMediaStream({ audio: true, video: true });
      localStreamRef.current = stream;
      
      const peerConnection = CallService.createPeerConnection();
      peerConnectionRef.current = peerConnection;

      // Add local stream tracks
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        remoteStreamRef.current = event.streams[0];
        setCallState(prev => ({ ...prev, remoteStream: event.streams[0] }));
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket?.emit('call-signal', {
            callId: currentCall?.id,
            type: 'ice-candidate',
            data: event.candidate,
          });
        }
      };

      await CallService.setRemoteDescription(peerConnection, offer);
      const answer = await CallService.createAnswer(peerConnection);

      socket?.emit('call-signal', {
        callId: currentCall?.id,
        type: 'answer',
        data: answer,
      });
    } catch (error) {
      console.error('Error handling incoming call offer:', error);
    }
  }, [socket, currentCall]);

  const handleCallAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
    if (peerConnectionRef.current) {
      await CallService.setRemoteDescription(peerConnectionRef.current, answer);
    }
  }, []);

  const handleCallSignal = useCallback((signal: CallSignal) => {
    if (!peerConnectionRef.current) return;

    switch (signal.type) {
      case 'ice-candidate':
        CallService.addIceCandidate(peerConnectionRef.current, signal.data);
        break;
      case 'hangup':
        cleanupCall();
        break;
    }
  }, [cleanupCall]);

  const initiateCall = useCallback(async (receiverId: string, type: 'voice' | 'video') => {
    try {
      setIsCalling(true);
      
      const stream = await CallService.getMediaStream({ 
        audio: true, 
        video: type === 'video' 
      });
      localStreamRef.current = stream;
      
      const peerConnection = CallService.createPeerConnection();
      peerConnectionRef.current = peerConnection;

      // Add local stream tracks
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Handle remote stream
      peerConnection.ontrack = (event) => {
        remoteStreamRef.current = event.streams[0];
        setCallState(prev => ({ ...prev, remoteStream: event.streams[0] }));
      };

      // Handle ICE candidates
      peerConnection.onicecandidate = (event) => {
        if (event.candidate) {
          socket?.emit('call-signal', {
            callId: currentCall?.id,
            type: 'ice-candidate',
            data: event.candidate,
          });
        }
      };

      const offer = await CallService.createOffer(peerConnection);

      const call = await CallService.initiateCall({ receiverId, type });
      setCurrentCall(call);

      socket?.emit('call-signal', {
        callId: call.id,
        type: 'offer',
        data: offer,
      });
    } catch (error) {
      console.error('Error initiating call:', error);
      setIsCalling(false);
      cleanupCall();
    }
  }, [socket, cleanupCall, currentCall]);

  const acceptCall = useCallback(async () => {
    if (!currentCall) return;

    try {
      await CallService.acceptCall(currentCall.id);
      setIsRinging(false);
      setCallState(prev => ({ ...prev, isInCall: true }));
    } catch (error) {
      console.error('Error accepting call:', error);
    }
  }, [currentCall]);

  const rejectCall = useCallback(async () => {
    if (!currentCall) return;

    try {
      await CallService.rejectCall(currentCall.id);
      setIsRinging(false);
      setCurrentCall(null);
      cleanupCall();
    } catch (error) {
      console.error('Error rejecting call:', error);
    }
  }, [currentCall, cleanupCall]);

  const endCall = useCallback(async () => {
    if (!currentCall) return;

    try {
      await CallService.endCall(currentCall.id);
      socket?.emit('call-signal', {
        callId: currentCall.id,
        type: 'hangup',
      });
      
      setCallState(prev => ({ ...prev, isInCall: false }));
      setCurrentCall(null);
      setIsCalling(false);
      cleanupCall();
    } catch (error) {
      console.error('Error ending call:', error);
    }
  }, [currentCall, socket, cleanupCall]);

  const toggleMute = useCallback(() => {
    if (localStreamRef.current) {
      const audioTrack = localStreamRef.current.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setCallState(prev => ({ ...prev, isMuted: !prev.isMuted }));
      }
    }
  }, []);

  const toggleVideo = useCallback(() => {
    if (localStreamRef.current) {
      const videoTrack = localStreamRef.current.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setCallState(prev => ({ ...prev, isVideoEnabled: !prev.isVideoEnabled }));
      }
    }
  }, []);

  return {
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
  };
}; 