export interface Call {
  id: string;
  callerId: string;
  receiverId: string;
  type: 'voice' | 'video';
  status: 'pending' | 'accepted' | 'rejected' | 'ended' | 'missed';
  startTime?: Date;
  endTime?: Date;
  duration?: number; // in seconds
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCallDto {
  receiverId: string;
  type: 'voice' | 'video';
}

export interface CallResponse {
  callId: string;
  status: 'accepted' | 'rejected';
}

export interface CallSignal {
  callId: string;
  type: 'offer' | 'answer' | 'ice-candidate' | 'hangup';
  data?: any;
}

export interface CallState {
  isInCall: boolean;
  currentCall?: Call;
  isMuted: boolean;
  isVideoEnabled: boolean;
  localStream?: MediaStream;
  remoteStream?: MediaStream;
} 