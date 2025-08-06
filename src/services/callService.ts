import api from './api';
import { Call, CreateCallDto, CallResponse, CallSignal } from '../types/call';

export class CallService {
  // API calls
  static async initiateCall(data: CreateCallDto): Promise<Call> {
    const response = await api.post('/calls', data);
    return response.data;
  }

  static async acceptCall(callId: string): Promise<CallResponse> {
    const response = await api.post(`/calls/${callId}/accept`);
    return response.data;
  }

  static async rejectCall(callId: string): Promise<void> {
    await api.post(`/calls/${callId}/reject`);
  }

  static async endCall(callId: string): Promise<void> {
    await api.post(`/calls/${callId}/end`);
  }

  static async getCallHistory(): Promise<Call[]> {
    const response = await api.get('/calls/history');
    return response.data;
  }

  static async getCallById(callId: string): Promise<Call> {
    const response = await api.get(`/calls/${callId}`);
    return response.data;
  }

  // WebRTC methods
  static async getMediaStream(constraints: MediaStreamConstraints): Promise<MediaStream> {
    try {
      return await navigator.mediaDevices.getUserMedia(constraints);
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  }

  static createPeerConnection(): RTCPeerConnection {
    const configuration: RTCConfiguration = {
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
      ],
    };

    return new RTCPeerConnection(configuration);
  }

  static async createOffer(peerConnection: RTCPeerConnection): Promise<RTCSessionDescriptionInit> {
    const offer = await peerConnection.createOffer();
    await peerConnection.setLocalDescription(offer);
    return offer;
  }

  static async createAnswer(peerConnection: RTCPeerConnection): Promise<RTCSessionDescriptionInit> {
    const answer = await peerConnection.createAnswer();
    await peerConnection.setLocalDescription(answer);
    return answer;
  }

  static async setRemoteDescription(
    peerConnection: RTCPeerConnection,
    description: RTCSessionDescriptionInit
  ): Promise<void> {
    await peerConnection.setRemoteDescription(description);
  }

  static addIceCandidate(
    peerConnection: RTCPeerConnection,
    candidate: RTCIceCandidateInit
  ): Promise<void> {
    return peerConnection.addIceCandidate(candidate);
  }
}

export default CallService; 