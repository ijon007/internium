export type ChatMessage = {
  id: string;
  author: string;
  avatar: string;
  body: string;
  sentAt: string;
  day: string;
};

export type Conversation = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  pinned: boolean;
  messages: ChatMessage[];
};
