# Call Implementation Guide

## 🎯 Tổng quan

Đã implement đầy đủ call functionality cho chat app với:
- Voice calls
- Video calls  
- Real-time WebRTC communication
- Call notifications với âm thanh
- Call history

## 📁 Cấu trúc Files

```
src/
├── types/
│   └── call.ts                    # Call interfaces
├── services/
│   └── callService.ts             # API calls & WebRTC methods
├── hooks/
│   └── useCall.ts                 # Call state management
├── components/
│   ├── CallControls.tsx           # Call UI controls
│   ├── CallHistory.tsx            # Call history display
│   └── CallNotification.tsx       # Incoming call notification
├── contexts/
│   └── CallContext.tsx            # Global call state
└── app/
    └── page.tsx                   # Main chat with call integration
```

## 🚀 Cách sử dụng

### 1. Backend API Endpoints cần thiết:

```typescript
// POST /api/calls - Tạo cuộc gọi mới
POST /api/calls
{
  "receiverId": "string",
  "type": "voice" | "video"
}

// POST /api/calls/:id/accept - Chấp nhận cuộc gọi
POST /api/calls/{callId}/accept

// POST /api/calls/:id/reject - Từ chối cuộc gọi  
POST /api/calls/{callId}/reject

// POST /api/calls/:id/end - Kết thúc cuộc gọi
POST /api/calls/{callId}/end

// GET /api/calls/history - Lấy lịch sử cuộc gọi
GET /api/calls/history

// GET /api/calls/:id - Lấy thông tin cuộc gọi
GET /api/calls/{callId}
```

### 2. Socket.IO Events:

**Client emit:**
```typescript
// Gửi WebRTC signal
socket.emit('call-signal', {
  callId: string,
  type: 'offer' | 'answer' | 'ice-candidate' | 'hangup',
  data?: any
});
```

**Server emit:**
```typescript
// Gửi cuộc gọi đến cho receiver
socket.emit('incoming-call', {
  call: Call,
  offer: RTCSessionDescriptionInit
});

// Thông báo call được chấp nhận
socket.emit('call-accepted', {
  callId: string,
  answer: RTCSessionDescriptionInit
});

// Thông báo call bị từ chối
socket.emit('call-rejected', { callId: string });

// Thông báo call kết thúc
socket.emit('call-ended', { callId: string });

// Gửi WebRTC signal
socket.emit('call-signal', signal);
```

### 3. Environment Variables:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_SOCKET_URL=http://localhost:8000
```

### 4. Call Flow:

#### Voice/Video Call:
1. User A click call button
2. Frontend gọi `POST /api/calls`
3. Backend tạo call record và emit `incoming-call` cho User B
4. User B nhận notification với âm thanh
5. User B accept/reject → WebRTC signaling
6. Call established → Real-time audio/video

#### Call Controls:
- **Mute/Unmute**: Toggle audio track
- **Video On/Off**: Toggle video track (chỉ video call)
- **End Call**: Kết thúc cuộc gọi

## 🎨 UI Features

### Call Notification:
- Modal với avatar caller
- Ringtone âm thanh
- Accept/Reject buttons
- Call type indicator

### Active Call:
- Full-screen video (video call)
- Local video preview (góc trên phải)
- Call controls (mute, video, end)
- Call info overlay

### Call History:
- List tất cả cuộc gọi
- Status indicators
- Duration display
- Date/time formatting

## 🔧 WebRTC Configuration

```typescript
// STUN servers cho NAT traversal
iceServers: [
  { urls: 'stun:stun.l.google.com:19302' },
  { urls: 'stun:stun1.l.google.com:19302' },
]
```

## 📱 Browser Permissions

App sẽ yêu cầu:
- **Microphone permission** cho voice calls
- **Camera permission** cho video calls

## 🎵 Audio Files

Cần thêm file âm thanh:
```
public/sounds/ringtone.mp3
```

## 🚨 Error Handling

- Media device access errors
- Network connectivity issues
- WebRTC connection failures
- Socket disconnection

## 🔄 State Management

Call states:
- `isCalling`: Đang gọi
- `isRinging`: Có cuộc gọi đến
- `isInCall`: Đang trong cuộc gọi
- `isMuted`: Microphone tắt
- `isVideoEnabled`: Camera bật

## 📊 Performance

- Automatic cleanup khi call kết thúc
- Memory leak prevention
- Efficient WebRTC stream handling
- Optimized re-renders

## 🔒 Security

- JWT authentication cho API calls
- Socket.IO authentication
- Media stream security
- HTTPS required cho production

## 🧪 Testing

Test cases cần thiết:
- Call initiation
- Call acceptance/rejection
- WebRTC connection
- Audio/video quality
- Call controls functionality
- Error scenarios 