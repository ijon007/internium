import type { Conversation } from "@/types/chat";

export const CHAT_PATH = "chat";

export const CONVERSATION_PARAM = "c";

export const MOCK_CONVERSATIONS: Conversation[] = [
  {
    id: "1",
    name: "Maria Popescu",
    avatar: "",
    lastMessage: "Can you review my weekly report before Friday? I added the new section on the database migration.",
    lastMessageAt: "10:42",
    unreadCount: 2,
    pinned: false,
  },
  {
    id: "2",
    name: "Andrei Ionescu",
    avatar: "",
    lastMessage: "Thanks, see you tomorrow at the office!",
    lastMessageAt: "09:15",
    unreadCount: 0,
    pinned: false,
  },
  {
    id: "3",
    name: "Elena Dumitru",
    avatar: "",
    lastMessage: "The attendance sheet for this week has been uploaded.",
    lastMessageAt: "Yesterday",
    unreadCount: 1,
    pinned: false,
  },
  {
    id: "4",
    name: "Mihai Stan",
    avatar: "",
    lastMessage: "I'll be absent on Monday, I sent the medical note to the coordinator.",
    lastMessageAt: "Yesterday",
    unreadCount: 0,
    pinned: false,
  },
  {
    id: "5",
    name: "Ioana Georgescu",
    avatar: "",
    lastMessage: "Great work on the presentation, the client loved it.",
    lastMessageAt: "Mon",
    unreadCount: 0,
    pinned: false,
  },
  {
    id: "6",
    name: "Radu Constantin",
    avatar: "",
    lastMessage: "Do we have a template for the internship agreement?",
    lastMessageAt: "Oct 18",
    unreadCount: 0,
    pinned: false,
  },
];
