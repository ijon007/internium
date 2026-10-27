export type MessageStatus = "sent" | "delivered" | "read";

export type ChatAttachment = {
  id: string;
  name: string;
  kind: "pdf" | "sheet" | "image" | "file";
  sizeLabel: string;
};

export type ChatReaction = {
  emoji: string;
  authors: string[];
};

export type ChatReplyRef = {
  id: string;
  author: string;
  body: string;
};

export type ChatMessage = {
  id: string;
  author: string;
  avatar: string;
  body: string;
  sentAt: string;
  day: string;
  replyTo?: ChatReplyRef;
  reactions?: ChatReaction[];
  editedAt?: string;
  deletedAt?: string;
  pinned?: boolean;
  attachments?: ChatAttachment[];
  status?: MessageStatus;
  forwardedFrom?: string;
};

export type PeerPresence = "online" | "away" | "offline";

export type Conversation = {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageAt: string;
  unreadCount: number;
  /** Index into messages where unread starts; null if none. */
  firstUnreadMessageId: string | null;
  pinned: boolean;
  presence: PeerPresence;
  lastSeenAt: string;
  messages: ChatMessage[];
};
