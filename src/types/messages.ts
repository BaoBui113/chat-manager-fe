export interface Messages {
  id: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  sender: {
    id: string;
    username: string;
    email: string; // Optional, as it may not be needed in all contexts
  };
  receiver: {
    id: string;
    username: string;
    email: string;
  };
}

export interface CreateMessageDto {
  receiverId: string;
  content: string;
}
