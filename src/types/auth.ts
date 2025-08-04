export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface User {
  sub: string;
  email: string;
}

export interface UserWithLastMessage {
  id: string;
  createdAt: string;
  updatedAt: string;
  username: string;
  email: string;
  avatar: string;
  lastMessage: {
    content: string;
  } | null;
}
